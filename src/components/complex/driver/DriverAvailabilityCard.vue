<script setup lang="ts">
import { computed, ref } from 'vue'
import { AppCard, StatusPill } from '@/components/common'
import { updateAvailabilityApi } from '@/features/driver'
import { useToast } from '@/shared/composables/useToast'
import { useAuthStore } from '@/shared/stores/auth'
import type { AvailabilityStatus } from '@/shared/types'

const authStore = useAuthStore()
const toast = useToast()

const isUpdating = ref(false)

const driver = computed(() => authStore.user?.driver)
const availabilityStatus = computed(() => driver.value?.availabilityStatus ?? 'OFFLINE')
const verificationStatus = computed(() => driver.value?.verificationStatus ?? 'PENDING')

const isApproved = computed(() => verificationStatus.value === 'APPROVED')
const isBusy = computed(() => availabilityStatus.value === 'BUSY')
const isAvailable = computed(() => availabilityStatus.value === 'AVAILABLE')

const canToggle = computed(() => isApproved.value && !isBusy.value && !isUpdating.value)

const lockReason = computed(() => {
  if (isBusy.value) {
    return 'Availability cannot be changed while handling an active delivery custody assignment.'
  }
  if (!isApproved.value) {
    return 'Availability is locked offline until your driver license is verified and approved by an administrator.'
  }
  return null
})

async function handleToggle(): Promise<void> {
  if (!canToggle.value) return

  const targetStatus: AvailabilityStatus = isAvailable.value ? 'OFFLINE' : 'AVAILABLE'
  isUpdating.value = true
  try {
    const updated = await updateAvailabilityApi(targetStatus)
    authStore.user = updated
    toast.success(
      targetStatus === 'AVAILABLE'
        ? 'You are now ONLINE and ready for proximity dispatch requests.'
        : 'You are now OFFLINE. New delivery requests will not be assigned.',
    )
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Could not update availability status'
    toast.error(message)
  } finally {
    isUpdating.value = false
  }
}
</script>

<template>
  <AppCard class="availability-card fill-height">
    <div class="d-flex align-center justify-space-between mb-3">
      <div class="d-flex align-center ga-2">
        <v-icon
          :icon="isAvailable ? 'mdi-radar' : 'mdi-power-standby'"
          :color="isAvailable ? 'success' : 'secondary'"
          size="22"
        />
        <h3 class="text-subtitle-1 font-weight-bold">Dispatch Availability</h3>
      </div>
      <StatusPill :status="availabilityStatus" size="small" />
    </div>

    <div class="status-box pa-4 rounded-lg mb-4 d-flex align-center justify-space-between ga-3">
      <div>
        <div class="text-body-2 font-weight-bold">
          {{ isAvailable ? 'Active for Spatial Matching' : isBusy ? 'In Delivery Transit' : 'Offline / Inactive' }}
        </div>
        <div class="text-caption text-medium-emphasis">
          {{
            isAvailable
              ? 'Receiving real-time parcel dispatch offers within your radius'
              : isBusy
                ? 'Current package custody must be completed before changing status'
                : 'Switch on to broadcast your location and vehicle capacity to customers'
          }}
        </div>
      </div>

      <v-switch
        :model-value="isAvailable"
        :disabled="!canToggle"
        :loading="isUpdating"
        color="success"
        hide-details
        class="flex-shrink-0"
        aria-label="Toggle driver availability"
        @update:model-value="handleToggle"
      />
    </div>

    <!-- Reason banner when locked -->
    <v-sheet
      v-if="lockReason"
      rounded="lg"
      class="lock-banner pa-3 d-flex align-start ga-2"
    >
      <v-icon
        :icon="isBusy ? 'mdi-clock-outline' : 'mdi-lock-outline'"
        size="18"
        class="text-medium-emphasis flex-shrink-0 mt-0-5"
      />
      <span class="text-caption text-medium-emphasis">
        {{ lockReason }}
      </span>
    </v-sheet>
  </AppCard>
</template>

<style scoped>
.availability-card {
  background-color: rgb(var(--v-theme-surface));
}

.status-box {
  background-color: rgba(var(--v-theme-surface-variant), 0.4);
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.lock-banner {
  background-color: rgba(var(--v-theme-surface-variant), 0.25);
  border: 1px dashed rgba(var(--v-border-color), var(--v-border-opacity));
}

.mt-0-5 {
  margin-top: 2px;
}
</style>
