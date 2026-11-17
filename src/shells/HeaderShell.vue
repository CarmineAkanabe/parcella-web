<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'
import { useThemeStore } from '@/shared/stores/theme'
import { useAuthStore } from '@/shared/stores/auth'
import { useToast } from '@/shared/composables/useToast'
import { StatusPill } from '@/components/common'

const emit = defineEmits<{
  'toggle-mobile': []
}>()

const route = useRoute()
const router = useRouter()
const { mdAndUp } = useDisplay()
const themeStore = useThemeStore()
const authStore = useAuthStore()
const toast = useToast()

const pageTitle = computed(() => {
  return (route.meta.title as string | undefined) ?? 'Dashboard'
})

const activeRole = computed(() => authStore.role ?? 'CUSTOMER')

const userInitials = computed(() => {
  const fullName = authStore.user?.fullName?.trim()
  if (!fullName) return 'PC'
  const parts = fullName.split(/\s+/)
  const first = parts[0]?.[0] ?? 'P'
  const second = parts[1]?.[0] ?? ''
  return `${first}${second}`.toUpperCase()
})

const driverSummary = computed(() => authStore.user?.driver ?? null)

const shortAccountId = computed(() => {
  const id = authStore.user?.id
  if (!id) return 'CMR-USER'
  const prefix = activeRole.value === 'DRIVER' ? 'DRV' : activeRole.value === 'ADMIN' ? 'ADM' : 'CST'
  return `CMR-${prefix}-${id.slice(0, 6).toUpperCase()}`
})

async function handleLogout(): Promise<void> {
  authStore.clearSession()
  toast.info('You have been signed out.')
  await router.push({ name: 'login' })
}
</script>

<template>
  <v-app-bar flat height="64" class="header-shell">
    <div class="header-inner w-100 h-100 px-3 px-md-6 d-flex align-center justify-space-between ga-3">
      <!-- Left: Hamburger + Breadcrumb + Role Pill + Status + Hub (Matches Stitch Header) -->
      <div class="d-flex align-center ga-3 min-w-0">
        <v-btn
          v-if="!mdAndUp"
          icon="mdi-menu"
          variant="text"
          size="small"
          aria-label="Open navigation menu"
          class="flex-shrink-0"
          @click="emit('toggle-mobile')"
        />

        <div class="d-flex align-center ga-1 text-body-2 whitespace-nowrap min-w-0">
          <span class="text-medium-emphasis d-none d-sm-inline">Dashboard</span>
          <v-icon icon="mdi-chevron-right" size="16" class="text-medium-emphasis d-none d-sm-inline flex-shrink-0" />
          <span class="font-weight-bold text-high-emphasis text-truncate">{{ pageTitle }}</span>
        </div>

        <div class="header-sep d-none d-md-block flex-shrink-0" />

        <div class="d-none d-md-flex align-center ga-2 flex-shrink-0 whitespace-nowrap">
          <StatusPill :status="activeRole" size="x-small" class="flex-shrink-0" />
          <StatusPill
            v-if="driverSummary"
            :status="driverSummary.verificationStatus"
            size="x-small"
            class="flex-shrink-0"
          />
          <span class="d-none d-xl-inline-flex align-center ga-1 text-caption font-mono text-medium-emphasis ml-1 whitespace-nowrap">
            <v-icon icon="mdi-map-marker-outline" size="14" />
            Douala Littoral Hub
          </span>
        </div>
      </div>

      <!-- Right: Gateway Pill + Theme Toggle + Notifications + User Menu (Matches Stitch Header) -->
      <div class="d-flex align-center ga-2 flex-shrink-0 whitespace-nowrap">
        <div class="gateway-pill d-none d-lg-inline-flex align-center ga-2 px-3 py-1 rounded font-mono text-caption text-medium-emphasis whitespace-nowrap">
          <span class="gateway-dot flex-shrink-0" />
          <span>Douala Gateway Online</span>
        </div>

        <v-btn
          variant="text"
          size="small"
          :icon="themeStore.isDark ? 'mdi-weather-sunny' : 'mdi-weather-night'"
          aria-label="Toggle color theme"
          @click="themeStore.toggleTheme()"
        />

        <v-btn
          variant="text"
          size="small"
          icon="mdi-bell-outline"
          to="/notifications"
          aria-label="Notifications"
        />

        <div class="header-sep d-none d-sm-block flex-shrink-0" />

        <v-menu location="bottom end" offset="8">
          <template #activator="{ props }">
            <button
              v-bind="props"
              type="button"
              class="user-menu-trigger d-flex align-center ga-2 px-2 py-1 rounded-lg flex-shrink-0"
              aria-label="Account menu"
            >
              <v-avatar size="32" color="primary" variant="flat" class="flex-shrink-0">
                <span class="text-caption font-weight-bold">
                  {{ userInitials }}
                </span>
              </v-avatar>
              <div class="d-none d-sm-flex flex-column text-left">
                <div class="d-flex align-center ga-1">
                  <span class="text-caption font-weight-bold text-high-emphasis text-truncate max-w-name">
                    {{ authStore.user?.fullName ?? 'Account' }}
                  </span>
                  <span v-if="driverSummary" class="text-caption font-mono text-primary font-weight-bold">
                    ★ {{ driverSummary.averageRating.toFixed(1) }}
                  </span>
                </div>
                <span class="font-mono text-medium-emphasis user-code-sub">
                  {{ shortAccountId }}
                </span>
              </div>
              <v-icon icon="mdi-chevron-down" size="16" class="text-medium-emphasis d-none d-sm-inline" />
            </button>
          </template>

          <v-list density="compact" min-width="220" rounded="lg" class="pa-2">
            <div class="px-3 py-2">
              <div class="text-body-2 font-weight-bold">
                {{ authStore.user?.fullName ?? 'Parcella User' }}
              </div>
              <div class="text-caption text-medium-emphasis text-truncate">
                {{ authStore.user?.email ?? '' }}
              </div>
            </div>
            <v-divider class="my-1" />
            <v-list-item
              prepend-icon="mdi-account-circle-outline"
              title="Profile & Settings"
              to="/profile"
              rounded="md"
            />
            <v-list-item
              prepend-icon="mdi-bell-outline"
              title="Notifications"
              to="/notifications"
              rounded="md"
            />
            <v-divider class="my-1" />
            <v-list-item
              prepend-icon="mdi-logout"
              title="Sign Out"
              rounded="md"
              base-color="error"
              @click="handleLogout"
            />
          </v-list>
        </v-menu>
      </div>
    </div>
  </v-app-bar>
</template>

<style scoped>
.header-shell {
  background-color: rgb(var(--v-theme-surface));
  border-bottom: 1px solid var(--border-subtle);
}

.whitespace-nowrap {
  white-space: nowrap;
}

.header-sep {
  width: 1px;
  height: 18px;
  background-color: var(--border-subtle);
}

.gateway-pill {
  background-color: rgb(var(--v-theme-surface-variant));
  border: 1px solid var(--border-subtle);
}

.gateway-dot {
  display: inline-block;
  width: 7px;
  height: 7px;
  border-radius: 9999px;
  background-color: rgb(var(--v-theme-success));
}

.user-menu-trigger {
  background: transparent;
  border: 1px solid transparent;
  cursor: pointer;
  transition: background-color var(--transition-fast), border-color var(--transition-fast);
}

.user-menu-trigger:hover {
  background-color: rgb(var(--v-theme-surface-variant));
  border-color: var(--border-subtle);
}

.user-code-sub {
  font-size: 10px;
  line-height: 1.2;
}

.max-w-name {
  max-width: 150px;
}
</style>
