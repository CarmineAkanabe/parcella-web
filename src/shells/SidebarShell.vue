<script setup lang="ts">
import { computed } from 'vue'
import { useDisplay } from 'vuetify'
import { useAuthStore } from '@/shared/stores/auth'
import { StatusPill } from '@/components/common'
import { getPrimaryNavForRole, SECONDARY_NAV_ITEMS } from './navConfig'

const { mdAndUp } = useDisplay()
const authStore = useAuthStore()

const activeRole = computed(() => authStore.role ?? 'CUSTOMER')
const primaryItems = computed(() => getPrimaryNavForRole(authStore.role))
const driverStatus = computed(
  () => authStore.user?.driver?.availabilityStatus ?? 'AVAILABLE',
)
</script>

<template>
  <v-navigation-drawer
    :model-value="mdAndUp"
    :permanent="mdAndUp"
    width="268"
    class="sidebar-shell"
  >
    <div class="pa-4 d-flex align-center ga-3 sidebar-brand">
      <v-avatar color="primary" variant="tonal" rounded="lg" size="40">
        <v-icon icon="mdi-cube-send" size="22" />
      </v-avatar>
      <div class="overflow-hidden">
        <div class="text-subtitle-1 font-weight-bold text-high-emphasis lh-tight">
          PARCELLA
        </div>
        <div class="text-caption font-mono text-medium-emphasis text-truncate">
          // ESCROW LOGISTICS
        </div>
      </div>
    </div>

    <v-divider />

    <div class="px-4 pt-4 pb-1 d-flex align-center justify-space-between">
      <span class="text-caption font-mono text-medium-emphasis">
        WORKSPACE // {{ activeRole }}
      </span>
      <v-chip
        v-if="!authStore.isAuthenticated"
        size="x-small"
        color="warning"
        variant="tonal"
        class="font-mono"
      >
        PREVIEW
      </v-chip>
    </div>

    <v-list nav density="comfortable" class="px-3">
      <v-list-item
        v-for="item in primaryItems"
        :key="item.routeName"
        :to="item.to"
        :prepend-icon="item.icon"
        :title="item.title"
        :exact="item.to === '/customer' || item.to === '/driver' || item.to === '/admin'"
        color="primary"
        rounded="lg"
        class="mb-1 font-weight-medium"
      />
    </v-list>

    <div class="px-4 pt-3 pb-1">
      <span class="text-caption font-mono text-medium-emphasis">
        ACCOUNT &amp; ALERTS
      </span>
    </div>

    <v-list nav density="comfortable" class="px-3">
      <v-list-item
        v-for="item in SECONDARY_NAV_ITEMS"
        :key="item.routeName"
        :to="item.to"
        :prepend-icon="item.icon"
        :title="item.title"
        color="primary"
        rounded="lg"
        class="mb-1"
      />
    </v-list>

    <template #append>
      <v-divider />
      <div class="pa-4">
        <v-sheet
          rounded="lg"
          class="pa-3 sidebar-status-box d-flex flex-column ga-2"
        >
          <div class="d-flex align-center justify-space-between">
            <span class="text-caption font-mono text-medium-emphasis">
              LEDGER NODE
            </span>
            <StatusPill :status="driverStatus" size="x-small" />
          </div>
          <div class="text-caption font-mono text-medium-emphasis">
            XAF ESCROW // 2-STEP VERIFIED
          </div>
        </v-sheet>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<style scoped>
.sidebar-shell {
  background-color: rgb(var(--v-theme-surface));
  border-right: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

.sidebar-brand {
  min-height: 64px;
}

.lh-tight {
  line-height: 1.15;
  letter-spacing: 0.04em;
}

.sidebar-status-box {
  background-color: rgb(var(--v-theme-background));
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}
</style>
