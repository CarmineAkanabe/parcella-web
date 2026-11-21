<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { AppCard, EmptyState, ErrorBanner, PageHeader } from '@/components/common'
import DriverAvailabilityCard from '@/components/complex/driver/DriverAvailabilityCard.vue'
import DriverVerificationCard from '@/components/complex/driver/DriverVerificationCard.vue'
import VehicleFormDialog from '@/components/complex/driver/VehicleFormDialog.vue'
import { activateVehicleApi, listMyVehiclesApi, type Vehicle } from '@/features/driver'
import { useToast } from '@/shared/composables/useToast'

const toast = useToast()

const vehicles = ref<Vehicle[]>([])
const isLoading = ref(true)
const loadError = ref<unknown>(null)

const showVehicleDialog = ref(false)
const editingVehicle = ref<Vehicle | null>(null)
const activatingId = ref<string | null>(null)

async function fetchVehicles(): Promise<void> {
  isLoading.value = true
  loadError.value = null
  try {
    vehicles.value = await listMyVehiclesApi()
  } catch (err: unknown) {
    loadError.value = err
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchVehicles()
})

function openCreateDialog(): void {
  editingVehicle.value = null
  showVehicleDialog.value = true
}

function openEditDialog(vehicle: Vehicle): void {
  editingVehicle.value = vehicle
  showVehicleDialog.value = true
}

async function handleActivate(vehicle: Vehicle): Promise<void> {
  activatingId.value = vehicle.id
  try {
    const updated = await activateVehicleApi(vehicle.id)
    vehicles.value = vehicles.value.map((v) => ({
      ...v,
      active: v.id === updated.id,
    }))
    toast.success(`${vehicle.plateNumber} is now your active dispatch vehicle.`)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Could not activate vehicle'
    toast.error(msg)
  } finally {
    activatingId.value = null
  }
}

function handleVehicleSaved(saved: Vehicle): void {
  const index = vehicles.value.findIndex((v) => v.id === saved.id)
  if (index >= 0) {
    vehicles.value[index] = saved
  } else {
    vehicles.value.push(saved)
  }
  // Re-fetch to ensure active flag states match server
  fetchVehicles()
}

function getVehicleIcon(type: string): string {
  switch (type) {
    case 'BIKE':
      return 'mdi-bicycle'
    case 'MOTORBIKE':
      return 'mdi-motorbike'
    case 'CAR':
      return 'mdi-car-side'
    case 'VAN':
      return 'mdi-van-utility'
    default:
      return 'mdi-car'
  }
}
</script>

<template>
  <div>
    <PageHeader
      eyebrow="Fleet &amp; Compliance"
      title="Vehicles &amp; Dispatch Setup"
      subtitle="Register delivery vehicles, toggle spatial availability, and maintain verification documents."
    />

    <!-- Top Row: Verification Status & Availability Controls -->
    <v-row class="mt-2" dense>
      <v-col cols="12" md="6">
        <DriverVerificationCard />
      </v-col>
      <v-col cols="12" md="6">
        <DriverAvailabilityCard />
      </v-col>
    </v-row>

    <!-- Bottom Card: Registered Vehicles List -->
    <AppCard class="mt-4" title="Registered Fleet Vehicles" subtitle="Only one verified vehicle may be marked active for spatial matching at a time.">
      <template #actions>
        <v-btn
          color="primary"
          variant="flat"
          size="small"
          prepend-icon="mdi-plus"
          @click="openCreateDialog"
        >
          Add Vehicle
        </v-btn>
      </template>

      <!-- Loading State -->
      <div v-if="isLoading" class="py-8 text-center">
        <v-progress-circular indeterminate color="primary" />
        <div class="text-caption text-medium-emphasis mt-2">Loading registered fleet...</div>
      </div>

      <!-- Error State -->
      <ErrorBanner
        v-else-if="loadError"
        title="Could not load fleet vehicles"
        :error="loadError"
        @retry="fetchVehicles"
      />

      <!-- Empty State -->
      <EmptyState
        v-else-if="vehicles.length === 0"
        icon="mdi-car-cog"
        title="No vehicles registered"
        description="Register your bicycle, motorbike, car, or van to receive nearby parcel deliveries."
        action-label="Register First Vehicle"
        @action="openCreateDialog"
      />

      <!-- Populated Vehicles List -->
      <div v-else class="d-flex flex-column ga-3">
        <div
          v-for="v in vehicles"
          :key="v.id"
          class="vehicle-row pa-4 rounded-lg d-flex flex-wrap align-center justify-space-between ga-3"
          :class="{ 'vehicle-row--active': v.active }"
        >
          <div class="d-flex align-center ga-3 min-w-0">
            <v-avatar
              size="44"
              rounded="lg"
              :color="v.active ? 'primary' : 'surface-variant'"
              class="flex-shrink-0"
            >
              <v-icon :icon="getVehicleIcon(v.type)" size="24" :color="v.active ? 'on-primary' : 'secondary'" />
            </v-avatar>

            <div class="overflow-hidden">
              <div class="d-flex align-center ga-2 flex-wrap">
                <span class="text-subtitle-2 font-weight-bold font-mono">{{ v.plateNumber }}</span>
                <v-chip v-if="v.active" size="x-small" color="success" variant="flat" class="font-weight-bold">
                  ACTIVE DISPATCH
                </v-chip>
                <v-chip size="x-small" variant="outlined" class="font-mono">
                  {{ v.type }}
                </v-chip>
                <v-chip size="x-small" variant="tonal" color="secondary">
                  Max: {{ v.maxPackageSize }}
                </v-chip>
              </div>
              <span class="text-caption text-medium-emphasis d-block mt-0-5">
                {{ v.active ? 'Currently receiving spatial proximity matching' : 'Standby vehicle' }}
              </span>
            </div>
          </div>

          <div class="d-flex align-center ga-2 flex-shrink-0">
            <v-btn
              v-if="!v.active"
              variant="tonal"
              color="primary"
              size="small"
              prepend-icon="mdi-check-circle-outline"
              :loading="activatingId === v.id"
              :disabled="Boolean(activatingId)"
              @click="handleActivate(v)"
            >
              Make Active
            </v-btn>
            <v-btn
              variant="outlined"
              color="secondary"
              size="small"
              icon="mdi-pencil-outline"
              aria-label="Edit vehicle details"
              @click="openEditDialog(v)"
            />
          </div>
        </div>
      </div>
    </AppCard>

    <!-- Add / Edit Dialog -->
    <VehicleFormDialog
      v-model="showVehicleDialog"
      :vehicle="editingVehicle"
      @saved="handleVehicleSaved"
    />
  </div>
</template>

<style scoped>
.vehicle-row {
  background-color: rgba(var(--v-theme-surface-variant), 0.35);
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  transition: all var(--transition-fast);
}

.vehicle-row--active {
  border-color: rgba(var(--v-theme-primary), 0.5);
  background-color: rgba(var(--v-theme-primary), 0.05);
}

.mt-0-5 {
  margin-top: 2px;
}
</style>
