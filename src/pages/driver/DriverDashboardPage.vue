<script setup lang="ts">
import { formatXaf } from '@/shared/utils'
import { PageHeader, AppCard, StatusPill, EmptyState } from '@/components/common'
</script>

<template>
  <div>
    <PageHeader
      eyebrow="DRIVER CONSOLE // FLEET TELEMETRY"
      title="Courier Dispatch Hub"
      subtitle="Manage availability status, incoming proximity requests, and XAF escrow earnings."
    >
      <template #status>
        <StatusPill status="AVAILABLE" />
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

    <v-row class="mt-2">
      <v-col cols="12" md="4">
        <AppCard eyebrow="TRUST METRIC" title="Courier Trust Score">
          <div class="d-flex align-center justify-space-between">
            <span class="text-h4 font-mono font-weight-bold text-primary">98.5</span>
            <StatusPill status="APPROVED" size="small" />
          </div>
          <div class="text-caption text-medium-emphasis mt-1">
            Weighted by on-time custody handshakes
          </div>
        </AppCard>
      </v-col>
      <v-col cols="12" md="4">
        <AppCard eyebrow="WALLET LEDGER" title="Cleared XAF Balance">
          <div class="text-h4 font-mono font-weight-bold">
            {{ formatXaf(0) }}
          </div>
          <div class="text-caption text-medium-emphasis mt-1">
            Instant Mobile Money withdrawal ready
          </div>
        </AppCard>
      </v-col>
      <v-col cols="12" md="4">
        <AppCard eyebrow="DISPATCH QUEUE" title="Pending Offers">
          <div class="d-flex align-center justify-space-between">
            <span class="text-h4 font-mono font-weight-bold">0</span>
            <StatusPill status="AWAITING_DRIVER_RESPONSE" size="small" />
          </div>
          <div class="text-caption text-medium-emphasis mt-1">
            Matched via PostGIS proximity radius
          </div>
        </AppCard>
      </v-col>
    </v-row>

    <AppCard
      class="mt-4"
      eyebrow="ACTIVE ASSIGNMENT"
      title="Current Route &amp; Custody"
      subtitle="Incoming requests matched to your active vehicle capacity appear below."
    >
      <EmptyState
        icon="mdi-compass-outline"
        title="Standing by for dispatch offers"
        description="Ensure your vehicle is active and availability is set to AVAILABLE to receive nearby parcel requests."
        action-label="Open Requests Inbox"
        @action="$router.push('/driver/requests')"
      />
    </AppCard>
  </div>
</template>
