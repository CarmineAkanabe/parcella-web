<script setup lang="ts">
import { computed } from 'vue'
import { AppCard, EmptyState, PageHeader, StatusPill } from '@/components/common'
import DriverAvailabilityCard from '@/components/complex/driver/DriverAvailabilityCard.vue'
import { useAuthStore } from '@/shared/stores/auth'
import { formatXaf } from '@/shared/utils'

const authStore = useAuthStore()

const driver = computed(() => authStore.user?.driver)
const verificationStatus = computed(() => driver.value?.verificationStatus ?? 'PENDING')
const verificationNote = computed(() => driver.value?.verificationNote)
</script>

<template>
  <div>
    <PageHeader
      eyebrow="Courier Operations"
      title="Courier Dispatch Hub"
      subtitle="Monitor spatial dispatch offers, live custody status, and cleared escrow earnings."
    >
      <template #status>
        <StatusPill v-if="driver" :status="driver.availabilityStatus" />
      </template>
      <template #actions>
        <v-btn
          color="primary"
          variant="flat"
          prepend-icon="mdi-inbox-arrow-down-outline"
          to="/driver/requests"
        >
          Requests Inbox
        </v-btn>
      </template>
    </PageHeader>

    <!-- Verification Attention Banner if not approved -->
    <v-alert
      v-if="verificationStatus !== 'APPROVED'"
      :type="verificationStatus === 'REJECTED' ? 'error' : 'warning'"
      variant="tonal"
      class="mt-3 mb-2"
    >
      <div class="d-flex align-center justify-space-between flex-wrap ga-2">
        <div>
          <div class="font-weight-bold">
            {{ verificationStatus === 'REJECTED' ? 'Application Revision Required' : 'Driver Verification Pending' }}
          </div>
          <div class="text-caption mt-1">
            {{
              verificationNote ||
              'Your documents are under review. Ensure a valid driver license is uploaded to enable dispatch matching.'
            }}
          </div>
        </div>
        <v-btn
          size="small"
          :color="verificationStatus === 'REJECTED' ? 'error' : 'warning'"
          variant="flat"
          to="/driver/vehicles"
        >
          Manage Fleet &amp; License
        </v-btn>
      </div>
    </v-alert>

    <!-- Top Metrics Row + Availability -->
    <v-row class="mt-2" dense>
      <v-col cols="12" md="4">
        <DriverAvailabilityCard />
      </v-col>

      <v-col cols="12" sm="6" md="4">
        <AppCard class="fill-height" eyebrow="TRUST LEDGER" title="Courier Rating &amp; Trust">
          <div class="d-flex align-center justify-space-between">
            <span class="text-h4 font-mono font-weight-bold text-primary">
              {{ driver ? driver.averageRating.toFixed(1) : '5.0' }}
            </span>
            <span class="font-mono text-subtitle-2 font-weight-bold text-medium-emphasis">
              / 5.0 ({{ driver ? driver.trustScore.toFixed(0) : '100' }} pts)
            </span>
          </div>
          <div class="text-caption text-medium-emphasis mt-2">
            Protected by cryptographic delivery handshake completion
          </div>
        </AppCard>
      </v-col>

      <v-col cols="12" sm="6" md="4">
        <AppCard class="fill-height" eyebrow="ESCROW WALLET" title="Cleared XAF Balance">
          <div class="text-h4 font-mono font-weight-bold">
            {{ formatXaf(0) }}
          </div>
          <div class="text-caption text-medium-emphasis mt-2">
            Direct Mobile Money payouts (MTN / Orange Money)
          </div>
        </AppCard>
      </v-col>
    </v-row>

    <!-- Proximity Dispatch Queue Card -->
    <AppCard
      class="mt-4"
      eyebrow="ACTIVE ASSIGNMENT"
      title="Current Route &amp; Custody"
      subtitle="Nearby delivery requests matched to your active vehicle capacity appear here."
    >
      <EmptyState
        icon="mdi-compass-outline"
        title="Standing by for dispatch offers"
        description="Make sure your active vehicle is set and your status is AVAILABLE to receive proximity matches."
        action-label="Open Requests Inbox"
        @action="$router.push('/driver/requests')"
      />
    </AppCard>
  </div>
</template>
