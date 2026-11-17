<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { AppCard, EmptyState, ErrorBanner, PageHeader, StatusPill } from '@/components/common'
import LocationPicker from '@/components/complex/map/LocationPicker.vue'
import { getMeApi, updateProfileSchema, type UpdateProfilePayload } from '@/features/auth'
import { useFormErrors } from '@/shared/composables/useFormErrors'
import { useToast } from '@/shared/composables/useToast'
import { useAuthStore } from '@/shared/stores/auth'
import type { Location } from '@/shared/types'
import { formatDateTime } from '@/shared/utils'

const authStore = useAuthStore()
const toast = useToast()

const isPageLoading = ref(false)
const loadError = ref<unknown>(null)
const isSaving = ref(false)
const showLocationEditorForAdmin = ref(false)

const fullName = ref('')
const paymentPhoneNumber = ref('')
const preferredContactNumber = ref('')
const registeredLocation = ref<Location | null>(null)

const {
  formError,
  validate,
  setServerErrors,
  firstError,
  firstErrorForPrefix,
  clearField,
  clearPrefix,
  clearAll,
} = useFormErrors(updateProfileSchema)

const user = computed(() => authStore.user)
const driverSummary = computed(() => user.value?.driver ?? null)
const isAdmin = computed(() => user.value?.role === 'ADMIN')
const primaryStatus = computed(() => driverSummary.value?.verificationStatus ?? user.value?.role ?? 'CUSTOMER')

const userInitials = computed(() => {
  const name = user.value?.fullName?.trim()
  if (!name) return 'PC'
  const parts = name.split(/\s+/)
  return `${parts[0]?.[0] ?? 'P'}${parts[1]?.[0] ?? ''}`.toUpperCase()
})

const formattedAccountId = computed(() => {
  const id = user.value?.id
  if (!id) return 'CMR-USER'
  const rolePrefix = user.value?.role === 'DRIVER' ? 'DRV' : user.value?.role === 'ADMIN' ? 'ADM' : 'CST'
  return `CMR-${rolePrefix}-${id.slice(0, 8).toUpperCase()}`
})

async function copyAccountId(): Promise<void> {
  if (!user.value?.id) return
  try {
    await navigator.clipboard.writeText(user.value.id)
    toast.info('Account ID copied to clipboard.')
  } catch {
    toast.info(user.value.id)
  }
}

function syncFormFromUser(): void {
  const current = authStore.user
  if (!current) return
  fullName.value = current.fullName
  paymentPhoneNumber.value = current.paymentPhoneNumber
  preferredContactNumber.value = current.preferredContactNumber
  registeredLocation.value = current.registeredLocation ? { ...current.registeredLocation } : null
  showLocationEditorForAdmin.value = Boolean(current.registeredLocation)
  clearAll()
}

watch(() => authStore.user, syncFormFromUser, { immediate: true })

async function refreshProfile(): Promise<void> {
  isPageLoading.value = true
  loadError.value = null
  try {
    authStore.user = await getMeApi()
    syncFormFromUser()
  } catch (err: unknown) {
    loadError.value = err
  } finally {
    isPageLoading.value = false
  }
}

onMounted(async () => {
  if (!authStore.user) await refreshProfile()
})

function handleLocationChange(loc: Location): void {
  registeredLocation.value = loc
  clearPrefix('registeredLocation')
}

async function handleSave(): Promise<void> {
  const payload: UpdateProfilePayload = {
    fullName: fullName.value.trim(),
    paymentPhoneNumber: paymentPhoneNumber.value.trim(),
    preferredContactNumber: preferredContactNumber.value.trim(),
  }

  if (registeredLocation.value) {
    payload.registeredLocation = {
      lat: registeredLocation.value.lat,
      lng: registeredLocation.value.lng,
      address: registeredLocation.value.address.trim(),
    }
  } else if (!isAdmin.value) {
    setServerErrors({
      detail: 'Please select a valid default location on the map.',
      errors: { 'registeredLocation.address': ['Default location is required'] },
    })
    return
  }

  if (!validate(payload)) return

  isSaving.value = true
  try {
    await authStore.updateProfile(payload)
    toast.success('Profile and hub settings saved.')
  } catch (err: unknown) {
    setServerErrors(err)
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div>
    <!-- Top PageHeader (Matches Stitch Screen 2) -->
    <PageHeader
      title="Account &amp; Profile"
      subtitle="Manage your personal credentials, Mobile Money payout accounts, and default dispatch hub coordinates."
    >
      <template #status>
        <StatusPill :status="primaryStatus" />
      </template>
      <template #actions>
        <v-btn variant="outlined" color="secondary" size="small" prepend-icon="mdi-refresh" :loading="isPageLoading" @click="refreshProfile">
          Sync Data
        </v-btn>
        <v-btn color="primary" variant="flat" size="small" prepend-icon="mdi-check" :loading="isSaving" :disabled="isSaving" class="font-weight-bold" @click="handleSave">
          Save All Changes
        </v-btn>
      </template>
    </PageHeader>

    <ErrorBanner v-if="loadError" title="Unable to load profile" :error="loadError" class="mt-4" @retry="refreshProfile" />

    <v-row v-else-if="isPageLoading && !user" class="mt-2">
      <v-col cols="12" lg="4">
        <v-skeleton-loader type="card, list-item-three-line" rounded="lg" />
      </v-col>
      <v-col cols="12" lg="8">
        <v-skeleton-loader type="article, actions" rounded="lg" />
      </v-col>
    </v-row>

    <v-row v-else-if="user" class="mt-2">
      <!-- LEFT COLUMN (4 cols): Card 1 (Account Overview) & Card 2 (Driver Status) -->
      <v-col cols="12" lg="4" class="d-flex flex-column ga-5">
        <AppCard>
          <div class="d-flex align-start justify-space-between mb-4">
            <v-avatar size="68" rounded="lg" color="surface-variant" class="avatar-box">
              <span class="text-h5 font-weight-bold text-primary">{{ userInitials }}</span>
            </v-avatar>
            <div class="d-flex flex-column align-end ga-1">
              <StatusPill :status="user.role" size="x-small" />
              <span class="text-caption font-mono text-medium-emphasis">Escrow Verified</span>
            </div>
          </div>

          <div class="mb-4">
            <h2 class="text-h6 font-weight-bold">{{ user.fullName }}</h2>
            <p class="text-body-2 text-medium-emphasis mb-0">{{ user.email }}</p>
          </div>

          <!-- Monospace Account ID Box with Copy Button (Matches Stitch Card 1) -->
          <div class="id-readout-box pa-3 rounded-lg d-flex align-center justify-space-between mb-4">
            <div class="overflow-hidden">
              <span class="text-caption font-weight-bold text-uppercase text-medium-emphasis d-block">
                Account Reference ID
              </span>
              <span class="font-mono text-body-2 font-weight-bold text-truncate d-block" :title="user.id">
                {{ formattedAccountId }}
              </span>
            </div>
            <v-btn icon="mdi-content-copy" variant="text" size="small" color="secondary" aria-label="Copy Account ID" @click="copyAccountId" />
          </div>

          <v-divider class="mb-3" />

          <div class="d-flex flex-column ga-2 text-caption">
            <div class="d-flex justify-space-between">
              <span class="text-medium-emphasis">Member Since:</span>
              <span class="font-weight-semibold">{{ formatDateTime(user.createdAt) }}</span>
            </div>
            <div class="d-flex justify-space-between">
              <span class="text-medium-emphasis">Escrow Protection:</span>
              <span class="font-mono text-success font-weight-bold">● 100% Active</span>
            </div>
          </div>
        </AppCard>

        <!-- Card 2: Driver Status & 2x2 Metrics Grid (Matches Stitch Card 2) -->
        <AppCard v-if="driverSummary">
          <div class="d-flex align-center justify-space-between mb-4">
            <h3 class="text-subtitle-1 font-weight-bold">Dispatch Availability</h3>
            <StatusPill :status="driverSummary.verificationStatus" size="x-small" />
          </div>

          <div class="availability-banner pa-3 rounded-lg d-flex align-center justify-space-between mb-4">
            <div>
              <div class="text-body-2 font-weight-bold">Current Dispatch Status</div>
              <div class="text-caption text-medium-emphasis">Live standing on the Parcella ledger</div>
            </div>
            <StatusPill :status="driverSummary.availabilityStatus" size="small" />
          </div>

          <div class="text-caption font-weight-bold text-uppercase text-medium-emphasis mb-2">
            Delivery Escrow Performance
          </div>

          <div class="metrics-grid">
            <div class="metric-tile pa-3 rounded-lg">
              <span class="text-caption text-medium-emphasis d-block">Courier Rating</span>
              <div class="d-flex align-baseline ga-1 mt-1">
                <span class="text-h6 font-weight-bold font-mono">{{ driverSummary.averageRating.toFixed(1) }}</span>
                <span class="text-caption font-mono text-medium-emphasis">/ 5.0</span>
              </div>
            </div>
            <div class="metric-tile pa-3 rounded-lg">
              <span class="text-caption text-medium-emphasis d-block">Trust Score</span>
              <div class="d-flex align-baseline ga-1 mt-1">
                <span class="text-h6 font-weight-bold font-mono">{{ driverSummary.trustScore.toFixed(0) }}</span>
                <span class="text-caption font-mono text-medium-emphasis">pts</span>
              </div>
            </div>
          </div>
        </AppCard>
      </v-col>

      <!-- RIGHT COLUMN (8 cols): Card 3 (Personal Info) & Card 4 (LocationPicker Hub) -->
      <v-col cols="12" lg="8">
        <v-form novalidate class="d-flex flex-column ga-5" @submit.prevent="handleSave">
          <ErrorBanner v-if="formError" title="Could not save profile changes" :detail="formError" :retryable="false" />

          <!-- Card 3: Personal Information & Contacts (Matches Stitch Card 3) -->
          <AppCard
            title="Personal Information &amp; Contacts"
            subtitle="Updates reflect across active delivery handshakes and carrier manifest records."
            :loading="isSaving"
          >
            <template #actions>
              <v-icon icon="mdi-card-account-details-outline" color="secondary" />
            </template>

            <div class="d-flex flex-column ga-4">
              <v-row dense>
                <v-col cols="12" md="6">
                  <label class="field-label">Full Legal Name</label>
                  <v-text-field
                    v-model="fullName"
                    prepend-inner-icon="mdi-account-outline"
                    :disabled="isSaving"
                    :error="Boolean(firstError('fullName'))"
                    :error-messages="firstError('fullName')"
                    @update:model-value="clearField('fullName')"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <div class="d-flex align-center justify-space-between">
                    <label class="field-label">Official Parcella Email</label>
                    <span class="text-caption text-medium-emphasis">🔒 Locked</span>
                  </div>
                  <v-text-field
                    :model-value="user.email"
                    prepend-inner-icon="mdi-lock-outline"
                    disabled
                  />
                </v-col>
              </v-row>

              <v-divider />

              <v-row dense>
                <v-col cols="12" md="6">
                  <div class="d-flex align-center justify-space-between">
                    <label class="field-label">Mobile Money Payout Number</label>
                    <v-chip size="x-small" color="success" variant="tonal" class="font-mono font-weight-bold mb-1">
                      PRIMARY ESCROW
                    </v-chip>
                  </div>
                  <v-text-field
                    v-model="paymentPhoneNumber"
                    placeholder="237677894210"
                    prepend-inner-icon="mdi-cellphone-check"
                    class="font-mono"
                    :disabled="isSaving"
                    :error="Boolean(firstError('paymentPhoneNumber'))"
                    :error-messages="firstError('paymentPhoneNumber')"
                    @update:model-value="clearField('paymentPhoneNumber')"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <div class="d-flex align-center justify-space-between">
                    <label class="field-label">Backup / Dispatch Contact Number</label>
                    <span class="text-caption font-mono text-medium-emphasis mb-1">SMS &amp; Calls</span>
                  </div>
                  <v-text-field
                    v-model="preferredContactNumber"
                    placeholder="237699123456"
                    prepend-inner-icon="mdi-phone-outline"
                    class="font-mono"
                    :disabled="isSaving"
                    :error="Boolean(firstError('preferredContactNumber'))"
                    :error-messages="firstError('preferredContactNumber')"
                    @update:model-value="clearField('preferredContactNumber')"
                  />
                </v-col>
              </v-row>
            </div>
          </AppCard>

          <!-- Card 4: Default Dispatch Hub & Map (Matches Stitch Card 4) -->
          <AppCard
            title="Default Dispatch Hub &amp; Rendezvous Point"
            subtitle="Couriers within proximity receive priority alerts for incoming parcel escrows."
            :loading="isSaving"
          >
            <template #actions>
              <v-chip size="x-small" color="primary" variant="tonal" class="font-mono font-weight-bold">
                GEO-FENCE PIN
              </v-chip>
            </template>

            <EmptyState
              v-if="isAdmin && !registeredLocation && !showLocationEditorForAdmin"
              compact
              icon="mdi-map-marker-off-outline"
              title="No default location set"
              description="Admin accounts do not require a default location, or you can optionally pin one on the map."
              action-label="Pin Default Location"
              @action="showLocationEditorForAdmin = true"
            />

            <LocationPicker
              v-else
              :model-value="registeredLocation"
              label="Confirmed Physical Dispatch Address &amp; Landmarks"
              :disabled="isSaving"
              :error-message="firstErrorForPrefix('registeredLocation')"
              @update:model-value="handleLocationChange"
            />

            <template #footer>
              <div class="d-flex flex-wrap align-center justify-space-between ga-3">
                <v-btn variant="outlined" color="secondary" size="small" prepend-icon="mdi-restore" :disabled="isSaving" @click="syncFormFromUser">
                  Reset to Saved Location
                </v-btn>
                <v-btn type="submit" color="primary" variant="flat" prepend-icon="mdi-check-circle-outline" :loading="isSaving" :disabled="isSaving" class="font-weight-bold px-5">
                  Save Profile &amp; Hub Changes
                </v-btn>
              </div>
            </template>
          </AppCard>
        </v-form>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>
.avatar-box {
  border: 2px solid var(--border-subtle);
}

.id-readout-box,
.availability-banner,
.metric-tile {
  background-color: rgba(var(--v-theme-surface-variant), 0.55);
  border: 1px solid var(--border-subtle);
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}
</style>
