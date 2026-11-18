<script setup lang="ts">
import { useThemeStore } from '@/shared/stores/theme'
import { RouteTransition, AppLogo } from '@/components/common'

const themeStore = useThemeStore()
</script>

<template>
  <v-main class="error-layout d-flex flex-column justify-space-between">
    <!-- Distraction-free Error Header (Matches Stitch Error Suite Header) -->
    <header class="error-header px-4 px-md-8 py-3">
      <div class="max-w-error-shell mx-auto d-flex align-center justify-space-between ga-3">
        <RouterLink to="/" class="text-decoration-none d-inline-flex align-center">
          <AppLogo size="md" subtitle="CEMAC Escrow Logistics" />
        </RouterLink>

        <div class="d-flex align-center ga-3">
          <div class="hub-status-pill d-none d-sm-inline-flex align-center ga-2 px-3 py-1 rounded-pill font-mono text-caption">
            <span class="hub-dot" />
            <span>Douala &amp; Yaoundé Hubs: Normal Dispatch</span>
          </div>

          <span class="font-mono text-caption text-medium-emphasis d-none d-md-inline">
            237-GATEWAY
          </span>

          <v-btn
            variant="tonal"
            color="secondary"
            size="small"
            :prepend-icon="themeStore.isDark ? 'mdi-weather-sunny' : 'mdi-weather-night'"
            aria-label="Toggle color theme"
            @click="themeStore.toggleTheme()"
          >
            {{ themeStore.isDark ? 'Light' : 'Dark' }}
          </v-btn>
        </div>
      </div>
    </header>

    <v-container class="my-auto py-8 px-4 px-md-6 max-w-error-content">
      <RouteTransition>
        <slot />
      </RouteTransition>
    </v-container>

    <footer class="error-footer px-4 px-md-8 py-4">
      <div class="max-w-error-shell mx-auto d-flex flex-column flex-sm-row align-sm-center justify-space-between ga-2 text-caption text-medium-emphasis">
        <div>
          <strong class="text-high-emphasis">Parcella Escrow Logistics</strong> © 2026 Parcella Inc. Cameroon. Regulated under CEMAC Framework.
        </div>
        <div class="d-flex flex-wrap align-center ga-3 font-mono">
          <RouterLink to="/" class="error-footer-link text-decoration-none">Home</RouterLink>
          <span>·</span>
          <RouterLink to="/about" class="error-footer-link text-decoration-none">Carrier Standards</RouterLink>
          <span>·</span>
          <RouterLink to="/about" class="error-footer-link text-decoration-none">Dispute Resolution</RouterLink>
        </div>
      </div>
    </footer>
  </v-main>
</template>

<style scoped>
.error-layout {
  min-height: 100vh;
  background-color: rgb(var(--v-theme-background));
  background-image: radial-gradient(rgba(var(--v-theme-on-surface), 0.08) 1px, transparent 1px);
  background-size: 20px 20px;
}

.error-header {
  border-bottom: 1px solid var(--border-subtle);
  background-color: rgb(var(--v-theme-surface));
}

.error-footer {
  border-top: 1px solid var(--border-subtle);
  background-color: rgb(var(--v-theme-surface));
}

.max-w-error-shell {
  max-width: 1180px;
}

.max-w-error-content {
  max-width: 980px;
}

.hub-status-pill {
  background-color: rgba(var(--v-theme-success), 0.1);
  color: rgb(var(--v-theme-success));
  border: 1px solid rgba(var(--v-theme-success), 0.25);
}

.hub-dot {
  display: inline-block;
  width: 7px;
  height: 7px;
  border-radius: 9999px;
  background-color: rgb(var(--v-theme-success));
}

.error-footer-link {
  color: rgb(var(--v-theme-on-surface-variant));
}

.error-footer-link:hover {
  color: rgb(var(--v-theme-primary));
}
</style>
