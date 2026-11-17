<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/shared/stores/auth'
import { AppCard } from '@/components/common'

const route = useRoute()
const authStore = useAuthStore()

const requestedPath = computed(() => route.fullPath)
const destinationRoute = computed(() =>
  authStore.isAuthenticated ? authStore.homeRoute : '/login',
)
const destinationLabel = computed(() =>
  authStore.isAuthenticated ? 'Return to Dashboard' : 'Go to Sign In',
)
</script>

<template>
  <AppCard
    eyebrow="404 · Page Not Found"
    title="We couldn't find that page"
    subtitle="The address you entered doesn't match an active page in Parcella."
  >
    <v-sheet
      rounded="lg"
      class="pa-4 mb-5 not-found-box text-body-2 d-flex align-center justify-space-between ga-3"
    >
      <span class="text-medium-emphasis">Requested URL</span>
      <span class="font-mono font-weight-semibold text-primary text-truncate">{{ requestedPath }}</span>
    </v-sheet>

    <div class="d-flex flex-wrap align-center ga-3">
      <v-btn
        color="primary"
        variant="flat"
        prepend-icon="mdi-home-outline"
        :to="destinationRoute"
      >
        {{ destinationLabel }}
      </v-btn>
      <v-btn
        variant="tonal"
        color="secondary"
        prepend-icon="mdi-arrow-left"
        @click="$router.back()"
      >
        Go Back
      </v-btn>
    </div>
  </AppCard>
</template>

<style scoped>
.not-found-box {
  background-color: rgb(var(--v-theme-background));
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}
</style>
