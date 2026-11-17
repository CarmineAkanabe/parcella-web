<script setup lang="ts">
import { Sun, Moon } from '@lucide/vue'
import { useThemeStore } from '@/shared/stores/theme'
import { RouteTransition, StatusPill } from '@/components/common'

const themeStore = useThemeStore()

const telemetrySpecs = [
  {
    code: 'SPEC-01',
    title: 'XAF Escrow Ledger Protection',
    detail: 'Funds remain locked in atomic escrow until 6-digit recipient verification completes.',
    status: 'HELD',
  },
  {
    code: 'SPEC-02',
    title: 'PostGIS Spatial Dispatch',
    detail: 'Sub-second proximity matching across verified bike, motorbike, car, and van fleets.',
    status: 'AVAILABLE',
  },
  {
    code: 'SPEC-03',
    title: '2-Step Custody Handshake',
    detail: 'Cryptographic pickup and delivery codes prevent premature release or disputed handoffs.',
    status: 'COMPLETED',
  },
]
</script>

<template>
  <v-main class="public-layout">
    <v-row no-gutters class="fill-height">
      <v-col
        cols="12"
        md="6"
        lg="7"
        class="d-none d-md-flex"
      >
        <v-sheet
          theme="dark"
          class="public-showcase fill-height w-100 d-flex flex-column justify-space-between pa-8 pa-lg-12"
        >
          <div class="d-flex align-center justify-space-between">
            <div class="d-flex align-center ga-3">
              <v-avatar color="primary" variant="tonal" rounded="lg" size="42">
                <v-icon icon="mdi-cube-send" size="24" />
              </v-avatar>
              <div>
                <div class="text-subtitle-1 font-weight-bold">
                  PARCELLA // LOGISTICS
                </div>
                <div class="text-caption font-mono text-medium-emphasis">
                  CAMEROON URBAN DISPATCH &amp; ESCROW NETWORK
                </div>
              </div>
            </div>
            <v-chip color="primary" variant="tonal" size="small" class="font-mono">
              API v1 // LIVE
            </v-chip>
          </div>

          <div class="my-auto py-8 max-w-showcase">
            <div class="text-overline font-mono text-primary mb-2">
              INDUSTRIAL ESCROW INFRASTRUCTURE
            </div>
            <h1 class="text-h3 font-weight-bold mb-4 showcase-headline">
              Every parcel backed by verifiable custody and instant XAF escrow.
            </h1>
            <p class="text-body-1 text-medium-emphasis mb-8">
              Engineered for urban shippers, independent couriers, and fleet operators across
              Douala and Yaoundé. Zero blind handoffs, deterministic state transitions, and
              transparent fee settlement.
            </p>

            <div class="d-flex flex-column ga-3">
              <v-sheet
                v-for="spec in telemetrySpecs"
                :key="spec.code"
                rounded="lg"
                class="pa-4 showcase-spec-card d-flex align-start justify-space-between ga-4"
              >
                <div>
                  <div class="d-flex align-center ga-2 mb-1">
                    <span class="text-caption font-mono text-primary font-weight-bold">
                      {{ spec.code }}
                    </span>
                    <span class="text-subtitle-2 font-weight-bold">
                      {{ spec.title }}
                    </span>
                  </div>
                  <div class="text-body-2 text-medium-emphasis">
                    {{ spec.detail }}
                  </div>
                </div>
                <StatusPill :status="spec.status" size="x-small" />
              </v-sheet>
            </div>
          </div>

          <div class="d-flex align-center justify-space-between text-caption font-mono text-medium-emphasis pt-4 showcase-footer">
            <span>COORDS // 04.0511° N, 09.7679° E</span>
            <span>CURRENCY // XAF (FCFA)</span>
            <span>PROTOCOL // RFC-9457</span>
          </div>
        </v-sheet>
      </v-col>

      <v-col
        cols="12"
        md="6"
        lg="5"
        class="d-flex flex-column justify-space-between public-form-column"
      >
        <div class="d-flex align-center justify-space-between px-6 py-4">
          <div class="d-flex d-md-none align-center ga-2">
            <v-avatar color="primary" variant="tonal" rounded="lg" size="32">
              <v-icon icon="mdi-cube-send" size="18" />
            </v-avatar>
            <span class="text-subtitle-2 font-weight-bold font-mono">
              PARCELLA
            </span>
          </div>
          <v-spacer />
          <v-btn
            variant="tonal"
            color="secondary"
            size="small"
            class="font-mono"
            aria-label="Toggle color theme"
            @click="themeStore.toggleTheme()"
          >
            <Sun v-if="themeStore.isDark" :size="16" class="mr-2" />
            <Moon v-else :size="16" class="mr-2" />
            <span>{{ themeStore.isDark ? 'LIGHT' : 'DARK' }}</span>
          </v-btn>
        </div>

        <v-container class="my-auto px-6 py-8 max-w-form">
          <RouteTransition>
            <slot />
          </RouteTransition>
        </v-container>

        <div class="px-6 py-4 text-center text-caption font-mono text-medium-emphasis">
          PARCELLA ESCROW DELIVERY PLATFORM // SECURE OPERATOR ACCESS
        </div>
      </v-col>
    </v-row>
  </v-main>
</template>

<style scoped>
.public-layout {
  min-height: 100vh;
  background-color: rgb(var(--v-theme-background));
}

.public-showcase {
  background-color: rgb(var(--v-theme-background));
  border-right: 1px solid rgba(var(--v-theme-on-surface), 0.12);
}

.max-w-showcase {
  max-width: 600px;
}

.showcase-headline {
  line-height: 1.15;
  letter-spacing: -0.02em;
}

.showcase-spec-card {
  background-color: rgb(var(--v-theme-surface));
  border: 1px solid rgba(var(--v-theme-on-surface), 0.1);
}

.showcase-footer {
  border-top: 1px solid rgba(var(--v-theme-on-surface), 0.1);
}

.public-form-column {
  min-height: 100vh;
  background-color: rgb(var(--v-theme-background));
}

.max-w-form {
  max-width: 480px;
}
</style>
