<script setup lang="ts">
import { AppLogo } from '@/components/common'
</script>

<template>
  <footer class="footer-shell px-4 px-md-8 py-8">
    <div class="max-w-footer mx-auto">
      <v-row class="pb-6">
        <v-col cols="12" md="5" class="d-flex flex-column ga-3">
          <RouterLink to="/" class="text-decoration-none d-inline-flex">
            <AppLogo size="md" subtitle="CEMAC Escrow Logistics Platform" />
          </RouterLink>
          <p class="text-body-2 text-medium-emphasis mb-0 max-w-desc">
            Decentralized cash-on-delivery protection and 2-step cryptographic handover verification for
            merchants, urban buyers, and verified couriers across Douala and Yaoundé.
          </p>
          <div class="d-flex flex-wrap align-center ga-2 pt-1">
            <v-chip size="x-small" color="success" variant="tonal" prepend-icon="mdi-shield-lock-outline" class="font-mono font-weight-bold">
              CEMAC REGULATED CUSTODY
            </v-chip>
            <v-chip size="x-small" color="secondary" variant="tonal" class="font-mono">
              +237 GATEWAY
            </v-chip>
          </div>
        </v-col>

        <v-col cols="6" sm="4" md="2">
          <div class="text-caption font-weight-bold text-uppercase text-high-emphasis mb-3">
            Platform
          </div>
          <div class="d-flex flex-column ga-2 text-body-2">
            <RouterLink to="/" class="footer-link text-decoration-none">Home &amp; Rates</RouterLink>
            <RouterLink to="/about" class="footer-link text-decoration-none">About &amp; Provisions</RouterLink>
            <RouterLink to="/register" class="footer-link text-decoration-none">Send a Package</RouterLink>
            <RouterLink to="/register" class="footer-link text-decoration-none">Become a Courier</RouterLink>
          </div>
        </v-col>

        <v-col cols="6" sm="4" md="3">
          <div class="text-caption font-weight-bold text-uppercase text-high-emphasis mb-3">
            Logistics Corridors
          </div>
          <div class="d-flex flex-column ga-2 text-body-2 text-medium-emphasis">
            <span>Douala Maritime Hub (Akwa / Bonanjo)</span>
            <span>Yaoundé Centre Hub (Bastos / Mvan)</span>
            <span>Douala – Yaoundé Intercity VIP Trunk</span>
            <span>5km PostGIS Proximity Dispatch</span>
          </div>
        </v-col>

        <v-col cols="12" sm="4" md="2">
          <div class="text-caption font-weight-bold text-uppercase text-high-emphasis mb-3">
            Operator Access
          </div>
          <div class="d-flex flex-column ga-2 text-body-2">
            <RouterLink to="/login" class="footer-link text-decoration-none">Operator Sign In</RouterLink>
            <RouterLink to="/register" class="footer-link text-decoration-none">Create Account</RouterLink>
            <RouterLink to="/profile" class="footer-link text-decoration-none">Account &amp; Profile</RouterLink>
          </div>
        </v-col>
      </v-row>

      <!-- Simple Escrow Note & GitHub Credit -->
      <div class="safeguard-clause pa-3 rounded-lg mb-5 d-flex flex-column flex-md-row align-md-center justify-space-between ga-3">
        <div class="text-caption text-medium-emphasis">
          <strong class="text-high-emphasis">100% Escrow Protected:</strong>
          Delivery payments in <span class="font-mono">XAF</span> stay safely locked until the 6-digit pickup and delivery codes are confirmed.
        </div>
        <a
          href="https://github.com/CarmineAkanabe"
          target="_blank"
          rel="noopener noreferrer"
          class="footer-link text-caption font-weight-bold text-decoration-none d-inline-flex align-center ga-1 whitespace-nowrap"
        >
          <v-icon icon="mdi-github" size="16" />
          <span>github.com/CarmineAkanabe</span>
        </a>
      </div>

      <div class="d-flex flex-column flex-sm-row align-sm-center justify-space-between ga-2 text-caption text-medium-emphasis pt-2 footer-bottom">
        <div>
          © 2026 Parcella Escrow Logistics Cameroon (Douala &amp; Yaoundé). All rights reserved.
        </div>
        <div class="d-flex flex-wrap align-center ga-3 font-mono">
          <RouterLink to="/about" class="footer-link text-decoration-none">Security &amp; Escrow Terms</RouterLink>
          <span>·</span>
          <RouterLink to="/about" class="footer-link text-decoration-none">Carrier Standards</RouterLink>
          <span>·</span>
          <RouterLink to="/about" class="footer-link text-decoration-none">Dispute Resolution</RouterLink>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer-shell {
  background-color: rgb(var(--v-theme-surface));
  border-top: 1px solid var(--border-subtle);
}

.max-w-footer {
  max-width: 1240px;
}

.max-w-desc {
  max-width: 420px;
  line-height: 1.55;
}

.whitespace-nowrap {
  white-space: nowrap;
}

.safeguard-clause {
  background-color: rgba(var(--v-theme-surface-variant), 0.55);
  border: 1px solid var(--border-subtle);
}

.footer-bottom {
  border-top: 1px solid var(--border-subtle);
}

.footer-link {
  color: rgb(var(--v-theme-on-surface-variant));
  transition: color var(--transition-fast);
}

.footer-link:hover {
  color: rgb(var(--v-theme-primary));
}
</style>
