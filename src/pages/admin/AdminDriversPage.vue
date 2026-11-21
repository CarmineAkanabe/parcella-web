<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { DataTable, PageHeader, StatusPill, UserAvatar } from '@/components/common'
import { listAdminDriversApi, type VerificationStatus } from '@/features/admin'
import type { UserResponse } from '@/shared/types'
import { formatDateTime } from '@/shared/utils'

type FilterOption = 'PENDING' | 'APPROVED' | 'REJECTED' | 'ALL'

const activeFilter = ref<FilterOption>('PENDING')
const tablePage = ref(1)
const itemsPerPage = ref(20)

const drivers = ref<UserResponse[]>([])
const totalDrivers = ref(0)
const isLoading = ref(false)
const loadError = ref<unknown>(null)

const headers = [
  { title: 'Courier Identity', key: 'identity', sortable: false },
  { title: 'Mobile Contact', key: 'paymentPhoneNumber', sortable: false },
  { title: 'Registered Hub', key: 'location', sortable: false },
  { title: 'Verification', key: 'verification', sortable: false },
  { title: 'Availability', key: 'availability', sortable: false },
  { title: 'Joined', key: 'createdAt', sortable: false },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' as const },
]

async function fetchDrivers(): Promise<void> {
  isLoading.value = true
  loadError.value = null
  try {
    const response = await listAdminDriversApi({
      verificationStatus: activeFilter.value === 'ALL' ? undefined : (activeFilter.value as VerificationStatus),
      page: tablePage.value - 1,
      size: itemsPerPage.value,
    })
    drivers.value = response.items
    totalDrivers.value = response.totalItems
  } catch (err: unknown) {
    loadError.value = err
  } finally {
    isLoading.value = false
  }
}

watch([activeFilter, tablePage, itemsPerPage], () => {
  fetchDrivers()
})

onMounted(() => {
  fetchDrivers()
})

function handleFilterChange(filter: FilterOption): void {
  activeFilter.value = filter
  tablePage.value = 1
}
</script>

<template>
  <div>
    <PageHeader
      eyebrow="Fleet Compliance"
      title="Courier Verification Registry"
      subtitle="Inspect uploaded national credentials and driver licenses to approve or reject courier applicants."
    >
      <template #status>
        <StatusPill status="PENDING" />
      </template>
      <template #actions>
        <v-btn
          variant="tonal"
          color="secondary"
          size="small"
          prepend-icon="mdi-refresh"
          :loading="isLoading"
          @click="fetchDrivers"
        >
          Refresh Queue
        </v-btn>
      </template>
    </PageHeader>

    <div class="mt-4">
      <DataTable
        :headers="headers"
        :items="drivers"
        :total-items="totalDrivers"
        :page="tablePage"
        :items-per-page="itemsPerPage"
        :loading="isLoading"
        :error="loadError"
        empty-title="No driver dossiers found"
        empty-description="No couriers match the selected compliance filter."
        @update:page="tablePage = $event"
        @update:items-per-page="itemsPerPage = $event"
        @retry="fetchDrivers"
      >
        <template #filters>
          <div class="d-flex align-center flex-wrap ga-2">
            <span class="text-caption font-weight-bold text-uppercase text-medium-emphasis mr-2">
              Status Filter:
            </span>
            <v-chip
              size="small"
              :variant="activeFilter === 'PENDING' ? 'flat' : 'outlined'"
              :color="activeFilter === 'PENDING' ? 'warning' : 'secondary'"
              class="font-weight-semibold"
              @click="handleFilterChange('PENDING')"
            >
              Pending Review
            </v-chip>
            <v-chip
              size="small"
              :variant="activeFilter === 'APPROVED' ? 'flat' : 'outlined'"
              :color="activeFilter === 'APPROVED' ? 'success' : 'secondary'"
              class="font-weight-semibold"
              @click="handleFilterChange('APPROVED')"
            >
              Approved
            </v-chip>
            <v-chip
              size="small"
              :variant="activeFilter === 'REJECTED' ? 'flat' : 'outlined'"
              :color="activeFilter === 'REJECTED' ? 'flat' : 'outlined'"
              :base-color="activeFilter === 'REJECTED' ? 'error' : undefined"
              class="font-weight-semibold"
              @click="handleFilterChange('REJECTED')"
            >
              Rejected
            </v-chip>
            <v-chip
              size="small"
              :variant="activeFilter === 'ALL' ? 'flat' : 'outlined'"
              color="secondary"
              @click="handleFilterChange('ALL')"
            >
              All Couriers
            </v-chip>
          </div>
        </template>

        <!-- Courier Identity Column -->
        <template #item.identity="{ item }">
          <div class="d-flex align-center ga-3 py-2">
            <UserAvatar
              :avatar-url="(item as UserResponse).avatarUrl"
              :full-name="(item as UserResponse).fullName"
              size="36"
              rounded="lg"
            />
            <div class="min-w-0">
              <div class="text-body-2 font-weight-bold text-truncate">
                {{ (item as UserResponse).fullName }}
              </div>
              <div class="text-caption text-medium-emphasis text-truncate font-mono">
                {{ (item as UserResponse).email }}
              </div>
            </div>
          </div>
        </template>

        <!-- Phone Column -->
        <template #item.paymentPhoneNumber="{ item }">
          <span class="font-mono text-body-2">
            {{ (item as UserResponse).paymentPhoneNumber || '—' }}
          </span>
        </template>

        <!-- Location Column -->
        <template #item.location="{ item }">
          <span class="text-caption text-medium-emphasis text-truncate d-inline-block max-w-loc">
            {{ (item as UserResponse).registeredLocation?.address || '—' }}
          </span>
        </template>

        <!-- Verification Status Column -->
        <template #item.verification="{ item }">
          <StatusPill
            v-if="(item as UserResponse).driver"
            :status="(item as UserResponse).driver!.verificationStatus"
            size="small"
          />
          <span v-else class="text-medium-emphasis">—</span>
        </template>

        <!-- Availability Column -->
        <template #item.availability="{ item }">
          <StatusPill
            v-if="(item as UserResponse).driver"
            :status="(item as UserResponse).driver!.availabilityStatus"
            size="small"
          />
          <span v-else class="text-medium-emphasis">—</span>
        </template>

        <!-- Registered Date -->
        <template #item.createdAt="{ item }">
          <span class="text-caption text-medium-emphasis">
            {{ formatDateTime((item as UserResponse).createdAt) }}
          </span>
        </template>

        <!-- Actions -->
        <template #item.actions="{ item }">
          <v-btn
            size="small"
            variant="tonal"
            color="primary"
            append-icon="mdi-arrow-right"
            :to="`/admin/drivers/${(item as UserResponse).id}`"
          >
            Review Dossier
          </v-btn>
        </template>
      </DataTable>
    </div>
  </div>
</template>

<style scoped>
.max-w-loc {
  max-width: 180px;
}
</style>
