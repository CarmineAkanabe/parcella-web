<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'
import { Sun, Moon } from '@lucide/vue'
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
  return (route.meta.title as string | undefined) ?? 'Operations Console'
})

const roleLabel = computed(() => authStore.role ?? 'GUEST')

const userInitials = computed(() => {
  const fullName = authStore.user?.fullName?.trim()
  if (!fullName) return 'PC'
  const parts = fullName.split(/\s+/)
  const first = parts[0]?.[0] ?? 'P'
  const second = parts[1]?.[0] ?? ''
  return `${first}${second}`.toUpperCase()
})

const verificationOrStatus = computed(() => {
  if (authStore.user?.driver) {
    return authStore.user.driver.verificationStatus
  }
  return 'APPROVED'
})

async function handleLogout(): Promise<void> {
  authStore.clearSession()
  toast.info('Session signed out.')
  await router.push({ name: 'login' })
}
</script>

<template>
  <v-app-bar flat height="64" class="header-shell px-2 px-md-4">
    <v-btn
      v-if="!mdAndUp"
      icon="mdi-menu"
      variant="text"
      aria-label="Open navigation menu"
      class="mr-2"
      @click="emit('toggle-mobile')"
    />

    <div class="d-flex align-center ga-3 overflow-hidden">
      <span class="text-subtitle-1 font-weight-bold text-truncate">
        {{ pageTitle }}
      </span>
      <v-chip
        size="x-small"
        color="secondary"
        variant="tonal"
        class="font-mono font-weight-semibold d-none d-sm-inline-flex"
      >
        {{ roleLabel }}
      </v-chip>
      <StatusPill
        :status="verificationOrStatus"
        size="x-small"
        class="d-none d-md-inline-flex"
      />
    </div>

    <v-spacer />

    <div class="d-flex align-center ga-1 ga-sm-2">
      <v-btn
        variant="text"
        icon
        aria-label="Toggle color theme"
        @click="themeStore.toggleTheme()"
      >
        <Sun v-if="themeStore.isDark" :size="18" />
        <Moon v-else :size="18" />
      </v-btn>

      <v-btn
        variant="text"
        icon="mdi-bell-outline"
        to="/notifications"
        aria-label="Notifications"
      />

      <v-menu location="bottom end" offset="8">
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            variant="tonal"
            color="primary"
            rounded="lg"
            class="px-2"
            aria-label="Account menu"
          >
            <v-avatar size="28" color="primary" variant="flat" class="mr-sm-2">
              <span class="text-caption font-mono font-weight-bold">
                {{ userInitials }}
              </span>
            </v-avatar>
            <span class="text-body-2 font-weight-medium d-none d-sm-inline text-truncate max-w-name">
              {{ authStore.user?.fullName ?? 'Operator' }}
            </span>
            <v-icon icon="mdi-chevron-down" size="16" class="ml-1 d-none d-sm-inline" />
          </v-btn>
        </template>

        <v-list density="compact" min-width="210" rounded="lg" class="pa-2">
          <div class="px-3 py-2">
            <div class="text-body-2 font-weight-bold">
              {{ authStore.user?.fullName ?? 'Parcella Operator' }}
            </div>
            <div class="text-caption font-mono text-medium-emphasis">
              {{ authStore.user?.email ?? 'unauthenticated@parcella.cm' }}
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
  </v-app-bar>
</template>

<style scoped>
.header-shell {
  background-color: rgb(var(--v-theme-surface));
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

.max-w-name {
  max-width: 140px;
}
</style>
