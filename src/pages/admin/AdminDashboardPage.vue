<script setup lang="ts">
import { formatXaf } from '@/shared/utils'
import { PageHeader, AppCard, StatusPill, EmptyState } from '@/components/common'
</script>

<template>
  <div>
    <PageHeader
      eyebrow="Network Governance"
      title="Platform Operations Overview"
      subtitle="Monitor fleet verification queues, active escrow volume, and dispute adjudications."
    >
      <template #status>
        <StatusPill status="APPROVED" />
      </template>
      <template #actions>
        <v-btn
          color="primary"
          variant="flat"
          prepend-icon="mdi-scale-balance"
          to="/admin/disputes"
        >
          Review Disputes
        </v-btn>
      </template>
    </PageHeader>

    <v-row class="mt-2">
      <v-col cols="12" md="4">
        <AppCard eyebrow="VERIFICATION QUEUE" title="Pending Driver Dossiers">
          <div class="d-flex align-center justify-space-between">
            <span class="text-h4 font-mono font-weight-bold text-primary">0</span>
            <StatusPill status="PENDING" size="small" />
          </div>
          <div class="text-caption text-medium-emphasis mt-1">
            Awaiting KYC &amp; license inspection
          </div>
        </AppCard>
      </v-col>
      <v-col cols="12" md="4">
        <AppCard eyebrow="ESCROW CUSTODY" title="Locked Platform Volume">
          <div class="text-h4 font-mono font-weight-bold">
            {{ formatXaf(0) }}
          </div>
          <div class="text-caption text-medium-emphasis mt-1">
            Across active waybills in transit
          </div>
        </AppCard>
      </v-col>
      <v-col cols="12" md="4">
        <AppCard eyebrow="ADJUDICATION" title="Open Escrow Disputes">
          <div class="d-flex align-center justify-space-between">
            <span class="text-h4 font-mono font-weight-bold">0</span>
            <StatusPill status="OPEN" size="small" />
          </div>
          <div class="text-caption text-medium-emphasis mt-1">
            Requires release or refund ruling
          </div>
        </AppCard>
      </v-col>
    </v-row>

    <AppCard
      class="mt-4"
      eyebrow="GOVERNANCE STREAM"
      title="Recent Administrative Actions"
      subtitle="Driver approvals, rejections, and escrow dispute settlements."
    >
      <EmptyState
        icon="mdi-shield-crown-outline"
        title="All operational queues clear"
        description="Driver verification dossiers and disputed waybills requiring adjudication will surface here."
        action-label="Inspect Driver Queue"
        @action="$router.push('/admin/drivers')"
      />
    </AppCard>
  </div>
</template>
