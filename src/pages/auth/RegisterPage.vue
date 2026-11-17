<script setup lang="ts">
import { ref } from 'vue'
import type { Role } from '@/shared/types'
import { AppCard, StatusPill } from '@/components/common'

const fullName = ref('')
const email = ref('')
const paymentPhoneNumber = ref('237')
const role = ref<Role>('CUSTOMER')
</script>

<template>
  <AppCard
    eyebrow="ONBOARDING // NEW IDENTITY"
    title="Create Parcella Account"
    subtitle="Register as a Customer shipper or apply as a verified Fleet Driver."
  >
    <template #actions>
      <StatusPill status="PENDING" size="x-small" />
    </template>

    <v-form @submit.prevent>
      <div class="d-flex flex-column ga-3">
        <v-select
          v-model="role"
          label="Account Role"
          :items="[
            { title: 'Customer — Send & Receive Parcels', value: 'CUSTOMER' },
            { title: 'Driver — Courier & Fleet Operator', value: 'DRIVER' },
          ]"
          prepend-inner-icon="mdi-badge-account-outline"
        />
        <v-text-field
          v-model="fullName"
          label="Full Legal Name"
          placeholder="Jean-Paul Mbarga"
          prepend-inner-icon="mdi-account-outline"
        />
        <v-text-field
          v-model="email"
          label="Email Address"
          type="email"
          placeholder="jp.mbarga@parcella.cm"
          prepend-inner-icon="mdi-email-outline"
        />
        <v-text-field
          v-model="paymentPhoneNumber"
          label="Mobile Money Number (237XXXXXXXXX)"
          placeholder="237670000000"
          prepend-inner-icon="mdi-cellphone-check"
          class="font-mono"
        />

        <v-btn
          type="submit"
          color="primary"
          variant="flat"
          size="large"
          block
          class="mt-2 font-weight-bold"
        >
          Register Identity
        </v-btn>
      </div>
    </v-form>

    <template #footer>
      <div class="d-flex align-center justify-space-between text-body-2">
        <span class="text-medium-emphasis">Already registered?</span>
        <v-btn
          variant="text"
          color="primary"
          size="small"
          to="/login"
          class="font-weight-bold"
        >
          Sign In
        </v-btn>
      </div>
    </template>
  </AppCard>
</template>
