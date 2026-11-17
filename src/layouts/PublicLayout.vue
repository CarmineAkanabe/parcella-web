<script setup lang="ts">
import { useThemeStore } from '@/shared/stores/theme'
import { RouteTransition } from '@/components/common'

const themeStore = useThemeStore()

const trustFeatures = [
  {
    icon: 'mdi-lock-check-outline',
    color: 'success',
    title: 'Escrow-Protected Payments',
    detail: 'Funds held securely until your 6-digit drop-off PIN code is confirmed at physical delivery.',
  },
  {
    icon: 'mdi-card-account-details-outline',
    color: 'primary',
    title: 'Verified Local Couriers',
    detail: 'Strictly ID-vetted bike, motorbike, car, and van couriers active across Douala & Yaoundé hubs.',
  },
  {
    icon: 'mdi-dialpad',
    color: 'secondary',
    title: '2-Step Handshake Codes',
    detail: 'Instant cryptographic pickup and drop-off verification to protect both sender and courier.',
  },
]
</script>

<template>
  <v-main class="public-layout d-flex flex-column justify-space-between">
    <!-- Top Bar (Matches Stitch Header) -->
    <header class="public-topbar px-6 py-3 d-flex align-center justify-space-between">
      <div class="d-flex align-center ga-4">
        <div class="d-flex align-center ga-2">
          <v-avatar color="primary" variant="flat" rounded="lg" size="34">
            <v-icon icon="mdi-package-variant-closed" size="18" />
          </v-avatar>
          <span class="text-h6 font-weight-bold text-primary">Parcella</span>
        </div>

        <v-chip
          size="small"
          variant="outlined"
          class="d-none d-sm-inline-flex font-mono text-caption"
        >
          <span class="corridor-dot mr-2" />
          Douala &amp; Yaoundé Hubs Active
        </v-chip>
      </div>

      <div class="d-flex align-center ga-2">
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
    </header>

    <!-- Main Split Container (Matches Stitch Floating Rounded Panels) -->
    <v-container class="my-auto py-6 px-4 px-md-6 max-w-public-grid">
      <v-row class="align-stretch">
        <!-- Left Dark Rounded Showcase Card (5 cols on desktop) -->
        <v-col cols="12" md="5" class="d-none d-md-flex">
          <v-sheet
            theme="dark"
            rounded="xl"
            class="public-showcase w-100 d-flex flex-column justify-space-between pa-8 pa-lg-10"
          >
            <div>
              <div class="showcase-protocol-pill d-inline-flex align-center ga-2 px-3 py-1 mb-6 font-mono text-caption">
                <v-icon icon="mdi-shield-check-outline" color="primary" size="15" />
                <span>Escrow Protocol CEMAC · CMR</span>
              </div>

              <h1 class="text-h4 text-lg-h3 font-weight-bold mb-4 showcase-headline">
                Send packages across Douala and Yaoundé with escrow protection.
              </h1>

              <p class="text-body-2 text-medium-emphasis mb-6 lh-relaxed">
                Never lose money to unverified couriers or unfulfilled deliveries. Parcella safeguards
                buyer payments in escrow until physical package handover is verified.
              </p>

            <div class="d-flex flex-column ga-3">
              <div
                v-for="item in trustFeatures"
                :key="item.title"
                class="pa-4 showcase-spec-card rounded-lg d-flex align-start ga-3"
              >
                <v-avatar :color="item.color" variant="tonal" rounded="lg" size="38" class="flex-shrink-0 mt-1">
                  <v-icon :icon="item.icon" size="18" />
                </v-avatar>
                <div>
                  <div class="text-subtitle-2 font-weight-bold text-white mb-1">
                    {{ item.title }}
                  </div>
                  <div class="text-caption showcase-muted-text lh-relaxed">
                    {{ item.detail }}
                  </div>
                </div>
              </div>
            </div>
            </div>

            <div class="pt-6 mt-6 showcase-footer">
              <div class="d-flex align-center justify-space-between text-caption mb-2">
                <span class="text-medium-emphasis">Live Corridor Performance</span>
                <span class="font-mono text-success font-weight-bold">Escrow Protected</span>
              </div>
              <div class="showcase-corridor-bar px-3 py-2 rounded-lg d-flex align-center justify-space-between font-mono text-caption">
                <div class="d-flex align-center ga-2">
                  <span class="corridor-dot" />
                  <span>Douala – Yaoundé Express Corridor</span>
                </div>
                <span class="text-medium-emphasis">XAF (FCFA)</span>
              </div>
            </div>
          </v-sheet>
        </v-col>

        <!-- Right Form Card Column (7 cols on desktop) -->
        <v-col cols="12" md="7" class="d-flex flex-column">
          <RouteTransition>
            <slot />
          </RouteTransition>
        </v-col>
      </v-row>
    </v-container>

    <!-- Bottom Footer (Matches Stitch Footer) -->
    <footer class="public-footer px-6 py-4">
      <div class="max-w-public-grid mx-auto d-flex flex-column flex-sm-row align-sm-center justify-space-between ga-2 text-caption text-medium-emphasis">
        <div>
          <strong class="text-primary mr-2">Parcella</strong>
          © 2026 Parcella Escrow Logistics Cameroon (Douala &amp; Yaoundé).
        </div>
        <div class="d-flex flex-wrap align-center ga-3 font-mono">
          <span>Security &amp; Escrow Terms</span>
          <span>·</span>
          <span>Carrier Standards</span>
          <span>·</span>
          <span>Dispute Resolution</span>
        </div>
      </div>
    </footer>
  </v-main>
</template>

<style scoped>
.public-layout {
  min-height: 100vh;
  background-color: rgb(var(--v-theme-background));
}

.public-topbar {
  background-color: rgb(var(--v-theme-surface));
  border-bottom: 1px solid var(--border-subtle);
}

.public-footer {
  background-color: rgb(var(--v-theme-surface));
  border-top: 1px solid var(--border-subtle);
}

.max-w-public-grid {
  max-width: 1200px;
}

.public-showcase {
  background-color: var(--showcase-bg) !important;
  color: var(--showcase-fg) !important;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: var(--shadow-elevated);
}

.showcase-muted-text {
  color: var(--showcase-muted);
}

.showcase-protocol-pill {
  background-color: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: var(--radius-sm);
}

.showcase-headline {
  line-height: 1.18;
  letter-spacing: -0.02em;
}

.lh-relaxed {
  line-height: 1.55;
}

.showcase-spec-card {
  background-color: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.showcase-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.showcase-corridor-bar {
  background-color: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.corridor-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 9999px;
  background-color: rgb(var(--v-theme-success));
}
</style>
