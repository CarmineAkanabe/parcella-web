<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/shared/stores/auth'
import { AppCard } from '@/components/common'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const isRetrying = ref(false)

const homeDestination = computed(() => (authStore.isAuthenticated ? authStore.homeRoute : '/'))

async function handleRetry(): Promise<void> {
  isRetrying.value = true
  const fromParam = route.query.from
  if (typeof fromParam === 'string' && fromParam.startsWith('/') && !fromParam.startsWith('/error')) {
    await router.push(fromParam)
  } else {
    await router.push(homeDestination.value)
  }
  isRetrying.value = false
}
</script>

<template>
  <AppCard :padded="false">
    <div class="manifest-topbar px-5 py-3 d-flex align-center justify-space-between">
      <v-chip size="x-small" color="warning" variant="flat" class="font-mono font-weight-bold">
        500 · SERVER ERROR
      </v-chip>
      <span class="text-caption text-success font-weight-bold">● Escrow payments remain safe</span>
    </div>

    <div class="pa-6 pa-md-8">
      <v-row class="align-center ga-y-6">
        <v-col cols="12" md="7" class="pr-md-6">
          <h1 class="text-h4 font-weight-extrabold text-high-emphasis mb-3 lh-tight">
            Something went wrong on our side.
          </h1>

          <p class="text-body-2 text-medium-emphasis mb-6 lh-relaxed">
            We couldn't finish loading your request right now. Any active delivery payments in escrow
            are completely safe. Please try again in a moment.
          </p>

          <div class="d-flex flex-wrap align-center ga-3">
            <v-btn
              color="primary"
              variant="flat"
              size="large"
              prepend-icon="mdi-refresh"
              :loading="isRetrying"
              class="font-weight-bold px-6"
              @click="handleRetry"
            >
              Try Again
            </v-btn>
            <v-btn
              variant="outlined"
              color="secondary"
              size="large"
              :to="homeDestination"
              class="font-weight-bold"
            >
              Return to Home
            </v-btn>
          </div>
        </v-col>

        <v-col cols="12" md="5">
          <div class="crate-photo-frame rounded-xl overflow-hidden position-relative">
            <img
              src="/images/fleet-hub-yaounde.png"
              alt="Parcella delivery hub"
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
