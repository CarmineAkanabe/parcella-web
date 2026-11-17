<script setup lang="ts">
import { PageHeader, AppCard, EmptyState, StatusPill } from '@/components/common'
</script>

<template>
  <div>
    <PageHeader
      eyebrow="Fleet Registry"
      title="Vehicles &amp; Availability Status"
      subtitle="Register bikes, motorbikes, cars, or vans and toggle your active dispatch vehicle."
    >
      <template #status>
        <StatusPill status="AVAILABLE" />
      </template>
    </PageHeader>

    <AppCard
      class="mt-4"
      eyebrow="REGISTERED FLEET"
      title="Courier Vehicles"
      subtitle="Only one verified vehicle may be marked active for spatial matching at a time."
    >
      <EmptyState
        icon="mdi-car-cog"
        title="No vehicles registered"
        description="Add your bike, motorbike, car, or van with plate number and max package capacity."
      />
    </AppCard>
  </div>
</template>
