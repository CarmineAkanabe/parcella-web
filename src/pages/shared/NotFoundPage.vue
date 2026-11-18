<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/shared/stores/auth'
import { AppCard } from '@/components/common'

const route = useRoute()
const authStore = useAuthStore()

const requestedPath = computed(() => route.fullPath)
const destinationRoute = computed(() =>
  authStore.isAuthenticated ? authStore.homeRoute : '/',
)
const destinationLabel = computed(() =>
  authStore.isAuthenticated ? 'Return to Dashboard' : 'Return to Home',
)
</script>

<template>
  <AppCard :padded="false">
    <div class="manifest-topbar px-5 py-3 d-flex align-center justify-space-between">
      <v-chip size="x-small" color="primary" variant="flat" class="font-mono font-weight-bold">
        404 · PAGE NOT FOUND
      </v-chip>
      <span class="text-caption text-medium-emphasis">Your account &amp; escrow funds are safe</span>
    </div>

    <div class="pa-6 pa-md-8">
      <v-row class="align-center ga-y-6">
        <v-col cols="12" md="7" class="pr-md-6">
          <h1 class="text-h4 font-weight-extrabold text-high-emphasis mb-3 lh-tight">
            We couldn't find that page.
          </h1>

          <p class="text-body-2 text-medium-emphasis mb-5 lh-relaxed">
            The link you clicked or the address you typed doesn't exist on Parcella.
            Check the address below or head back home.
          </p>

          <div class="route-box pa-3 rounded-lg mb-6 d-flex align-center justify-space-between ga-2">
            <span class="text-caption text-medium-emphasis font-weight-semibold">Address:</span>
            <span class="font-mono text-body-2 font-weight-bold text-primary text-truncate">{{ requestedPath }}</span>
          </div>

          <div class="d-flex flex-wrap align-center ga-3">
            <v-btn
              color="primary"
              variant="flat"
              size="large"
              prepend-icon="mdi-home-outline"
              :to="destinationRoute"
              class="font-weight-bold px-6"
            >
              {{ destinationLabel }}
            </v-btn>
            <v-btn
              variant="outlined"
              color="secondary"
              size="large"
              prepend-icon="mdi-arrow-left"
              class="font-weight-bold"
              @click="$router.back()"
            >
              Go Back
            </v-btn>
          </div>
        </v-col>

        <v-col cols="12" md="5">
          <div class="crate-photo-frame rounded-xl overflow-hidden position-relative">
            <img
              src="/images/error-sealed-crate.png"
              alt="Sealed Parcella package crate"
              class="crate-photo-img"
            />
          </div>
        </v-col>
      </v-row>
    </div>
  </AppCard>
</template>

<style scoped>
.manifest-topbar {
  background-color: rgba(var(--v-theme-surface-variant), 0.55);
  border-bottom: 1px solid var(--border-subtle);
}

.lh-tight {
  line-height: 1.18;
}

.lh-relaxed {
  line-height: 1.55;
}

.route-box {
  background-color: rgba(var(--v-theme-surface-variant), 0.55);
  border: 1px solid var(--border-subtle);
}

.crate-photo-frame {
  height: 210px;
  border: 1px solid var(--border-subtle);
}

.crate-photo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
