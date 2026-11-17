<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/shared/stores/auth'
import { PageHeader, AppCard, StatusPill } from '@/components/common'

const authStore = useAuthStore()

const fullName = computed(() => authStore.user?.fullName ?? 'Parcella Operator')
const email = computed(() => authStore.user?.email ?? 'operator@parcella.cm')
const role = computed(() => authStore.role ?? 'CUSTOMER')
const paymentPhone = computed(() => authStore.user?.paymentPhoneNumber ?? '237670000000')
const contactPhone = computed(() => authStore.user?.preferredContactNumber ?? '237670000000')
</script>

<template>
  <div>
    <PageHeader
      eyebrow="OPERATOR IDENTITY // SECURITY"
      title="Profile &amp; Contact Registry"
      subtitle="Manage your registered Cameroon Mobile Money number, contact line, and base coordinates."
    >
      <template #status>
        <StatusPill status="APPROVED" />
      </template>
    </PageHeader>

    <v-row class="mt-2">
      <v-col cols="12" md="8">
        <AppCard
          eyebrow="ACCOUNT RECORD"
          :title="fullName"
          :subtitle="email"
        >
          <div class="d-flex flex-column ga-3 font-mono text-body-2">
            <div class="d-flex justify-space-between">
              <span class="text-medium-emphasis">ASSIGNED ROLE</span>
              <span>{{ role }}</span>
            </div>
            <div class="d-flex justify-space-between">
              <span class="text-medium-emphasis">PAYMENT MSISDN</span>
              <span>{{ paymentPhone }}</span>
            </div>
            <div class="d-flex justify-space-between">
              <span class="text-medium-emphasis">CONTACT MSISDN</span>
              <span>{{ contactPhone }}</span>
            </div>
          </div>
        </AppCard>
      </v-col>
    </v-row>
  </div>
</template>
