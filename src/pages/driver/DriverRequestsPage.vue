<script setup lang="ts">
import { PageHeader, AppCard, EmptyState, StatusPill } from '@/components/common'
</script>

<template>
  <div>
    <PageHeader
      eyebrow="Proximity Matching"
      title="Delivery Requests Inbox"
      subtitle="Accept or decline time-bounded delivery assignments matched to your coordinates."
    >
      <template #status>
        <StatusPill status="AWAITING_DRIVER_RESPONSE" />
      </template>
    </PageHeader>

    <AppCard
      class="mt-4"
      eyebrow="INCOMING OFFERS"
      title="Proximity Dispatch Queue"
      subtitle="Offers expire automatically if not accepted within the dispatch window."
    >
      <EmptyState
        icon="mdi-inbox-arrow-down-outline"
        title="No pending delivery offers"
        description="Stay online and keep your GPS location updated to receive real-time parcel assignments."
      />
    </AppCard>
  </div>
</template>
