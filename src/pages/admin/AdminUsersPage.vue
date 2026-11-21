<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { DataTable, PageHeader, StatusPill, UserAvatar } from '@/components/common'
import { listAdminUsersApi, type Role } from '@/features/admin'
import type { UserResponse } from '@/shared/types'
import { formatDateTime } from '@/shared/utils'

type RoleFilter = 'ALL' | Role

const activeRoleFilter = ref<RoleFilter>('ALL')
const tablePage = ref(1)
const itemsPerPage = ref(20)

const users = ref<UserResponse[]>([])
const totalUsers = ref(0)
const isLoading = ref(false)
const loadError = ref<unknown>(null)

const headers = [
  { title: 'User Identity', key: 'identity', sortable: false },
  { title: 'System Role', key: 'role', sortable: false },
  { title: 'Mobile Contact', key: 'phone', sortable: false },
  { title: 'Registered Hub', key: 'location', sortable: false },
  { title: 'Driver Verification', key: 'driverStatus', sortable: false },
  { title: 'Joined', key: 'createdAt', sortable: false },
]

async function fetchUsers(): Promise<void> {
  isLoading.value = true
  loadError.value = null
  try {
    const response = await listAdminUsersApi({
      role: activeRoleFilter.value === 'ALL' ? undefined : activeRoleFilter.value,
      page: tablePage.value - 1,
      size: itemsPerPage.value,
    })
    users.value = response.items
    totalUsers.value = response.totalItems
  } catch (err: unknown) {
    loadError.value = err
  } finally {
    isLoading.value = false
  }
}

watch([activeRoleFilter, tablePage, itemsPerPage], () => {
  fetchUsers()
})

onMounted(() => {
  fetchUsers()
})

function handleRoleChange(role: RoleFilter): void {
  activeRoleFilter.value = role
  tablePage.value = 1
}
</script>

<template>
  <div>
    <PageHeader
      eyebrow="Platform Directory"
      title="Platform Users Directory"
      subtitle="Browse, filter, and audit all registered customers, couriers, and platform administrators."
    >
      <template #status>
        <StatusPill status="APPROVED" />
      </template>
      <template #actions>
        <v-btn
          variant="tonal"
          color="secondary"
          size="small"
          prepend-icon="mdi-refresh"
          :loading="isLoading"
          @click="fetchUsers"
        >
          Refresh Directory
        </v-btn>
      </template>
    </PageHeader>

    <div class="mt-4">
      <DataTable
        :headers="headers"
        :items="users"
        :total-items="totalUsers"
        :page="tablePage"
        :items-per-page="itemsPerPage"
        :loading="isLoading"
        :error="loadError"
        empty-title="No users found"
        empty-description="No user records match the selected account role filter."
        @update:page="tablePage = $event"
        @update:items-per-page="itemsPerPage = $event"
        @retry="fetchUsers"
      >
        <template #filters>
          <div class="d-flex align-center flex-wrap ga-2">
            <span class="text-caption font-weight-bold text-uppercase text-medium-emphasis mr-2">
              Role Filter:
            </span>
            <v-chip
              size="small"
              :variant="activeRoleFilter === 'ALL' ? 'flat' : 'outlined'"
              color="secondary"
              class="font-weight-semibold"
              @click="handleRoleChange('ALL')"
            >
              All Users
            </v-chip>
            <v-chip
              size="small"
              :variant="activeRoleFilter === 'CUSTOMER' ? 'flat' : 'outlined'"
              color="primary"
              class="font-weight-semibold"
              @click="handleRoleChange('CUSTOMER')"
            >
              Customers
            </v-chip>
            <v-chip
              size="small"
              :variant="activeRoleFilter === 'DRIVER' ? 'flat' : 'outlined'"
              color="primary"
              class="font-weight-semibold"
              @click="handleRoleChange('DRIVER')"
            >
              Couriers
            </v-chip>
            <v-chip
              size="small"
              :variant="activeRoleFilter === 'ADMIN' ? 'flat' : 'outlined'"
              color="primary"
              class="font-weight-semibold"
              @click="handleRoleChange('ADMIN')"
            >
              Admins
            </v-chip>
          </div>
        </template>

        <!-- User Identity Column -->
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

        <!-- Role Column -->
        <template #item.role="{ item }">
          <StatusPill :status="(item as UserResponse).role" size="small" />
        </template>

        <!-- Phone Column -->
        <template #item.phone="{ item }">
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

        <!-- Driver Verification Column -->
        <template #item.driverStatus="{ item }">
          <StatusPill
            v-if="(item as UserResponse).driver"
            :status="(item as UserResponse).driver!.verificationStatus"
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
      </DataTable>
    </div>
  </div>
</template>

<style scoped>
.max-w-loc {
  max-width: 200px;
}
</style>
