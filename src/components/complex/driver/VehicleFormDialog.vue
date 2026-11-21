<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ErrorBanner } from '@/components/common'
import {
  createVehicleApi,
  updateVehicleApi,
  vehicleSchema,
  type PackageSize,
  type Vehicle,
  type VehicleType,
} from '@/features/driver'
import { useFormErrors } from '@/shared/composables/useFormErrors'
import { useToast } from '@/shared/composables/useToast'

interface Props {
  modelValue: boolean
  vehicle?: Vehicle | null
}

const props = withDefaults(defineProps<Props>(), {
  vehicle: null,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  saved: [vehicle: Vehicle]
}>()

const toast = useToast()

const isEdit = computed(() => Boolean(props.vehicle))
const isSubmitting = ref(false)

const vehicleType = ref<VehicleType>('MOTORBIKE')
const plateNumber = ref('')
const maxPackageSize = ref<PackageSize>('MEDIUM')

const {
  formError,
  validate,
  setServerErrors,
  firstError,
  clearField,
  clearAll,
} = useFormErrors(vehicleSchema)

const vehicleTypes: { value: VehicleType; label: string; icon: string }[] = [
  { value: 'BIKE', label: 'Bicycle', icon: 'mdi-bicycle' },
  { value: 'MOTORBIKE', label: 'Motorbike', icon: 'mdi-motorbike' },
  { value: 'CAR', label: 'Car / Sedan', icon: 'mdi-car-side' },
  { value: 'VAN', label: 'Van / Pickup', icon: 'mdi-van-utility' },
]

const packageSizes: { value: PackageSize; label: string; desc: string }[] = [
  { value: 'SMALL', label: 'Small', desc: 'Envelopes & small parcels (< 5 kg)' },
  { value: 'MEDIUM', label: 'Medium', desc: 'Standard boxes (< 15 kg)' },
  { value: 'LARGE', label: 'Large', desc: 'Bulky cargo & appliances (< 50 kg)' },
]

function resetForm(): void {
  if (props.vehicle) {
    vehicleType.value = props.vehicle.type
    plateNumber.value = props.vehicle.plateNumber
    maxPackageSize.value = props.vehicle.maxPackageSize
  } else {
    vehicleType.value = 'MOTORBIKE'
    plateNumber.value = ''
    maxPackageSize.value = 'MEDIUM'
  }
  clearAll()
}

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      resetForm()
    }
  },
  { immediate: true },
)

watch(
  () => props.vehicle,
  () => {
    if (props.modelValue) {
      resetForm()
    }
  },
)

async function handleSubmit(): Promise<void> {
  const payload = {
    type: vehicleType.value,
    plateNumber: plateNumber.value.trim().toUpperCase(),
    maxPackageSize: maxPackageSize.value,
  }

  if (!validate(payload)) {
    return
  }

  isSubmitting.value = true
  try {
    let saved: Vehicle
    if (isEdit.value && props.vehicle) {
      saved = await updateVehicleApi(props.vehicle.id, payload)
      toast.success('Vehicle details updated successfully.')
    } else {
      saved = await createVehicleApi(payload)
      toast.success('Vehicle registered and added to your fleet.')
    }
    emit('saved', saved)
    emit('update:modelValue', false)
  } catch (err: unknown) {
    setServerErrors(err)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <v-dialog
    :model-value="modelValue"
    max-width="520"
    :persistent="isSubmitting"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <v-card class="pa-6 vehicle-dialog-card" rounded="lg" elevation="0">
      <div class="d-flex align-center justify-space-between mb-4">
        <div>
          <h3 class="text-h6 font-weight-bold">
            {{ isEdit ? 'Edit Fleet Vehicle' : 'Register New Vehicle' }}
          </h3>
          <p class="text-caption text-medium-emphasis mb-0">
            {{ isEdit ? 'Update plate or package capacity for spatial assignment.' : 'Add your bike, motorbike, car, or delivery van.' }}
          </p>
        </div>
        <v-btn
          icon="mdi-close"
          variant="text"
          size="small"
          :disabled="isSubmitting"
          @click="emit('update:modelValue', false)"
        />
      </div>

      <ErrorBanner
        v-if="formError"
        title="Vehicle Registration Error"
        :detail="formError"
        :retryable="false"
        class="mb-4"
      />

      <v-form novalidate @submit.prevent="handleSubmit">
        <div class="d-flex flex-column ga-4">
          <!-- Vehicle Type Selector Tiles -->
          <div>
            <label class="field-label">Vehicle Category</label>
            <div class="vehicle-type-grid">
              <button
                v-for="item in vehicleTypes"
                :key="item.value"
                type="button"
                class="type-tile pa-3 rounded-lg text-center"
                :class="{ 'type-tile--selected': vehicleType === item.value }"
                @click="vehicleType = item.value"
              >
                <v-icon
                  :icon="item.icon"
                  size="24"
                  :color="vehicleType === item.value ? 'primary' : 'secondary'"
                  class="mb-1"
                />
                <div class="text-caption font-weight-bold">{{ item.label }}</div>
              </button>
            </div>
            <div v-if="firstError('type')" class="text-caption text-error mt-1">
              {{ firstError('type') }}
            </div>
          </div>

          <!-- Plate Number Input -->
          <div>
            <label class="field-label">License Plate Number</label>
            <v-text-field
              v-model="plateNumber"
              placeholder="e.g. LT 824 EF"
              prepend-inner-icon="mdi-numeric"
              class="font-mono text-uppercase"
              :disabled="isSubmitting"
              :error="Boolean(firstError('plateNumber'))"
              :error-messages="firstError('plateNumber')"
              @update:model-value="clearField('plateNumber')"
            />
            <span class="text-caption text-medium-emphasis">
              Official Cameroon plate registration format (4 to 20 letters, numbers, spaces, or hyphens).
            </span>
          </div>

          <!-- Max Package Size Tiles -->
          <div>
            <label class="field-label">Maximum Parcel Capacity</label>
            <div class="d-flex flex-column ga-2">
              <button
                v-for="item in packageSizes"
                :key="item.value"
                type="button"
                class="size-tile pa-3 rounded-lg d-flex align-center justify-space-between text-left"
                :class="{ 'size-tile--selected': maxPackageSize === item.value }"
                @click="maxPackageSize = item.value"
              >
                <div>
                  <div class="text-body-2 font-weight-bold">{{ item.label }}</div>
                  <div class="text-caption text-medium-emphasis">{{ item.desc }}</div>
                </div>
                <v-icon
                  :icon="maxPackageSize === item.value ? 'mdi-radiobox-marked' : 'mdi-radiobox-blank'"
                  :color="maxPackageSize === item.value ? 'primary' : 'medium-emphasis'"
                  size="20"
                />
              </button>
            </div>
            <div v-if="firstError('maxPackageSize')" class="text-caption text-error mt-1">
              {{ firstError('maxPackageSize') }}
            </div>
          </div>

          <div class="d-flex align-center justify-end ga-3 mt-4">
            <v-btn
              variant="tonal"
              color="secondary"
              :disabled="isSubmitting"
              @click="emit('update:modelValue', false)"
            >
              Cancel
            </v-btn>
            <v-btn
              type="submit"
              color="primary"
              variant="flat"
              :loading="isSubmitting"
              :disabled="isSubmitting"
            >
              {{ isEdit ? 'Save Changes' : 'Register Vehicle' }}
            </v-btn>
          </div>
        </div>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.vehicle-dialog-card {
  background-color: rgb(var(--v-theme-surface));
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.vehicle-type-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.type-tile {
  background-color: rgba(var(--v-theme-surface-variant), 0.35);
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  cursor: pointer;
  transition: all var(--transition-fast);
}

.type-tile:hover {
  background-color: rgba(var(--v-theme-surface-variant), 0.6);
}

.type-tile--selected {
  border-color: rgb(var(--v-theme-primary));
  background-color: rgba(var(--v-theme-primary), 0.12);
}

.size-tile {
  background-color: rgba(var(--v-theme-surface-variant), 0.35);
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  cursor: pointer;
  transition: all var(--transition-fast);
}

.size-tile:hover {
  background-color: rgba(var(--v-theme-surface-variant), 0.6);
}

.size-tile--selected {
  border-color: rgb(var(--v-theme-primary));
  background-color: rgba(var(--v-theme-primary), 0.12);
}
</style>
