<script setup lang="ts">
import { PageHeader, AppCard, EmptyState, StatusPill } from '@/components/common'
</script>

<template>
  <div>
    <PageHeader
      eyebrow="Courier Manifest"
      title="My Assigned Deliveries"
      subtitle="Verify 6-digit pickup and delivery codes to advance waybills and release XAF escrow."
    >
      <template #status>
        <StatusPill status="IN_TRANSIT" />
      </template>
    </PageHeader>

    <AppCard
      class="mt-4"
      eyebrow="ACTIVE &amp; PAST RUNS"
      title="Courier Waybill Log"
      subtitle="Select any delivery to submit pickup or drop-off verification codes."
    >
      <EmptyState
        icon="mdi-truck-delivery-outline"
        title="No assigned deliveries yet"
        description="Accepted delivery requests from your inbox will appear here with turn-by-turn custody steps."
        action-label="Check Requests Inbox"
        @action="$router.push('/driver/requests')"
      />
    </AppCard>
  </div>
</template>
