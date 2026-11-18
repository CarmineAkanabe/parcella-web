<script setup lang="ts">
import { AppCard, StatusPill } from '@/components/common'

const fleetModalities = [
  {
    icon: 'mdi-motorbike',
    title: 'Bikes & Motorbikes',
    corridor: 'Fast City Deliveries',
    detail: 'Quick trips through busy Douala and Yaoundé streets for small parcels, documents, and food.',
  },
  {
    icon: 'mdi-car-estate',
    title: 'Cars',
    corridor: 'Medium & Fragile Packages',
    detail: 'Safe, weather-protected rides for electronics, clothes, and multi-item shop orders.',
  },
  {
    icon: 'mdi-van-utility',
    title: 'Vans',
    corridor: 'Large Boxes & Wholesale',
    detail: 'Extra space for heavy crates, bulk store stock, and business deliveries.',
  },
]
</script>

<template>
  <v-container class="py-10 py-md-12 px-4 px-md-8 max-w-about">
    <div class="text-center max-w-sub mx-auto mb-8">
      <div class="text-caption text-primary font-weight-bold text-uppercase mb-1">
        What Parcella Provides
      </div>
      <h2 class="text-h4 font-weight-extrabold text-high-emphasis mb-2">
        Three Simple Guarantees
      </h2>
      <p class="text-body-2 text-medium-emphasis mb-0">
        Built around Mobile Money, ID-checked couriers, and fair support when something goes wrong.
      </p>
    </div>

    <div class="d-flex flex-column ga-6">
      <!-- Pillar 1: Mobile Money Escrow -->
      <AppCard>
        <v-row class="align-center">
          <v-col cols="12" md="7">
            <v-chip size="x-small" color="primary" variant="tonal" class="font-weight-bold mb-3">
              1 · Safe Payments
            </v-chip>
            <h3 class="text-h5 font-weight-bold mb-2">Mobile Money Escrow</h3>
            <p class="text-body-2 text-medium-emphasis mb-4 lh-relaxed">
              When you book a delivery, your payment is held safely by Parcella instead of going straight
              to a stranger's pocket. Once the package is delivered and the 6-digit code is confirmed, the courier is paid automatically.
            </p>
            <div class="d-flex flex-wrap ga-3">
              <div class="mini-spec-box px-3 py-2 rounded">
                <span class="text-caption text-medium-emphasis d-block">Currency</span>
                <span class="font-mono text-body-2 font-weight-bold">XAF (FCFA)</span>
              </div>
              <div class="mini-spec-box px-3 py-2 rounded">
                <span class="text-caption text-medium-emphasis d-block">Works With</span>
                <span class="text-body-2 font-weight-bold">Mobile Money (+237)</span>
              </div>
              <div class="mini-spec-box px-3 py-2 rounded">
                <span class="text-caption text-medium-emphasis d-block">Released By</span>
                <span class="text-body-2 font-weight-bold text-success">6-Digit Delivery Code</span>
              </div>
            </div>
          </v-col>
          <v-col cols="12" md="5">
            <div class="state-machine-box pa-4 rounded-lg d-flex flex-column ga-2 text-caption">
              <div class="d-flex justify-space-between align-center pb-2 border-b-subtle">
                <span class="font-weight-bold text-primary">How Your Money Moves</span>
                <span class="font-mono font-weight-bold">25,000 XAF</span>
              </div>
              <div class="d-flex justify-space-between align-center py-1">
                <span>1. Paid into Escrow</span>
                <StatusPill status="HELD" size="x-small" />
              </div>
              <div class="d-flex justify-space-between align-center py-1">
                <span>2. Pickup Code Shared</span>
                <StatusPill status="IN_TRANSIT" size="x-small" />
              </div>
              <div class="d-flex justify-space-between align-center py-1">
                <span>3. Delivery Code Shared</span>
                <StatusPill status="RELEASED" size="x-small" />
              </div>
            </div>
          </v-col>
        </v-row>
      </AppCard>

      <!-- Pillar 2: Verified Couriers & Vehicles -->
      <AppCard>
        <v-row class="align-center">
          <v-col cols="12" md="5">
            <div class="pillar-photo-wrap rounded-lg overflow-hidden">
              <img
                src="/images/fleet-hub-yaounde.png"
                alt="Parcella courier motorbike and delivery van"
                class="pillar-photo-img"
              />
            </div>
          </v-col>
          <v-col cols="12" md="7">
            <v-chip size="x-small" color="primary" variant="tonal" class="font-weight-bold mb-3">
              2 · Verified Couriers
            </v-chip>
            <h3 class="text-h5 font-weight-bold mb-2">ID-Checked Drivers &amp; Right-Sized Vehicles</h3>
            <p class="text-body-2 text-medium-emphasis mb-4 lh-relaxed">
              Every driver uploads their license for admin review before they can accept deliveries.
              Pick the vehicle that fits your package size.
            </p>
            <div class="d-flex flex-column ga-2">
              <div v-for="mod in fleetModalities" :key="mod.title" class="mini-spec-box pa-3 rounded-lg d-flex align-start ga-3">
                <v-icon :icon="mod.icon" color="primary" size="20" class="mt-1" />
                <div class="flex-grow-1">
                  <div class="d-flex flex-wrap align-center justify-space-between ga-2">
                    <span class="text-body-2 font-weight-bold">{{ mod.title }}</span>
                    <span class="text-caption text-primary font-weight-semibold">{{ mod.corridor }}</span>
                  </div>
                  <div class="text-caption text-medium-emphasis">{{ mod.detail }}</div>
                </div>
              </div>
            </div>
          </v-col>
        </v-row>
      </AppCard>

      <!-- Pillar 3: Fair Dispute Resolution -->
      <AppCard>
        <v-row class="align-center">
          <v-col cols="12" md="7">
            <v-chip size="x-small" color="primary" variant="tonal" class="font-weight-bold mb-3">
              3 · Dispute Support
            </v-chip>
            <h3 class="text-h5 font-weight-bold mb-2">Fair Help When Something Goes Wrong</h3>
            <p class="text-body-2 text-medium-emphasis mb-4 lh-relaxed">
              If a package arrives damaged or a delivery cannot be completed, either side can open a dispute.
              The money stays paused in escrow while an admin reviews the delivery history and either refunds the sender or pays the courier.
            </p>
          </v-col>
          <v-col cols="12" md="5">
            <div class="pillar-photo-wrap rounded-lg overflow-hidden">
              <img
                src="/images/hero-courier-douala.png"
                alt="Verified Parcella courier in Douala"
                class="pillar-photo-img"
              />
            </div>
          </v-col>
        </v-row>
      </AppCard>
    </div>
  </v-container>
</template>

<style scoped>
.max-w-about {
  max-width: 1200px;
}

.max-w-sub {
  max-width: 580px;
}

.lh-relaxed {
  line-height: 1.58;
}

.pillar-photo-wrap {
  height: 220px;
  border: 1px solid var(--border-subtle);
}

.pillar-photo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
}

.mini-spec-box,
.state-machine-box {
  background-color: rgba(var(--v-theme-surface-variant), 0.55);
  border: 1px solid var(--border-subtle);
}

.border-b-subtle {
  border-bottom: 1px solid var(--border-subtle);
}
</style>
