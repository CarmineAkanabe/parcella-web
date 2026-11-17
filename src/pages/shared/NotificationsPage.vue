<script setup lang="ts">
import { PageHeader, AppCard, EmptyState, StatusPill } from '@/components/common'
</script>

<template>
  <div>
    <PageHeader
      eyebrow="TELEMETRY STREAM // ALERTS"
      title="System Notifications"
      subtitle="Escrow ledger transitions, courier proximity alerts, and dispute updates."
    >
      <template #status>
        <StatusPill status="AVAILABLE" />
      </template>
    </PageHeader>

    <AppCard
      class="mt-4"
      eyebrow="INBOX FEED"
      title="Operational Dispatches"
      subtitle="All custody handshakes and payment events appear in chronological order."
    >
      <EmptyState
        icon="mdi-bell-check-outline"
        title="No unread operational alerts"
        description="When a delivery changes state or an escrow payment settles, real-time notifications will appear here."
      />
    </AppCard>
  </div>
</template>
