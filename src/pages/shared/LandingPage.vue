<script setup lang="ts">
import { AppCard } from '@/components/common'
import LandingHeroSection from '@/components/complex/marketing/LandingHeroSection.vue'
import LandingDualValueSection from '@/components/complex/marketing/LandingDualValueSection.vue'
import LandingMobileAppBanner from '@/components/complex/marketing/LandingMobileAppBanner.vue'

const escrowSteps = [
  {
    step: 'Step 1',
    icon: 'mdi-cash-lock',
    title: 'Book & Pay into Escrow',
    detail: 'Pick your pickup and drop-off spots on the map and pay with Mobile Money. Parcella holds the money safely.',
  },
  {
    step: 'Step 2',
    icon: 'mdi-qrcode-scan',
    title: 'Share the Pickup Code',
    detail: 'When your verified courier arrives, give them your 6-digit pickup code so the app knows they have your package.',
  },
  {
    step: 'Step 3',
    icon: 'mdi-check-decagram-outline',
    title: 'Confirm Drop-off & Release Pay',
    detail: 'Your receiver checks the package and gives the 6-digit delivery code. The courier gets paid right away.',
  },
]
</script>

<template>
  <div class="landing-page">
    <!-- SECTION 1: Hero with Real Photography & Sample Delivery Card -->
    <LandingHeroSection />

    <!-- SECTION 2: Simple 3-Step How It Works -->
    <div class="section-stone py-10 py-md-12">
      <v-container class="px-4 px-md-8 max-w-landing">
        <div class="mb-6">
          <div class="text-caption text-primary font-weight-bold text-uppercase mb-1">
            Simple 3-Step Delivery
          </div>
          <h2 class="text-h4 font-weight-extrabold text-high-emphasis mb-1">
            How Parcella Works
          </h2>
          <p class="text-body-2 text-medium-emphasis mb-0">
            No complicated paperwork — just three clear steps from pickup to payment.
          </p>
        </div>

        <v-row>
          <v-col v-for="item in escrowSteps" :key="item.step" cols="12" md="4">
            <AppCard class="fill-height">
              <div class="d-flex align-center justify-space-between mb-3">
                <v-chip size="x-small" color="primary" variant="tonal" class="font-weight-bold">
                  {{ item.step }}
                </v-chip>
                <v-icon :icon="item.icon" color="primary" size="22" />
              </div>
              <h3 class="text-subtitle-1 font-weight-bold mb-2">{{ item.title }}</h3>
              <p class="text-body-2 text-medium-emphasis lh-relaxed mb-0">{{ item.detail }}</p>
            </AppCard>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <!-- SECTION 3: Senders vs Couriers -->
    <LandingDualValueSection />

    <!-- SECTION 4: Android & iOS Mobile App Download Section (v2 Preview) -->
    <LandingMobileAppBanner />
  </div>
</template>

<style scoped>
.max-w-landing {
  max-width: 1200px;
}

.lh-relaxed {
  line-height: 1.55;
}

.section-stone {
  background-color: rgba(var(--v-theme-surface-variant), 0.5);
  border-top: 1px solid var(--border-subtle);
  border-bottom: 1px solid var(--border-subtle);
}
</style>
