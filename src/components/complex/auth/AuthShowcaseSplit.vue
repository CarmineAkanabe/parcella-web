<script setup lang="ts">
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
  <v-container class="my-auto py-6 px-4 px-md-6 max-w-auth-split">
    <v-row class="align-stretch">
      <!-- Left Dark Rounded Showcase Card with Real Photographic Background Overlay (5 cols) -->
      <v-col cols="12" md="5" class="d-none d-md-flex">
        <v-sheet
          theme="dark"
          rounded="xl"
          class="auth-showcase w-100 d-flex flex-column justify-space-between pa-8 pa-lg-9 position-relative overflow-hidden"
        >
          <!-- Real Photographic Background Layer -->
          <div class="auth-showcase__photo" aria-hidden="true" />
          <div class="auth-showcase__overlay" aria-hidden="true" />

          <div class="position-relative z-content">
            <div class="showcase-protocol-pill d-inline-flex align-center ga-2 px-3 py-1 mb-5 font-mono text-caption">
              <v-icon icon="mdi-shield-check-outline" color="primary" size="15" />
              <span>Escrow Protocol CEMAC · #7492-CMR</span>
            </div>

            <h1 class="text-h4 font-weight-bold mb-3 showcase-headline">
              Send packages across Douala and Yaoundé with escrow protection.
            </h1>

            <p class="text-body-2 showcase-muted-text mb-6 lh-relaxed">
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

          <div class="pt-5 mt-6 showcase-footer position-relative z-content">
            <div class="d-flex align-center justify-space-between text-caption mb-2">
              <span class="showcase-muted-text">Live Corridor Performance</span>
              <span class="font-mono text-success font-weight-bold">99.8% Release Rate</span>
            </div>
            <div class="showcase-corridor-bar px-3 py-2 rounded-lg d-flex align-center justify-space-between font-mono text-caption">
              <div class="d-flex align-center ga-2">
                <span class="corridor-dot" />
                <span>Douala – Yaoundé Express Corridor</span>
              </div>
              <span class="showcase-muted-text">Regulated CEMAC</span>
            </div>
          </div>
        </v-sheet>
      </v-col>

      <!-- Right Auth Form Card Column (7 cols) -->
      <v-col cols="12" md="7" class="d-flex flex-column">
        <slot />
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.max-w-auth-split {
  max-width: 1200px;
}

.auth-showcase {
  background-color: var(--showcase-bg) !important;
  color: var(--showcase-fg) !important;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: var(--shadow-elevated);
}

.auth-showcase__photo {
  position: absolute;
  inset: 0;
  background-image: url('/images/hero-courier-douala.png');
  background-size: cover;
  background-position: center top;
  opacity: 0.22;
  filter: saturate(0.85) contrast(1.08);
  pointer-events: none;
}

.auth-showcase__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(23, 27, 33, 0.84) 0%,
    rgba(23, 27, 33, 0.94) 52%,
    rgba(23, 27, 33, 0.98) 100%
  );
  pointer-events: none;
}

.z-content {
  z-index: 2;
}

.showcase-muted-text {
  color: var(--showcase-muted);
}

.showcase-protocol-pill {
  background-color: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: var(--radius-sm);
}

.showcase-headline {
  line-height: 1.18;
  letter-spacing: -0.02em;
}

.lh-relaxed {
  line-height: 1.52;
}

.showcase-spec-card {
  background-color: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.showcase-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.12);
}

.showcase-corridor-bar {
  background-color: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.corridor-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 9999px;
  background-color: rgb(var(--v-theme-success));
}
</style>
