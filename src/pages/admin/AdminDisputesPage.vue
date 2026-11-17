<script setup lang="ts">
import { PageHeader, AppCard, EmptyState, StatusPill } from '@/components/common'
</script>

<template>
  <div>
    <PageHeader
      eyebrow="ESCROW ADJUDICATION // ARBITRATION"
      title="Escrow Disputes Resolution"
      subtitle="Review disputed deliveries and issue binding rulings to release funds to the driver or refund the customer."
    >
      <template #status>
        <StatusPill status="OPEN" />
      </template>
    </PageHeader>

    <AppCard
      class="mt-4"
      eyebrow="ARBITRATION QUEUE"
      title="Disputed Waybills"
      subtitle="Each ruling atomically updates escrow payment state and records an audit note."
    >
      <EmptyState
        icon="mdi-scale-balance"
        title="No open escrow disputes"
        description="Disputed deliveries requiring administrative arbitration will be listed here."
      />
    </AppCard>
  </div>
</template>
