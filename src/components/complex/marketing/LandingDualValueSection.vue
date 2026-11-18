<script setup lang="ts">
const senderHighlights = [
  {
    title: 'Your Money Stays Safe',
    detail: 'Your payment is held in escrow until your package reaches the receiver.',
  },
  {
    title: 'Clear Step-by-Step Tracking',
    detail: 'Follow your package from pickup to drop-off across Douala and Yaoundé.',
  },
  {
    title: 'Fair Dispute Support',
    detail: 'If something goes wrong, our support team steps in to refund you or settle fairly.',
  },
]

const courierHighlights = [
  {
    title: 'Fast Mobile Money Payouts',
    detail: 'Money goes straight to your wallet as soon as the receiver gives you the delivery code.',
  },
  {
    title: 'Deliver with Your Vehicle',
    detail: 'Take nearby orders by bike, motorbike, car, or van.',
  },
]
</script>

<template>
  <v-container class="py-10 py-md-12 px-4 px-md-8 max-w-landing">
    <v-row class="align-stretch">
      <!-- Left Card: For Senders & Shops -->
      <v-col cols="12" md="6" class="d-flex">
        <v-sheet rounded="xl" class="merchant-panel pa-6 pa-md-8 w-100 d-flex flex-column justify-space-between">
          <div>
            <v-chip size="small" color="primary" variant="tonal" prepend-icon="mdi-storefront-outline" class="font-weight-bold mb-4">
              For Senders &amp; Online Shops
            </v-chip>
            <h2 class="text-h4 font-weight-extrabold text-high-emphasis mb-3">
              Send packages without worrying about lost money.
            </h2>
            <p class="text-body-2 text-medium-emphasis mb-6 lh-relaxed">
              No more riders disappearing with your goods or buyers refusing to pay at the door.
              The delivery fee is locked in escrow before your package leaves.
            </p>

            <div class="d-flex flex-column ga-4 mb-6">
              <div v-for="point in senderHighlights" :key="point.title" class="d-flex align-start ga-3">
                <v-icon icon="mdi-check-circle" color="primary" size="20" class="mt-1 flex-shrink-0" />
                <div>
                  <div class="text-subtitle-2 font-weight-bold">{{ point.title }}</div>
                  <div class="text-caption text-medium-emphasis lh-relaxed">{{ point.detail }}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="d-flex flex-wrap align-center justify-space-between ga-3 pt-4 border-t-subtle">
            <span class="text-caption text-medium-emphasis">Protected by 6-digit pickup &amp; drop-off codes</span>
            <v-btn color="primary" variant="flat" append-icon="mdi-arrow-right" to="/register" class="font-weight-bold px-5">
              Send a Package
            </v-btn>
          </div>
        </v-sheet>
      </v-col>

      <!-- Right Card: For Couriers & Drivers -->
      <v-col cols="12" md="6" class="d-flex">
        <v-sheet theme="dark" rounded="xl" class="courier-dark-panel pa-6 pa-md-8 w-100 d-flex flex-column justify-space-between">
          <div>
            <v-chip size="small" color="secondary" variant="tonal" prepend-icon="mdi-truck-fast-outline" class="font-weight-bold mb-4">
              For Couriers &amp; Drivers
            </v-chip>
            <h2 class="text-h4 font-weight-extrabold text-white mb-3">
              Know your payment is ready before you start driving.
            </h2>
            <p class="text-body-2 showcase-muted-text mb-5 lh-relaxed">
              No more unpaid trips. You see the exact XAF payout waiting in escrow before you accept a delivery.
            </p>

            <div class="fleet-photo-banner rounded-lg overflow-hidden position-relative mb-5">
              <img
                src="/images/fleet-hub-yaounde.png"
                alt="Parcella courier motorbike and delivery van at Yaoundé hub"
                class="fleet-photo-img"
              />
              <div class="fleet-photo-caption px-3 py-2 d-flex align-center justify-space-between text-caption">
                <span>Yaoundé &amp; Douala Courier Fleet</span>
                <v-chip size="x-small" color="success" variant="flat" class="font-weight-bold">Verified Riders</v-chip>
              </div>
            </div>

            <div class="d-flex flex-column ga-3 mb-6">
              <div v-for="point in courierHighlights" :key="point.title" class="d-flex align-start ga-3">
                <v-icon icon="mdi-shield-check" color="success" size="20" class="mt-1 flex-shrink-0" />
                <div>
                  <div class="text-subtitle-2 font-weight-bold text-white">{{ point.title }}</div>
                  <div class="text-caption showcase-muted-text lh-relaxed">{{ point.detail }}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="d-flex flex-wrap align-center justify-space-between ga-3 pt-4 showcase-footer">
            <span class="text-caption showcase-muted-text">Instant Mobile Money withdrawals</span>
            <v-btn color="surface" variant="flat" append-icon="mdi-motorbike" to="/register" class="font-weight-bold px-5 text-high-emphasis">
              Join as a Driver
            </v-btn>
          </div>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.max-w-landing {
  max-width: 1200px;
}

.lh-relaxed {
  line-height: 1.55;
}

.border-t-subtle {
  border-top: 1px solid var(--border-subtle);
}

.merchant-panel {
  background-color: rgb(var(--v-theme-surface));
  border: 1px solid var(--border-subtle);
  box-shadow: var(--shadow-card);
}

.courier-dark-panel {
  background-color: var(--showcase-bg) !important;
  color: var(--showcase-fg) !important;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: var(--shadow-elevated);
}

.showcase-muted-text {
  color: var(--showcase-muted);
}

.showcase-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.12);
}

.fleet-photo-banner {
  height: 190px;
  border: 1px solid rgba(255, 255, 255, 0.14);
}

.fleet-photo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.fleet-photo-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(15, 18, 22, 0.84);
  backdrop-filter: blur(4px);
}
</style>
