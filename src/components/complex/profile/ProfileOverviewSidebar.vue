<script setup lang="ts">
import { computed } from 'vue'
import { AppCard, StatusPill } from '@/components/common'
import { useToast } from '@/shared/composables/useToast'
import type { UserResponse } from '@/shared/types'
import { formatDateTime } from '@/shared/utils'

interface Props {
  user: UserResponse
}

const props = defineProps<Props>()
const toast = useToast()

const driverSummary = computed(() => props.user.driver)

const userInitials = computed(() => {
  const name = props.user.fullName.trim()
  if (!name) return 'PC'
  const parts = name.split(/\s+/)
  return `${parts[0]?.[0] ?? 'P'}${parts[1]?.[0] ?? ''}`.toUpperCase()
})

const formattedAccountId = computed(() => {
  const id = props.user.id
  const rolePrefix = props.user.role === 'DRIVER' ? 'DRV' : props.user.role === 'ADMIN' ? 'ADM' : 'CST'
  return `CMR-${rolePrefix}-${id.slice(0, 8).toUpperCase()}`
})

async function copyAccountId(): Promise<void> {
  try {
    await navigator.clipboard.writeText(props.user.id)
    toast.info('Account ID copied to clipboard.')
  } catch {
    toast.info(props.user.id)
  }
}
</script>

<template>
  <div class="d-flex flex-column ga-5">
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
