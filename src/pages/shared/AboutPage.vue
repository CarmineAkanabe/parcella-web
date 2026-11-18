<script setup lang="ts">
import { AppCard } from '@/components/common'
import AboutPillarsSection from '@/components/complex/marketing/AboutPillarsSection.vue'

const informalPainPoints = [
  'Buyers cancel or turn off their phones after the rider is already on the road.',
  'Unverified riders can disappear with your package or collected cash.',
  'No receipt, no tracking, and no support if a package gets lost.',
]

const parcellaStandards = [
  'The delivery fee is paid into escrow before the courier picks up the package.',
  '6-digit pickup and delivery codes prove who has the package at every step.',
  'The courier is paid immediately via Mobile Money as soon as the delivery code is confirmed.',
]

const coverageHubs = [
  {
    city: 'Douala',
    subtitle: 'Fast daily deliveries across main commercial and residential neighborhoods.',
    zones: ['Akwa & Bonanjo', 'Bonapriso & Deïdo', 'Makepe & Bonamoussadi'],
  },
  {
    city: 'Yaoundé',
    subtitle: 'Reliable coverage for shops, offices, and homes across the capital.',
    zones: ['Bastos & Centre-Ville', 'Mvan & Biyem-Assi', 'Omnisport & Odza'],
  },
]
</script>

<template>
  <div class="about-page">
    <!-- SECTION 1: Clean Story Hero with Inspection Photo -->
    <v-container class="py-8 py-md-12 px-4 px-md-8 max-w-about">
      <v-row class="align-center ga-y-8">
        <v-col cols="12" md="6" class="pr-md-6">
          <v-chip size="small" color="primary" variant="tonal" class="font-weight-bold mb-4">
            About Parcella
          </v-chip>

          <h1 class="about-headline font-weight-extrabold text-high-emphasis mb-4">
            Built to make package delivery <span class="text-primary">safe and simple</span> in Cameroon.
          </h1>

          <p class="text-body-1 text-medium-emphasis mb-4 lh-relaxed">
            Every day in <strong>Douala</strong> and <strong>Yaoundé</strong>, small shops and buyers send packages
            using informal riders. Too often, sellers lose goods to unverified riders, or couriers ride across town only for a buyer not to pay.
          </p>

          <p class="text-body-2 text-medium-emphasis mb-6 lh-relaxed">
            Parcella solves this with <strong>escrow</strong>: your money is held safely until the package reaches the receiver
            and they share their 6-digit delivery code.
          </p>

          <div class="d-flex flex-wrap align-center ga-3">
            <v-btn color="primary" variant="flat" prepend-icon="mdi-package-variant-closed" to="/register" class="font-weight-bold px-5">
              Get Started
            </v-btn>
            <v-btn
              variant="outlined"
              color="secondary"
              prepend-icon="mdi-github"
              href="https://github.com/CarmineAkanabe"
              target="_blank"
              rel="noopener noreferrer"
              class="font-weight-bold"
            >
              Built by CarmineAkanabe
            </v-btn>
          </div>
        </v-col>

        <v-col cols="12" md="6">
          <div class="about-photo-card rounded-xl overflow-hidden position-relative">
            <img
              src="/images/about-inspection-hub.png"
              alt="Parcella team checking a package in Douala"
              class="about-photo-img"
            />
            <div class="about-photo-caption px-4 py-2 text-caption d-flex align-center justify-space-between">
              <span>Safe package checks before dispatch</span>
              <span>Douala &amp; Yaoundé</span>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <!-- SECTION 2: Why Escrow Beats Informal Cash-on-Delivery -->
    <div class="section-stone py-10 py-md-12">
      <v-container class="px-4 px-md-8 max-w-about">
        <div class="mb-6">
          <div class="text-caption text-primary font-weight-bold text-uppercase mb-1">
            Why We Built It
          </div>
          <h2 class="text-h4 font-weight-extrabold text-high-emphasis mb-1">
            Informal Delivery vs. Parcella Escrow
          </h2>
          <p class="text-body-2 text-medium-emphasis mb-0">
            How holding the payment until drop-off protects both the sender and the driver.
          </p>
        </div>

        <v-row class="align-stretch">
          <v-col cols="12" md="6" class="d-flex">
            <AppCard class="w-100 comparison-card--risk">
              <v-chip size="x-small" color="error" variant="tonal" prepend-icon="mdi-alert-circle-outline" class="font-weight-bold mb-3">
                Without Escrow
              </v-chip>
              <h3 class="text-h6 font-weight-bold mb-3">The Problem with Informal Riders</h3>
              <div class="d-flex flex-column ga-3">
                <div v-for="item in informalPainPoints" :key="item" class="d-flex align-start ga-2 text-body-2">
                  <v-icon icon="mdi-close-circle-outline" color="error" size="18" class="mt-1 flex-shrink-0" />
                  <span>{{ item }}</span>
                </div>
              </div>
            </AppCard>
          </v-col>

          <v-col cols="12" md="6" class="d-flex">
            <AppCard class="w-100 comparison-card--standard">
              <v-chip size="x-small" color="success" variant="tonal" prepend-icon="mdi-shield-check-outline" class="font-weight-bold mb-3">
                With Parcella
              </v-chip>
              <h3 class="text-h6 font-weight-bold mb-3">Protected from Pickup to Drop-off</h3>
              <div class="d-flex flex-column ga-3">
                <div v-for="item in parcellaStandards" :key="item" class="d-flex align-start ga-2 text-body-2">
                  <v-icon icon="mdi-check-circle-outline" color="success" size="18" class="mt-1 flex-shrink-0" />
                  <span>{{ item }}</span>
                </div>
              </div>
            </AppCard>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <!-- SECTION 3: Three Simple Guarantees -->
    <AboutPillarsSection />

    <!-- SECTION 4: Where We Operate & Developer Credit -->
    <div class="section-stone py-10 py-md-12">
      <v-container class="px-4 px-md-8 max-w-about">
        <v-row class="mb-8">
          <v-col v-for="hub in coverageHubs" :key="hub.city" cols="12" md="6">
            <AppCard class="fill-height">
              <div class="d-flex align-center justify-space-between mb-2">
                <h3 class="text-h6 font-weight-bold">{{ hub.city }} Coverage</h3>
                <v-chip size="x-small" color="success" variant="tonal" class="font-weight-bold">Active</v-chip>
              </div>
              <p class="text-body-2 text-medium-emphasis mb-4">{{ hub.subtitle }}</p>
              <div class="d-flex flex-wrap ga-2">
                <v-chip v-for="zone in hub.zones" :key="zone" size="small" variant="tonal" color="secondary" prepend-icon="mdi-map-marker-outline">
                  {{ zone }}
                </v-chip>
              </div>
            </AppCard>
          </v-col>
        </v-row>

        <!-- Developer & Open Source Credit Card (GitHub Link) -->
        <v-sheet theme="dark" rounded="xl" class="dev-credit-banner pa-6 pa-md-8 d-flex flex-column flex-md-row align-md-center justify-space-between ga-4">
          <div class="d-flex align-center ga-4">
            <v-avatar color="primary" variant="flat" rounded="lg" size="52">
              <v-icon icon="mdi-github" size="28" />
            </v-avatar>
            <div>
              <div class="text-caption text-primary font-weight-bold text-uppercase">Developer &amp; Creator</div>
              <h3 class="text-h5 font-weight-bold text-white mb-1">Designed &amp; Engineered by Serge (CarmineAkanabe)</h3>
              <p class="text-body-2 showcase-muted-text mb-0">
                Explore the source code, architecture, and other projects on GitHub.
              </p>
            </div>
          </div>

          <v-btn
            color="surface"
            variant="flat"
            size="large"
            prepend-icon="mdi-github"
            append-icon="mdi-open-in-new"
            href="https://github.com/CarmineAkanabe"
            target="_blank"
            rel="noopener noreferrer"
            class="font-weight-bold text-high-emphasis flex-shrink-0"
          >
            github.com/CarmineAkanabe
          </v-btn>
        </v-sheet>
      </v-container>
    </div>
  </div>
</template>

<style scoped>
.max-w-about {
  max-width: 1200px;
}

.about-headline {
  font-size: clamp(1.9rem, 3.2vw, 2.75rem);
  line-height: 1.15;
  letter-spacing: -0.025em;
}

.lh-relaxed {
  line-height: 1.58;
}

.about-photo-card {
  height: 340px;
  border: 1px solid var(--border-subtle);
  box-shadow: var(--shadow-elevated);
}

.about-photo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.about-photo-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(15, 18, 22, 0.84);
  color: rgb(255, 255, 255);
}

.section-stone {
  background-color: rgba(var(--v-theme-surface-variant), 0.45);
  border-top: 1px solid var(--border-subtle);
  border-bottom: 1px solid var(--border-subtle);
}

.comparison-card--risk {
  border-top: 3px solid rgb(var(--v-theme-error)) !important;
}

.comparison-card--standard {
  border-top: 3px solid rgb(var(--v-theme-success)) !important;
}

.dev-credit-banner {
  background-color: var(--showcase-bg) !important;
  color: var(--showcase-fg) !important;
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.showcase-muted-text {
  color: var(--showcase-muted);
}
</style>
