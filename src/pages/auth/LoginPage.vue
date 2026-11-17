<script setup lang="ts">
import { ref } from 'vue'
import { AppCard, StatusPill } from '@/components/common'

const email = ref('')
const password = ref('')
</script>

<template>
  <AppCard
    eyebrow="AUTHENTICATION // OPERATOR ACCESS"
    title="Sign in to Parcella"
    subtitle="Enter your registered credentials to access the escrow delivery console."
  >
    <template #actions>
      <StatusPill status="AVAILABLE" size="x-small" />
    </template>

    <v-form @submit.prevent>
      <div class="d-flex flex-column ga-3">
        <v-text-field
          v-model="email"
          label="Email Address"
          type="email"
          placeholder="operator@parcella.cm"
          prepend-inner-icon="mdi-email-outline"
          autocomplete="email"
        />
        <v-text-field
          v-model="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          prepend-inner-icon="mdi-lock-outline"
          autocomplete="current-password"
        />

        <v-btn
          type="submit"
          color="primary"
          variant="flat"
          size="large"
          block
          class="mt-2 font-weight-bold"
        >
          Sign In to Console
        </v-btn>
      </div>
    </v-form>

    <template #footer>
      <div class="d-flex align-center justify-space-between text-body-2">
        <span class="text-medium-emphasis">New to Parcella?</span>
        <v-btn
          variant="text"
          color="primary"
          size="small"
          to="/register"
          class="font-weight-bold"
        >
          Create Operator Account
        </v-btn>
      </div>
    </template>
  </AppCard>
</template>
