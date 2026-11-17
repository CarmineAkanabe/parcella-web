<script setup lang="ts">
import { formatXaf } from '@/shared/utils'
import { PageHeader, AppCard, StatusPill, EmptyState } from '@/components/common'
</script>

<template>
  <div>
    <PageHeader
      eyebrow="CUSTOMER WORKSPACE // ESCROW DISPATCH"
      title="Shipper Operations Overview"
      subtitle="Track active parcels, verify pickup/delivery codes, and monitor XAF escrow holds."
    >
      <template #status>
        <StatusPill status="APPROVED" />
      </template>
      <template #actions>
        <v-btn
          color="primary"
          variant="flat"
          prepend-icon="mdi-plus-box-outline"
          to="/customer/deliveries/new"
        >
          New Delivery
        </v-btn>
      </template>
    </PageHeader>

    <v-row class="mt-2">
      <v-col cols="12" md="4">
        <AppCard eyebrow="ACTIVE ESCROW" title="Held in Custody">
          <div class="text-h4 font-mono font-weight-bold text-primary">
            {{ formatXaf(0) }}
          </div>
          <div class="text-caption text-medium-emphasis mt-1">
            Released only upon 6-digit destination code confirmation
          </div>
        </AppCard>
      </v-col>
      <v-col cols="12" md="4">
        <AppCard eyebrow="IN TRANSIT" title="Active Dispatches">
          <div class="d-flex align-center justify-space-between">
            <span class="text-h4 font-mono font-weight-bold">0</span>
            <StatusPill status="IN_TRANSIT" size="small" />
          </div>
          <div class="text-caption text-medium-emphasis mt-1">
            Live courier telemetry &amp; proximity matching
          </div>
        </AppCard>
      </v-col>
      <v-col cols="12" md="4">
        <AppCard eyebrow="COMPLETED" title="Verified Handshakes">
          <div class="d-flex align-center justify-space-between">
            <span class="text-h4 font-mono font-weight-bold">0</span>
            <StatusPill status="COMPLETED" size="small" />
          </div>
          <div class="text-caption text-medium-emphasis mt-1">
            Settled to verified fleet couriers
          </div>
        </AppCard>
      </v-col>
    </v-row>

    <AppCard
      class="mt-4"
      eyebrow="RECENT DISPATCHES"
      title="Active &amp; Recent Deliveries"
      subtitle="Create a new delivery request to match with nearby verified couriers."
    >
      <EmptyState
        icon="mdi-package-variant-closed"
        title="No active deliveries yet"
        description="Book your first escrow-protected delivery across Douala or Yaoundé."
        action-label="Create Delivery Request"
        @action="$router.push('/customer/deliveries/new')"
      />
    </AppCard>
  </div>
</template>
