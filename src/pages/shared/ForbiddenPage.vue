<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/shared/stores/auth'
import { AppCard, StatusPill } from '@/components/common'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const attemptedFrom = computed(() => {
  const fromParam = route.query.from
  return typeof fromParam === 'string' && fromParam.trim() ? fromParam : '/restricted'
})

const activeRoleLabel = computed(() => authStore.role ?? 'GUEST')
const homeDestination = computed(() => (authStore.isAuthenticated ? authStore.homeRoute : '/'))
const homeLabel = computed(() => (authStore.isAuthenticated ? 'Go to My Dashboard' : 'Return to Home'))

async function handleSwitchAccount(): Promise<void> {
  authStore.clearSession()
  await router.push({ name: 'login' })
}
</script>

<template>
  <AppCard :padded="false">
    <div class="manifest-topbar px-5 py-3 d-flex align-center justify-space-between">
      <v-chip size="x-small" color="error" variant="flat" class="font-mono font-weight-bold">
        403 · ACCESS RESTRICTED
      </v-chip>
      <div class="d-flex align-center ga-2 text-caption">
        <span class="text-medium-emphasis">Signed in as:</span>
        <StatusPill :status="activeRoleLabel" size="x-small" />
      </div>
    </div>

    <div class="pa-6 pa-md-8">
      <v-row class="align-center ga-y-6">
        <v-col cols="12" md="7" class="pr-md-6">
          <h1 class="text-h4 font-weight-extrabold text-high-emphasis mb-3 lh-tight">
            You don't have permission to view this page.
          </h1>

          <p class="text-body-2 text-medium-emphasis mb-5 lh-relaxed">
            This page belongs to a different account type (Customer, Driver, or Admin).
            You can return to your own dashboard or sign in with another account.
          </p>

          <div class="enclave-box pa-3 rounded-lg mb-6 d-flex align-center justify-space-between ga-2">
            <span class="text-caption text-medium-emphasis font-weight-semibold">Requested page:</span>
            <span class="font-mono text-body-2 font-weight-bold text-truncate">{{ attemptedFrom }}</span>
          </div>

          <div class="d-flex flex-wrap align-center ga-3">
            <v-btn
              color="primary"
              variant="flat"
              size="large"
              prepend-icon="mdi-view-dashboard-outline"
              :to="homeDestination"
              class="font-weight-bold px-6"
            >
              {{ homeLabel }}
            </v-btn>
            <v-btn
              color="secondary"
              variant="tonal"
              size="large"
              prepend-icon="mdi-account-switch-outline"
              class="font-weight-bold"
              @click="handleSwitchAccount"
            >
              Switch Account
            </v-btn>
          </div>
        </v-col>

        <v-col cols="12" md="5">
          <div class="crate-photo-frame rounded-xl overflow-hidden position-relative">
            <img
              src="/images/error-sealed-crate.png"
              alt="Sealed package crate"
              class="crate-photo-img"
            />
          </div>
        </v-col>
      </v-row>
    </div>
  </AppCard>
</template>

<style scoped>
.manifest-topbar {
  background-color: rgba(var(--v-theme-surface-variant), 0.55);
  border-bottom: 1px solid var(--border-subtle);
}

.lh-tight {
  line-height: 1.18;
}

.lh-relaxed {
  line-height: 1.55;
}

.enclave-box {
  background-color: rgba(var(--v-theme-surface-variant), 0.55);
  border: 1px solid var(--border-subtle);
}

.crate-photo-frame {
  height: 210px;
  border: 1px solid var(--border-subtle);
}

.crate-photo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
