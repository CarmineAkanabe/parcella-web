<script setup lang="ts">
import { useThemeStore } from '@/shared/stores/theme'
import { RouteTransition } from '@/components/common'

const themeStore = useThemeStore()
</script>

<template>
  <v-main class="error-layout d-flex flex-column justify-space-between">
    <div class="d-flex align-center justify-space-between px-6 py-4 error-header">
      <div class="d-flex align-center ga-3">
        <v-avatar color="primary" variant="flat" rounded="lg" size="36">
          <v-icon icon="mdi-cube-send" size="20" />
        </v-avatar>
        <div>
          <div class="text-subtitle-2 font-weight-bold">Parcella</div>
          <div class="text-caption text-medium-emphasis">Escrow Delivery Platform</div>
        </div>
      </div>

      <v-btn
        variant="tonal"
        color="secondary"
        size="small"
        :prepend-icon="themeStore.isDark ? 'mdi-weather-sunny' : 'mdi-weather-night'"
        aria-label="Toggle color theme"
        @click="themeStore.toggleTheme()"
      >
        {{ themeStore.isDark ? 'Light mode' : 'Dark mode' }}
      </v-btn>
    </div>

    <v-container class="my-auto py-8 max-w-error">
      <RouteTransition>
        <slot />
      </RouteTransition>
    </v-container>

    <div class="px-6 py-4 text-center text-caption text-medium-emphasis error-footer">
      Parcella Escrow Delivery Platform
    </div>
  </v-main>
</template>

<style scoped>
.error-layout {
  min-height: 100vh;
  background-color: rgb(var(--v-theme-background));
}

.error-header {
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.08);
  background-color: rgb(var(--v-theme-surface));
}

.error-footer {
  border-top: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

.max-w-error {
  max-width: 640px;
}
</style>
