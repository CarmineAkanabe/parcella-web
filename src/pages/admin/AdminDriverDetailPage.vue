<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import {
  AppCard,
  ConfirmDialog,
  ErrorBanner,
  PageHeader,
  StatusPill,
  UserAvatar,
} from '@/components/common'
import LicenseBlobViewer from '@/components/complex/admin/LicenseBlobViewer.vue'
import RejectDriverDialog from '@/components/complex/admin/RejectDriverDialog.vue'
import {
  decideDriverVerificationApi,
  getAdminDriverDetailApi,
  type AdminDriverResponse,
} from '@/features/admin'
import { useToast } from '@/shared/composables/useToast'
import { formatDateTime } from '@/shared/utils'

const route = useRoute()
const toast = useToast()

const driverId = computed(() => String(route.params.id))

const detail = ref<AdminDriverResponse | null>(null)
const isLoading = ref(true)
const loadError = ref<unknown>(null)

const showApproveDialog = ref(false)
const isApproving = ref(false)

const showRejectDialog = ref(false)
const isRejecting = ref(false)

const user = computed(() => detail.value?.user ?? null)
const driver = computed(() => user.value?.driver ?? null)
const licenseImageUrl = computed(() => detail.value?.licenseImageUrl ?? null)

const isPending = computed(() => driver.value?.verificationStatus === 'PENDING')
const canApprove = computed(() => isPending.value && Boolean(licenseImageUrl.value))

async function fetchDriverDetail(): Promise<void> {
  isLoading.value = true
  loadError.value = null
  try {
    detail.value = await getAdminDriverDetailApi(driverId.value)
  } catch (err: unknown) {
    loadError.value = err
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchDriverDetail()
})

async function handleApprove(): Promise<void> {
  if (!canApprove.value) return

  isApproving.value = true
  try {
    const updated = await decideDriverVerificationApi(driverId.value, { decision: 'APPROVED' })
    if (detail.value) {
      detail.value.user = updated
    }
    showApproveDialog.value = false
    toast.success(`Driver ${updated.fullName} has been approved.`)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to approve driver'
    toast.error(msg)
  } finally {
    isApproving.value = false
  }
}

async function handleReject(note: string): Promise<void> {
  isRejecting.value = true
  try {
    const updated = await decideDriverVerificationApi(driverId.value, {
      decision: 'REJECTED',
      note,
    })
    if (detail.value) {
      detail.value.user = updated
    }
    showRejectDialog.value = false
    toast.success(`Driver application rejected with compliance notice.`)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to reject driver application'
    toast.error(msg)
  } finally {
    isRejecting.value = false
  }
}
</script>

<template>
  <div>
    <!-- Loading State -->
    <div v-if="isLoading" class="py-16 text-center">
      <v-progress-circular indeterminate color="primary" size="48" />
      <div class="text-caption text-medium-emphasis mt-3">Loading compliance dossier...</div>
    </div>

    <!-- Error State -->
    <div v-else-if="loadError || !user" class="py-8">
      <PageHeader
        eyebrow="Compliance Dossier"
        title="Driver Record Not Found"
        back-to="/admin/drivers"
      />
      <ErrorBanner
        title="Could not find driver dossier"
        detail="The requested driver ID does not exist or you lack administrative authorization."
        :error="loadError"
        class="mt-4"
        @retry="fetchDriverDetail"
      />
    </div>

    <!-- Dossier Content -->
    <div v-else>
      <PageHeader
        eyebrow="Compliance Dossier"
        :title="user.fullName"
        :subtitle="`Dossier reference CMR-DRV-${user.id.slice(0, 8).toUpperCase()}`"
        back-to="/admin/drivers"
      >
        <template #status>
          <StatusPill v-if="driver" :status="driver.verificationStatus" />
        </template>

        <template #actions>
          <div class="d-flex align-center ga-2">
            <v-btn
              color="error"
              variant="outlined"
              size="small"
              prepend-icon="mdi-close-circle-outline"
              :disabled="!isPending"
              @click="showRejectDialog = true"
            >
              Reject with Note
            </v-btn>

            <v-btn
              color="success"
              variant="flat"
              size="small"
              prepend-icon="mdi-check-decagram"
              :disabled="!canApprove"
              @click="showApproveDialog = true"
            >
              Approve Driver
            </v-btn>
          </div>
        </template>
      </PageHeader>

      <!-- Warning if pending but license is missing -->
      <v-alert
        v-if="isPending && !licenseImageUrl"
        type="warning"
        variant="tonal"
        density="comfortable"
        class="mt-3 mb-2"
      >
        <div class="text-caption">
          <strong>License Document Missing:</strong> Driver has not uploaded a license document yet. The applicant cannot be approved until a valid license is on record.
        </div>
      </v-alert>

      <v-row class="mt-2" dense>
        <!-- Left Column: Courier Profile & Metadata -->
        <v-col cols="12" md="4">
          <AppCard title="Applicant Profile" class="fill-height">
            <div class="d-flex align-center ga-3 mb-4">
              <UserAvatar
                :avatar-url="user.avatarUrl"
                :full-name="user.fullName"
                :size="64"
                rounded="lg"
              />
              <div class="overflow-hidden">
                <div class="text-subtitle-1 font-weight-bold text-truncate">{{ user.fullName }}</div>
                <div class="text-caption font-mono text-medium-emphasis text-truncate">{{ user.email }}</div>
                <div class="mt-1">
                  <StatusPill :status="user.role" size="x-small" />
                </div>
              </div>
            </div>

            <!-- Previous Rejection Note if exists -->
            <v-alert
              v-if="driver?.verificationNote"
              type="error"
              variant="tonal"
              density="compact"
              class="mb-4 text-caption"
            >
              <div class="font-weight-bold">Current Rejection Reason:</div>
              <div>{{ driver.verificationNote }}</div>
            </v-alert>

            <v-divider class="mb-3" />

            <div class="d-flex flex-column ga-3 text-caption">
              <div>
                <span class="text-medium-emphasis d-block">Mobile Money Contact:</span>
                <span class="font-mono font-weight-bold text-body-2">{{ user.paymentPhoneNumber || '—' }}</span>
              </div>
              <div>
                <span class="text-medium-emphasis d-block">Preferred SMS Contact:</span>
                <span class="font-mono text-body-2">{{ user.preferredContactNumber || '—' }}</span>
              </div>
              <div>
                <span class="text-medium-emphasis d-block">Registered Hub / Landmark:</span>
                <span class="font-weight-semibold">{{ user.registeredLocation?.address || '—' }}</span>
              </div>
              <div class="d-flex justify-space-between">
                <span class="text-medium-emphasis">Courier Rating:</span>
                <span class="font-mono font-weight-bold">★ {{ driver?.averageRating.toFixed(1) ?? '—' }}</span>
              </div>
              <div class="d-flex justify-space-between">
                <span class="text-medium-emphasis">Escrow Trust Score:</span>
                <span class="font-mono font-weight-bold">{{ driver?.trustScore.toFixed(0) ?? '—' }} pts</span>
              </div>
              <div class="d-flex justify-space-between">
                <span class="text-medium-emphasis">Registered On:</span>
                <span class="font-weight-semibold">{{ formatDateTime(user.createdAt) }}</span>
              </div>
            </div>
          </AppCard>
        </v-col>

        <!-- Right Column: Authenticated License Stream Viewer -->
        <v-col cols="12" md="8">
          <LicenseBlobViewer :license-image-url="licenseImageUrl" />
        </v-col>
      </v-row>
    </div>

    <!-- Approve Confirmation Dialog -->
    <ConfirmDialog
      v-model="showApproveDialog"
      title="Approve Driver Application"
      :message="`Are you sure you want to approve ${user?.fullName ?? 'this courier'}? They will be permitted to switch their availability to online and accept delivery assignments.`"
      confirm-label="Approve Courier"
      :loading="isApproving"
      @confirm="handleApprove"
    />

    <!-- Reject Dialog with Note -->
    <RejectDriverDialog
      v-model="showRejectDialog"
      :driver-name="user?.fullName"
      :loading="isRejecting"
      @confirm="handleReject"
    />
  </div>
</template>
