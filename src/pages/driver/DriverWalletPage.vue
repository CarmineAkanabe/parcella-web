<script setup lang="ts">
import { formatXaf } from '@/shared/utils'
import { PageHeader, AppCard, EmptyState, StatusPill } from '@/components/common'
</script>

<template>
  <div>
    <PageHeader
      eyebrow="Escrow Settlement"
      title="Driver Escrow Wallet"
      subtitle="Audit released delivery earnings and initiate Mobile Money XAF withdrawals."
    >
      <template #status>
        <StatusPill status="RELEASED" />
      </template>
    </PageHeader>

    <v-row class="mt-2">
      <v-col cols="12" md="6">
        <AppCard eyebrow="AVAILABLE BALANCE" title="Settled Earnings">
          <div class="text-h4 font-mono font-weight-bold text-primary">
            {{ formatXaf(0) }}
          </div>
          <div class="text-caption text-medium-emphasis mt-1">
            Credited immediately when recipient delivery code is verified
          </div>
        </AppCard>
      </v-col>
      <v-col cols="12" md="6">
        <AppCard eyebrow="PAYOUT CHANNEL" title="Mobile Money MSISDN">
          <div class="d-flex align-center justify-space-between">
            <span class="text-h6 font-mono">237670000000</span>
            <StatusPill status="EARNING" size="small" />
          </div>
          <div class="text-caption text-medium-emphasis mt-1">
            Configured in Operator Profile
          </div>
        </AppCard>
      </v-col>
    </v-row>

    <AppCard
      class="mt-4"
      eyebrow="LEDGER ENTRIES"
      title="Earnings &amp; Withdrawals"
      subtitle="Immutable audit trail of completed delivery payouts and Mobile Money transfers."
    >
      <EmptyState
        icon="mdi-wallet-outline"
        title="No wallet transactions recorded"
        description="Completed deliveries automatically credit your XAF wallet ledger here."
      />
    </AppCard>
  </div>
</template>
