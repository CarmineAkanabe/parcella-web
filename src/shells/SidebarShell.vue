<script setup lang="ts">
import { computed } from 'vue'
import { useDisplay } from 'vuetify'
import { useAuthStore } from '@/shared/stores/auth'
import { StatusPill } from '@/components/common'
import { getPrimaryNavForRole, SECONDARY_NAV_ITEMS } from './navConfig'

const { mdAndUp } = useDisplay()
const authStore = useAuthStore()

const primaryItems = computed(() => getPrimaryNavForRole(authStore.role))
const driverSummary = computed(() => authStore.user?.driver ?? null)
</script>

<template>
  <v-navigation-drawer
    :model-value="mdAndUp"
    :permanent="mdAndUp"
    width="268"
    class="sidebar-shell"
  >
    <!-- Top Brand + Corridor Badge (Matches Stitch Screen 2) -->
    <div class="pa-4 sidebar-brand">
      <div class="d-flex align-center ga-3 mb-3">
        <v-avatar color="primary" variant="flat" rounded="lg" size="36" class="flex-shrink-0">
          <v-icon icon="mdi-package-variant-closed" size="20" />
        </v-avatar>
        <div class="min-w-0">
          <div class="text-subtitle-1 font-weight-bold text-primary lh-tight">
            Parcella
          </div>
          <div class="text-caption text-medium-emphasis whitespace-nowrap">
            Escrow Delivery Platform
          </div>
        </div>
      </div>

      <div class="corridor-badge px-2.5 py-1 rounded d-inline-flex align-center ga-2 font-mono text-caption whitespace-nowrap">
        <span class="corridor-dot flex-shrink-0" />
        <span>DLA · YDE Active Corridor</span>
      </div>
    </div>

    <v-divider />

    <div class="px-4 pt-4 pb-1">
      <span class="sidebar-section-label text-uppercase text-medium-emphasis">
        Logistics Operations
      </span>
    </div>

    <v-list nav density="compact" class="px-3">
      <v-list-item
        v-for="item in primaryItems"
        :key="item.routeName"
        :to="item.to"
        :prepend-icon="item.icon"
        :title="item.title"
        :exact="item.to === '/customer' || item.to === '/driver' || item.to === '/admin'"
        color="primary"
        rounded="lg"
        class="mb-1 sidebar-nav-item"
      />
    </v-list>

    <div class="px-4 pt-3 pb-1">
      <span class="sidebar-section-label text-uppercase text-medium-emphasis">
        Account &amp; Preferences
      </span>
    </div>

    <v-list nav density="compact" class="px-3">
      <v-list-item
        v-for="item in SECONDARY_NAV_ITEMS"
        :key="item.routeName"
        :to="item.to"
        :prepend-icon="item.icon"
        :title="item.title"
        color="primary"
        rounded="lg"
        class="mb-1 sidebar-nav-item"
      />
    </v-list>

    <template #append>
      <v-divider />
      <div class="pa-3 sidebar-footer-wrap">
        <v-sheet
          rounded="lg"
          class="pa-3 sidebar-status-box d-flex flex-column ga-2"
        >
          <div class="d-flex align-center justify-space-between ga-1 whitespace-nowrap">
            <div class="d-flex align-center ga-1 text-caption font-weight-bold text-success">
              <v-icon icon="mdi-shield-check" size="15" color="success" />
              <span>CEMAC Escrow Shield</span>
            </div>
            <span class="active-mini-pill font-mono font-weight-bold">
              ACTIVE
            </span>
          </div>

          <p class="text-caption text-medium-emphasis mb-0 lh-snug">
            <template v-if="driverSummary">
              Driver Trust Score: <strong class="font-mono text-high-emphasis">{{ driverSummary.trustScore.toFixed(0) }} pts</strong> · Verified handovers.
            </template>
            <template v-else>
              Funds remain locked in regulated escrow until 6-digit handover verification.
            </template>
          </p>

          <div v-if="driverSummary" class="d-flex align-center justify-space-between pt-1">
            <span class="text-caption text-medium-emphasis">Availability</span>
            <StatusPill :status="driverSummary.availabilityStatus" size="x-small" />
          </div>
        </v-sheet>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<style scoped>
.sidebar-shell {
  background-color: rgb(var(--v-theme-surface));
  border-right: 1px solid var(--border-subtle);
}

.whitespace-nowrap {
  white-space: nowrap;
}

.lh-tight {
  line-height: 1.15;
}

.lh-snug {
  line-height: 1.38;
  font-size: 11px !important;
}

.sidebar-section-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.sidebar-nav-item :deep(.v-list-item-title) {
  font-size: 13.5px !important;
  font-weight: 500;
}

.corridor-badge {
  background-color: rgb(var(--v-theme-surface-variant));
  border: 1px solid var(--border-subtle);
  font-size: 11px !important;
  padding: 4px 8px;
}

.corridor-dot {
  display: inline-block;
  width: 7px;
  height: 7px;
  border-radius: 9999px;
  background-color: rgb(var(--v-theme-success));
}

.active-mini-pill {
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
  background-color: rgba(var(--v-theme-success), 0.14);
  color: rgb(var(--v-theme-success));
}

.sidebar-footer-wrap {
  background-color: rgba(var(--v-theme-surface-variant), 0.45);
}

.sidebar-status-box {
  background-color: rgb(var(--v-theme-surface));
  border: 1px solid var(--border-subtle);
}
</style>
