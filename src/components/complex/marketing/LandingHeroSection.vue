<script setup lang="ts">
import { StatusPill } from '@/components/common'

const trustMetrics = [
  {
    value: '100%',
    icon: 'mdi-shield-lock-outline',
    color: 'success',
    title: 'Safe in Escrow',
    subtitle: 'Money held until delivery',
  },
  {
    value: '6-Digit',
    icon: 'mdi-key-variant',
    color: 'primary',
    title: 'Delivery Code',
    subtitle: 'Unlocks payment at drop-off',
  },
  {
    value: '500+',
    icon: 'mdi-badge-account-horizontal-outline',
    color: 'secondary',
    title: 'Verified Riders',
    subtitle: 'ID-checked in Douala & Yaoundé',
  },
]
</script>

<template>
  <v-container class="py-8 py-md-12 px-4 px-md-8 max-w-landing">
    <v-row class="align-center ga-y-8">
      <v-col cols="12" md="6" class="pr-md-6">
        <div class="hero-protocol-pill d-inline-flex align-center ga-2 px-3 py-1 rounded-pill text-caption font-weight-bold mb-5">
          <span class="corridor-dot" />
          <span>Safe Package Delivery in Cameroon</span>
        </div>

        <h1 class="hero-headline font-weight-extrabold text-high-emphasis mb-4">
          Send packages across <span class="text-primary">Douala</span> and
          <span class="text-primary">Yaoundé</span> without worrying about your money.
        </h1>

        <p class="text-body-1 text-medium-emphasis mb-6 lh-relaxed">
          Parcella holds your delivery payment safely in escrow. The courier only gets paid when
          your receiver gets the package and shares the 6-digit delivery code.
        </p>

        <div class="d-flex flex-wrap align-center ga-3 mb-4">
          <v-btn
            color="primary"
            variant="flat"
            size="large"
            prepend-icon="mdi-package-variant-closed"
            append-icon="mdi-arrow-right"
            to="/register"
            class="font-weight-bold px-6"
          >
            Send a Package
          </v-btn>
          <v-btn
            color="secondary"
            variant="tonal"
            size="large"
            prepend-icon="mdi-motorbike"
            to="/register"
            class="font-weight-bold px-5"
          >
            Deliver &amp; Earn
          </v-btn>
        </div>

        <div class="d-flex align-center ga-2 text-caption text-medium-emphasis mb-8">
          <v-icon icon="mdi-check-circle-outline" color="success" size="16" />
          <span>Free to join · Works with Mobile Money</span>
        </div>

        <v-row dense>
          <v-col v-for="metric in trustMetrics" :key="metric.title" cols="12" sm="4">
            <div class="metric-card pa-3 rounded-lg fill-height">
              <div class="d-flex align-center justify-space-between mb-1">
                <span class="text-h6 font-weight-extrabold font-mono" :class="`text-${metric.color}`">
                  {{ metric.value }}
                </span>
                <v-icon :icon="metric.icon" :color="metric.color" size="18" />
              </div>
              <div class="text-caption font-weight-bold text-high-emphasis">{{ metric.title }}</div>
              <div class="text-caption text-medium-emphasis lh-tight">{{ metric.subtitle }}</div>
            </div>
          </v-col>
        </v-row>
      </v-col>

      <!-- Right Photographic Hero Showcase Card -->
      <v-col cols="12" md="6">
        <div class="hero-photo-frame rounded-xl overflow-hidden position-relative pa-4 pa-sm-6 d-flex flex-column justify-space-between">
          <img
            src="/images/hero-courier-douala.png"
            alt="Verified Parcella courier in Akwa Douala with parcel"
            class="hero-photo-img"
          />
          <div class="hero-photo-scrim" aria-hidden="true" />

          <!-- Top Overlay Badges -->
          <div class="d-flex flex-wrap align-center justify-space-between ga-2 position-relative z-overlay">
            <div class="glass-pill px-3 py-1 rounded-pill text-caption font-weight-bold d-inline-flex align-center ga-2">
              <span class="corridor-dot" />
              <span>Active Courier · Akwa, Douala</span>
            </div>
          </div>

          <!-- Bottom Floating Escrow Card -->
          <v-sheet rounded="xl" class="consignment-overlay-card pa-4 position-relative z-overlay mt-auto">
            <div class="d-flex flex-wrap align-center justify-space-between ga-2 pb-3 mb-3 border-b-subtle">
              <span class="text-caption font-weight-bold">Sample Delivery</span>
              <StatusPill status="HELD" size="x-small" />
            </div>

            <div class="d-flex flex-column ga-2 mb-3 text-caption">
              <div class="d-flex align-center justify-space-between">
                <div class="d-flex align-center ga-2">
                  <v-icon icon="mdi-circle-slice-8" color="primary" size="14" />
                  <span class="font-weight-bold text-high-emphasis">Pickup: Akwa, Douala</span>
                </div>
                <span class="text-success font-weight-bold">Picked Up</span>
              </div>

              <div class="d-flex align-center justify-space-between">
                <div class="d-flex align-center ga-2">
                  <v-icon icon="mdi-map-marker-check" color="success" size="16" />
                  <span class="font-weight-bold text-high-emphasis">Drop-off: Bastos, Yaoundé</span>
                </div>
                <span class="text-primary font-weight-bold">On the Way</span>
              </div>
            </div>

            <div class="escrow-lockbox-strip pa-3 rounded-lg d-flex flex-wrap align-center justify-space-between ga-2">
              <div>
                <span class="text-caption text-medium-emphasis d-block">Held Safely in Escrow</span>
                <span class="text-subtitle-1 font-mono font-weight-extrabold text-high-emphasis">25,000 XAF</span>
              </div>
              <div class="pin-preview-pill px-3 py-1 rounded font-mono text-caption font-weight-bold">
                <v-icon icon="mdi-key-outline" size="14" class="mr-1 text-success" />
                Code: 482910
              </div>
            </div>
          </v-sheet>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.max-w-landing {
  max-width: 1200px;
}

.hero-protocol-pill {
  background-color: rgba(var(--v-theme-success), 0.1);
  border: 1px solid rgba(var(--v-theme-success), 0.25);
  color: rgb(var(--v-theme-on-surface));
}

.hero-headline {
  font-size: clamp(2rem, 3.4vw, 2.95rem);
  line-height: 1.14;
  letter-spacing: -0.025em;
}

.lh-relaxed {
  line-height: 1.55;
}

.lh-tight {
  line-height: 1.3;
}

.metric-card {
  background-color: rgb(var(--v-theme-surface));
  border: 1px solid var(--border-subtle);
}

.hero-photo-frame {
  min-height: 490px;
  border: 1px solid var(--border-subtle);
  box-shadow: var(--shadow-elevated);
  background-color: var(--showcase-bg);
}

.hero-photo-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
}

.hero-photo-scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(15, 18, 22, 0.2) 0%, rgba(15, 18, 22, 0.1) 45%, rgba(15, 18, 22, 0.8) 100%);
}

.z-overlay {
  z-index: 2;
}

.glass-pill {
  background-color: rgba(var(--v-theme-surface), 0.94);
  color: rgb(var(--v-theme-on-surface));
  border: 1px solid var(--border-subtle);
}

.consignment-overlay-card {
  background-color: rgba(var(--v-theme-surface), 0.97);
  border: 1px solid var(--border-subtle);
  box-shadow: var(--shadow-elevated);
}

.border-b-subtle {
  border-bottom: 1px solid var(--border-subtle);
}

.escrow-lockbox-strip {
  background-color: rgba(var(--v-theme-surface-variant), 0.65);
  border: 1px solid var(--border-subtle);
}

.pin-preview-pill {
  background-color: rgb(var(--v-theme-surface));
  border: 1px solid var(--border-subtle);
}

.corridor-dot {
  display: inline-block;
  width: 7px;
  height: 7px;
  border-radius: 9999px;
  background-color: rgb(var(--v-theme-success));
}
</style>
