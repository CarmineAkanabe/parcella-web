<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { PageHeader, AppCard, StatusPill, EmptyState } from '@/components/common'

const route = useRoute()
const driverId = computed(() => String(route.params.id ?? '1'))
</script>

<template>
  <div>
    <PageHeader
      eyebrow="COMPLIANCE DOSSIER // KYC INSPECTION"
      :title="`Driver Applicant DRV-${driverId}`"
      subtitle="Verify national identity card, courier license, and registered fleet vehicles."
      back-to="/admin/drivers"
    >
      <template #status>
        <StatusPill status="PENDING" />
      </template>
    </PageHeader>

    <AppCard
      class="mt-4"
      eyebrow="IDENTITY DOCUMENTS"
      title="Submitted Credentials &amp; Ruling"
      subtitle="Slice F5 connects live document preview and approve/reject mutations."
    >
      <EmptyState
        icon="mdi-file-certificate-outline"
        title="Dossier inspection ready"
        description="Uploaded identity documents and verification controls bind to this view."
      />
    </AppCard>
  </div>
</template>
