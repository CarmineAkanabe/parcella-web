<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/shared/stores/auth'
import { AppCard, StatusPill } from '@/components/common'

const route = useRoute()
const authStore = useAuthStore()

const requestedPath = computed(() => route.fullPath)
const destinationRoute = computed(() =>
  authStore.isAuthenticated ? authStore.homeRoute : '/login',
)
const destinationLabel = computed(() =>
  authStore.isAuthenticated ? 'Return to Workspace' : 'Return to Operator Sign In',
)
</script>

<template>
  <AppCard
    eyebrow="404 // ROUTE NOT FOUND"
    title="Requested waypoint outside dispatch perimeter"
    subtitle="The URL path you entered does not resolve to an active Parcella logistics module."
  >
    <template #actions>
      <StatusPill status="FAILED" size="small" />
    </template>

    <v-sheet
      rounded="lg"
      class="pa-4 mb-6 not-found-telemetry font-mono text-caption d-flex flex-column ga-2"
    >
      <div class="d-flex justify-space-between">
        <span class="text-medium-emphasis">REQUESTED_PATH</span>
        <span class="font-weight-bold text-primary">{{ requestedPath }}</span>
      </div>
      <div class="d-flex justify-space-between">
        <span class="text-medium-emphasis">GRID_REFERENCE</span>
        <span>04.0511° N // 09.7679° E</span>
      </div>
      <div class="d-flex justify-space-between">
        <span class="text-medium-emphasis">DISPATCH_STATUS</span>
        <span>UNROUTABLE_COORDINATE</span>
      </div>
    </v-sheet>

    <div class="d-flex flex-wrap align-center ga-3">
      <v-btn
        color="primary"
        variant="flat"
        prepend-icon="mdi-compass-outline"
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
.not-found-telemetry {
  background-color: rgb(var(--v-theme-background));
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}
</style>
