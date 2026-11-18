<script setup lang="ts">
import { useToast } from '@/shared/composables/useToast'
import { StatusPill } from '@/components/common'

const toast = useToast()

function notifyComingSoon(platform: 'Android' | 'iOS'): void {
  toast.info(`Parcella for ${platform} is planned for v2. Use the web app today!`)
}
</script>

<template>
  <v-container class="pb-12 px-4 px-md-8 max-w-landing">
    <v-sheet theme="dark" rounded="xl" class="mobile-teaser-card pa-6 pa-md-10 overflow-hidden position-relative">
      <v-row class="align-center ga-y-6">
        <v-col cols="12" md="7">
          <v-chip size="small" color="primary" variant="tonal" prepend-icon="mdi-cellphone-check" class="font-weight-bold mb-3">
            Coming Soon in Parcella v2
          </v-chip>

          <h2 class="text-h4 font-weight-extrabold text-white mb-3">
            Track deliveries and confirm codes right from your phone.
          </h2>

          <p class="text-body-2 showcase-muted-text mb-6 lh-relaxed max-w-copy">
            We are building the Parcella mobile app for Android and iOS so senders and couriers can get instant
            push notifications, scan delivery codes, and withdraw earnings on the go.
          </p>

          <!-- Realistic Google Play & App Store Download Badges -->
          <div class="d-flex flex-wrap align-center ga-3">
            <button
              type="button"
              class="store-badge d-inline-flex align-center ga-3 px-4 py-2 rounded-lg text-left"
              @click="notifyComingSoon('Android')"
            >
              <v-icon icon="mdi-google-play" size="28" color="success" />
              <div>
                <span class="store-badge__sub d-block text-uppercase">Get it on</span>
                <span class="store-badge__title font-weight-bold">Google Play</span>
              </div>
            </button>

            <button
              type="button"
              class="store-badge d-inline-flex align-center ga-3 px-4 py-2 rounded-lg text-left"
              @click="notifyComingSoon('iOS')"
            >
              <v-icon icon="mdi-apple" size="28" color="white" />
              <div>
                <span class="store-badge__sub d-block text-uppercase">Download on the</span>
                <span class="store-badge__title font-weight-bold">App Store</span>
              </div>
            </button>
          </div>
        </v-col>

        <!-- Clean Mobile Phone Mockup Preview -->
        <v-col cols="12" md="5" class="d-flex justify-center">
          <div class="phone-mockup pa-4 rounded-xl w-100">
            <div class="phone-notch mx-auto mb-3" />
            <div class="d-flex align-center justify-space-between mb-3">
              <span class="text-caption font-weight-bold text-white">Parcella Mobile · v2</span>
              <StatusPill status="IN_TRANSIT" size="x-small" />
            </div>

            <div class="phone-card pa-3 rounded-lg mb-3">
              <div class="text-caption showcase-muted-text">Delivery to Bastos, Yaoundé</div>
              <div class="text-subtitle-1 font-mono font-weight-extrabold text-white my-1">15,000 XAF Held</div>
              <div class="d-flex align-center justify-space-between text-caption">
                <span class="text-success font-weight-bold">● Courier 1.2 km away</span>
                <span class="font-mono">Code: 849201</span>
              </div>
            </div>

            <div class="d-flex align-center justify-space-between text-caption showcase-muted-text px-1">
              <span>Android &amp; iOS</span>
              <span>Instant Mobile Money</span>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-sheet>
  </v-container>
</template>

<style scoped>
.max-w-landing {
  max-width: 1200px;
}

.max-w-copy {
  max-width: 540px;
}

.lh-relaxed {
  line-height: 1.55;
}

.mobile-teaser-card {
  background-color: var(--showcase-bg) !important;
  color: var(--showcase-fg) !important;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: var(--shadow-elevated);
}

.showcase-muted-text {
  color: var(--showcase-muted);
}

.store-badge {
  background-color: rgba(255, 255, 255, 0.08);
  border: 1.5px solid rgba(255, 255, 255, 0.22);
  color: rgb(255, 255, 255);
  cursor: pointer;
  min-width: 170px;
  transition: background-color var(--transition-fast), border-color var(--transition-fast), transform var(--transition-fast);
}

.store-badge:hover {
  background-color: rgba(255, 255, 255, 0.14);
  border-color: rgb(var(--v-theme-primary));
  transform: translateY(-1px);
}

.store-badge__sub {
  font-size: 10px;
  line-height: 1.1;
  opacity: 0.8;
}

.store-badge__title {
  font-size: 16px;
  line-height: 1.2;
}

.phone-mockup {
  max-width: 310px;
  background-color: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.16);
}

.phone-notch {
  width: 56px;
  height: 5px;
  border-radius: 9999px;
  background-color: rgba(255, 255, 255, 0.25);
}

.phone-card {
  background-color: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
}
</style>
