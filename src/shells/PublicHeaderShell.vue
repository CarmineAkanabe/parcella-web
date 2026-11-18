<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useThemeStore } from '@/shared/stores/theme'
import { useAuthStore } from '@/shared/stores/auth'
import { AppLogo } from '@/components/common'

const route = useRoute()
const themeStore = useThemeStore()
const authStore = useAuthStore()

const isAuthScreen = computed(() => route.name === 'login' || route.name === 'register')
</script>

<template>
  <header class="public-header-shell px-4 px-md-8 py-3">
    <div class="max-w-public-shell mx-auto d-flex align-center justify-space-between ga-4">
      <!-- Brand + Active Corridor Pill -->
      <div class="d-flex align-center ga-4 min-w-0">
        <RouterLink to="/" class="text-decoration-none d-inline-flex align-center">
          <AppLogo size="md" subtitle="CEMAC Escrow Logistics" />
        </RouterLink>

        <div class="corridor-pill d-none d-lg-inline-flex align-center ga-2 px-3 py-1 rounded-pill font-mono text-caption whitespace-nowrap">
          <span class="corridor-dot flex-shrink-0" />
          <span>Douala &amp; Yaoundé Hubs Active</span>
        </div>
      </div>

      <!-- Center Marketing Nav Links -->
      <nav class="d-none d-md-flex align-center ga-6" aria-label="Public navigation">
        <RouterLink
          to="/"
          class="public-nav-link text-body-2 font-weight-semibold text-decoration-none"
          :class="{ 'public-nav-link--active': route.path === '/' }"
        >
          Home
        </RouterLink>
        <RouterLink
          to="/about"
          class="public-nav-link text-body-2 font-weight-semibold text-decoration-none"
          :class="{ 'public-nav-link--active': route.path === '/about' }"
        >
          About &amp; Provisions
        </RouterLink>
        <RouterLink
          to="/register"
          class="public-nav-link text-body-2 font-weight-semibold text-decoration-none"
          :class="{ 'public-nav-link--active': route.path === '/register' }"
        >
          Courier Network
        </RouterLink>
      </nav>

      <!-- Right Actions -->
      <div class="d-flex align-center ga-2 flex-shrink-0">
        <v-btn
          v-if="isAuthScreen"
          variant="text"
          color="secondary"
          size="small"
          prepend-icon="mdi-arrow-left"
          to="/"
          class="d-none d-sm-inline-flex font-weight-semibold"
        >
          Return to Home
        </v-btn>

        <v-btn
          variant="tonal"
          color="secondary"
          size="small"
          :prepend-icon="themeStore.isDark ? 'mdi-weather-sunny' : 'mdi-weather-night'"
          aria-label="Toggle color theme"
          @click="themeStore.toggleTheme()"
        >
          <span class="d-none d-sm-inline">{{ themeStore.isDark ? 'Light' : 'Dark' }}</span>
        </v-btn>

        <template v-if="authStore.isAuthenticated">
          <v-btn
            color="primary"
            variant="flat"
            size="small"
            prepend-icon="mdi-view-dashboard-outline"
            :to="authStore.homeRoute"
            class="font-weight-bold px-4"
          >
            Open Dashboard
          </v-btn>
        </template>
        <template v-else-if="!isAuthScreen">
          <v-btn
            variant="text"
            color="secondary"
            size="small"
            to="/login"
            class="font-weight-bold"
          >
            Sign In
          </v-btn>
          <v-btn
            color="primary"
            variant="flat"
            size="small"
            append-icon="mdi-arrow-right"
            to="/register"
            class="font-weight-bold px-4"
          >
            Send a Package
          </v-btn>
        </template>
      </div>
    </div>
  </header>
</template>

<style scoped>
.public-header-shell {
  position: sticky;
  top: 0;
  z-index: 40;
  background-color: rgba(var(--v-theme-surface), 0.95);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--border-subtle);
}

.max-w-public-shell {
  max-width: 1240px;
}

.whitespace-nowrap {
  white-space: nowrap;
}

.corridor-pill {
  background-color: rgb(var(--v-theme-surface-variant));
  border: 1px solid var(--border-subtle);
}

.corridor-dot {
  display: inline-block;
  width: 7px;
  height: 7px;
  border-radius: 9999px;
  background-color: rgb(var(--v-theme-success));
}

.public-nav-link {
  color: rgb(var(--v-theme-on-surface-variant));
  padding: 6px 2px;
  border-bottom: 2px solid transparent;
  transition: color var(--transition-fast), border-color var(--transition-fast);
}

.public-nav-link:hover {
  color: rgb(var(--v-theme-on-surface));
}

.public-nav-link--active {
  color: rgb(var(--v-theme-primary));
  border-bottom-color: rgb(var(--v-theme-primary));
}
</style>
