<script setup lang="ts">
import { PageHeader, AppCard, EmptyState, StatusPill } from '@/components/common'
</script>

<template>
  <div>
    <PageHeader
      eyebrow="Customer Deliveries"
      title="My Deliveries"
      subtitle="Complete history of outbound and inbound parcels with escrow payment statuses."
    >
      <template #status>
        <StatusPill status="HELD" />
      </template>
      <template #actions>
        <v-btn
          color="primary"
          variant="flat"
          prepend-icon="mdi-plus"
          to="/customer/deliveries/new"
        >
          New Delivery
        </v-btn>
      </template>
    </PageHeader>

    <AppCard
      class="mt-4"
      eyebrow="WAYBILL REGISTRY"
      title="Delivery History"
      subtitle="Filter by delivery status, package size, or escrow payment state."
    >
      <EmptyState
        icon="mdi-truck-fast-outline"
        title="No delivery waybills recorded"
        description="Once you dispatch or receive a parcel, its waybill, pickup code, and escrow receipt will be listed here."
        action-label="Dispatch a Parcel"
        @action="$router.push('/customer/deliveries/new')"
      />
    </AppCard>
  </div>
</template>
