<script setup lang="ts">
import { computed } from 'vue'

export type SemanticColor = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'

export interface StatusMeta {
  label: string
  icon: string
  color: SemanticColor
}

interface Props {
  status: string
  size?: 'x-small' | 'small' | 'default'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'small',
})

const STATUS_MAP: Record<string, StatusMeta> = {
  // Delivery statuses
  REQUESTED: {
    label: 'Requested',
    icon: 'mdi-package-variant-closed',
    color: 'info',
  },
  AWAITING_DRIVER_RESPONSE: {
    label: 'Awaiting Driver',
    icon: 'mdi-timer-sand',
    color: 'warning',
  },
  ACCEPTED: {
    label: 'Accepted',
    icon: 'mdi-handshake-outline',
    color: 'primary',
  },
  IN_TRANSIT: {
    label: 'In Transit',
    icon: 'mdi-truck-fast-outline',
    color: 'primary',
  },
  DELIVERED: {
    label: 'Delivered',
    icon: 'mdi-package-check',
    color: 'success',
  },
  COMPLETED: {
    label: 'Completed',
    icon: 'mdi-check-decagram',
    color: 'success',
  },
  REJECTED: {
    label: 'Rejected',
    icon: 'mdi-close-octagon-outline',
    color: 'error',
  },
  EXPIRED: {
    label: 'Expired',
    icon: 'mdi-clock-alert-outline',
    color: 'secondary',
  },
  CANCELLED: {
    label: 'Cancelled',
    icon: 'mdi-cancel',
    color: 'secondary',
  },
  DISPUTED: {
    label: 'Disputed',
    icon: 'mdi-scale-balance',
    color: 'error',
  },

  // Payment & Wallet statuses
  PENDING: {
    label: 'Pending',
    icon: 'mdi-clock-outline',
    color: 'warning',
  },
  HELD: {
    label: 'Escrow Held',
    icon: 'mdi-shield-lock-outline',
    color: 'info',
  },
  RELEASED: {
    label: 'Released',
    icon: 'mdi-cash-check',
    color: 'success',
  },
  REFUNDED: {
    label: 'Refunded',
    icon: 'mdi-cash-refund',
    color: 'secondary',
  },
  FAILED: {
    label: 'Failed',
    icon: 'mdi-alert-circle-outline',
    color: 'error',
  },

  // Verification statuses
  APPROVED: {
    label: 'Approved',
    icon: 'mdi-shield-check-outline',
    color: 'success',
  },

  // Driver availability statuses
  AVAILABLE: {
    label: 'Available',
    icon: 'mdi-radar',
    color: 'success',
  },
  BUSY: {
    label: 'Busy',
    icon: 'mdi-truck-delivery-outline',
    color: 'warning',
  },
  OFFLINE: {
    label: 'Offline',
    icon: 'mdi-power-standby',
    color: 'secondary',
  },

  // Dispute statuses
  OPEN: {
    label: 'Open',
    icon: 'mdi-alert-decagram-outline',
    color: 'warning',
  },
  RESOLVED: {
    label: 'Resolved',
    icon: 'mdi-check-circle-outline',
    color: 'success',
  },

  // Wallet entry types
  EARNING: {
    label: 'Earning',
    icon: 'mdi-arrow-bottom-left-thick',
    color: 'success',
  },
  WITHDRAWAL: {
    label: 'Withdrawal',
    icon: 'mdi-arrow-top-right-thick',
    color: 'info',
  },

  // Role badges (helpful when StatusPill is used for user roles)
  CUSTOMER: {
    label: 'Customer',
    icon: 'mdi-account-outline',
    color: 'info',
  },
  DRIVER: {
    label: 'Driver',
    icon: 'mdi-steering',
    color: 'primary',
  },
  ADMIN: {
    label: 'Admin',
    icon: 'mdi-shield-crown-outline',
    color: 'secondary',
  },
}

const meta = computed<StatusMeta>(() => {
  const normalized = (props.status || '').trim().toUpperCase()
  const matched = STATUS_MAP[normalized]
  if (matched) return matched

  return {
    label: props.status ? props.status.replace(/_/g, ' ') : 'Unknown',
    icon: 'mdi-information-outline',
    color: 'secondary',
  }
})
</script>

<template>
  <v-chip
    variant="tonal"
    :color="meta.color"
    :size="size"
    class="status-pill font-weight-semibold"
  >
    <v-icon start :icon="meta.icon" size="14" />
    <span>{{ meta.label }}</span>
  </v-chip>
</template>

<style scoped lang="scss">
.status-pill {
  letter-spacing: 0.02em;
}
</style>
