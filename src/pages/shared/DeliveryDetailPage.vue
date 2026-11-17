<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { formatXaf } from '@/shared/utils'
import { PageHeader, AppCard, StatusPill, EmptyState } from '@/components/common'

const route = useRoute()
const deliveryId = computed(() => String(route.params.id ?? '1001'))
</script>

<template>
  <div>
    <PageHeader
      eyebrow="DISPATCH RECORD // CUSTODY LEDGER"
      :title="`Delivery Waybill PCL-${deliveryId}`"
      subtitle="Real-time escrow state, 2-step custody verification codes, and spatial telemetry."
      back-to="/customer/deliveries"
    >
      <template #status>
        <StatusPill status="IN_TRANSIT" />
      </template>
      <template #actions>
        <StatusPill status="HELD" />
      </template>
    </PageHeader>

    <v-row class="mt-2">
      <v-col cols="12" md="7">
        <AppCard
          eyebrow="WAYBILL SUMMARY"
          title="Custody &amp; Route Specification"
          subtitle="Escrow funds remain locked until destination code handshake completes."
        >
          <div class="d-flex flex-column ga-3 font-mono text-body-2">
            <div class="d-flex justify-space-between">
              <span class="text-medium-emphasis">ESCROW FEE</span>
              <span class="font-weight-bold text-primary">{{ formatXaf(3500) }}</span>
            </div>
            <div class="d-flex justify-space-between">
              <span class="text-medium-emphasis">PACKAGE SIZE</span>
              <span>MEDIUM</span>
            </div>
            <div class="d-flex justify-space-between">
              <span class="text-medium-emphasis">PAYMENT STATE</span>
              <StatusPill status="HELD" size="x-small" />
            </div>
          </div>
        </AppCard>
      </v-col>

      <v-col cols="12" md="5">
        <AppCard
          eyebrow="VERIFICATION GATE"
          title="2-Step Handshake"
          subtitle="Slice F3 activates live pickup and delivery code submission."
        >
          <EmptyState
            compact
            icon="mdi-shield-key-outline"
            title="Verification Console Ready"
            description="6-digit cryptographic pickup and drop-off verification binds here."
          />
        </AppCard>
      </v-col>
    </v-row>
  </div>
</template>
