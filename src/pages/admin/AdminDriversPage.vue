<script setup lang="ts">
import { PageHeader, AppCard, EmptyState, StatusPill } from '@/components/common'
</script>

<template>
  <div>
    <PageHeader
      eyebrow="Fleet Onboarding"
      title="Driver Verification Queue"
      subtitle="Inspect uploaded national IDs and driver licenses to approve or reject courier applicants."
    >
      <template #status>
        <StatusPill status="PENDING" />
      </template>
    </PageHeader>

    <AppCard
      class="mt-4"
      eyebrow="APPLICANT DOSSIERS"
      title="Courier Verification Registry"
      subtitle="Filter by PENDING, APPROVED, or REJECTED verification status."
    >
      <EmptyState
        icon="mdi-badge-account-horizontal-outline"
        title="No pending driver applications"
        description="When couriers submit verification documents, their dossiers will appear here for inspection."
      />
    </AppCard>
  </div>
</template>
