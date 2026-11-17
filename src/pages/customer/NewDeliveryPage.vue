<script setup lang="ts">
import { formatXaf, formatDistance } from '@/shared/utils'
import { PageHeader, AppCard, StatusPill } from '@/components/common'
</script>

<template>
  <div>
    <PageHeader
      eyebrow="Escrow Booking"
      title="New Delivery Request"
      subtitle="Specify pickup and destination coordinates, package size, and recipient contact."
      back-to="/customer/deliveries"
    >
      <template #status>
        <StatusPill status="REQUESTED" />
      </template>
    </PageHeader>

    <v-row class="mt-2">
      <v-col cols="12" md="8">
        <AppCard
          eyebrow="Step 1 · Package &amp; Route"
          title="Waybill Specification"
          subtitle="Interactive Leaflet + Nominatim map picker activates in Slice F3."
        >
          <div class="d-flex flex-column ga-3">
            <v-text-field
              label="Package Description"
              placeholder="Electronics crate — fragile"
              prepend-inner-icon="mdi-package-variant"
            />
            <v-select
              label="Package Size Tier"
              :items="['SMALL', 'MEDIUM', 'LARGE']"
              model-value="MEDIUM"
              prepend-inner-icon="mdi-cube-outline"
            />
          </div>
        </AppCard>
      </v-col>

      <v-col cols="12" md="4">
        <AppCard
          eyebrow="ESCROW QUOTE PREVIEW"
          title="Estimated Settlement"
          subtitle="Calculated from PostGIS route distance and size tier."
        >
          <div class="d-flex flex-column ga-2 font-mono text-body-2">
            <div class="d-flex justify-space-between">
              <span class="text-medium-emphasis">EST. DISTANCE</span>
              <span>{{ formatDistance(4200) }}</span>
            </div>
            <div class="d-flex justify-space-between">
              <span class="text-medium-emphasis">ESCROW LOCK</span>
              <span class="font-weight-bold text-primary">{{ formatXaf(2500) }}</span>
            </div>
          </div>
        </AppCard>
      </v-col>
    </v-row>
  </div>
</template>
