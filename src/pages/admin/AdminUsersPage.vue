<script setup lang="ts">
import { PageHeader, AppCard, EmptyState, StatusPill } from '@/components/common'
</script>

<template>
  <div>
    <PageHeader
      eyebrow="DIRECTORY // OPERATOR ACCOUNTS"
      title="Platform Users Directory"
      subtitle="Search and audit registered customers, couriers, and administrators."
    >
      <template #status>
        <StatusPill status="APPROVED" />
      </template>
    </PageHeader>

    <AppCard
      class="mt-4"
      eyebrow="OPERATOR REGISTRY"
      title="Registered Accounts"
      subtitle="Paginated directory with role filtering and contact verification metadata."
    >
      <EmptyState
        icon="mdi-account-group-outline"
        title="No user records loaded"
        description="Connect to the Parcella backend API to browse paginated user accounts."
      />
    </AppCard>
  </div>
</template>
