<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { AppCard, ErrorBanner } from '@/components/common'
import AuthShowcaseSplit from '@/components/complex/auth/AuthShowcaseSplit.vue'
import RegisterRoleSelector from '@/components/complex/auth/RegisterRoleSelector.vue'
import LocationPicker from '@/components/complex/map/LocationPicker.vue'
import { registerSchema, registerStep1Schema, type RegisterRole } from '@/features/auth'
import { ApiError } from '@/shared/api'
import { useFormErrors } from '@/shared/composables/useFormErrors'
import { useToast } from '@/shared/composables/useToast'
import { useAuthStore } from '@/shared/stores/auth'
import type { Location } from '@/shared/types'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const step = ref<1 | 2>(1)
const role = ref<RegisterRole>('CUSTOMER')
const fullName = ref('')
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const paymentPhoneNumber = ref('237')
const preferredContactNumber = ref('237')
const syncContactPhone = ref(true)
const registeredLocation = ref<Location | null>(null)
const isSubmitting = ref(false)

const locationPickerRef = ref<InstanceType<typeof LocationPicker> | null>(null)

const {
  errors,
  formError,
  validate: validateFull,
  setServerErrors,
  firstError,
  firstErrorForPrefix,
  clearField,
  clearPrefix,
} = useFormErrors(registerSchema)

const step1Validator = useFormErrors(registerStep1Schema)

watch(paymentPhoneNumber, (val) => {
  if (syncContactPhone.value) preferredContactNumber.value = val
})

watch(syncContactPhone, (enabled) => {
  if (enabled) {
    preferredContactNumber.value = paymentPhoneNumber.value
    clearField('preferredContactNumber')
  }
})

function getStep1Payload() {
  return {
    role: role.value,
    fullName: fullName.value.trim(),
    email: email.value.trim().toLowerCase(),
    password: password.value,
    paymentPhoneNumber: paymentPhoneNumber.value.trim(),
    preferredContactNumber: (syncContactPhone.value ? paymentPhoneNumber.value : preferredContactNumber.value).trim(),
  }
}

async function handleNextStep(): Promise<void> {
  const step1Data = getStep1Payload()
  if (!step1Validator.validate(step1Data)) {
    errors.value = { ...step1Validator.errors.value }
    return
  }
  step.value = 2
  await nextTick()
  locationPickerRef.value?.invalidateSize()
}

function handleLocationUpdate(loc: Location): void {
  registeredLocation.value = loc
  clearPrefix('registeredLocation')
}

async function handleSubmit(): Promise<void> {
  const payload = { ...getStep1Payload(), registeredLocation: registeredLocation.value }

  if (!validateFull(payload) || !registeredLocation.value) {
    if (!registeredLocation.value) {
      errors.value = {
        ...errors.value,
        'registeredLocation.address': ['Click the map or search an address to pin your default location'],
      }
    }
    return
  }

  isSubmitting.value = true
  try {
    await authStore.register({ ...getStep1Payload(), registeredLocation: registeredLocation.value })
    try {
      const loginResult = await authStore.login({ email: payload.email, password: payload.password })
      toast.success(`Account created! Welcome to Parcella, ${loginResult.user.fullName}.`)
      await router.push(authStore.homeRoute)
    } catch {
      toast.success('Account created! Please sign in with your credentials.')
      await router.push({ name: 'login', query: { email: payload.email } })
    }
  } catch (err: unknown) {
    setServerErrors(err)
    const step1Keys = ['role', 'fullName', 'email', 'password', 'paymentPhoneNumber', 'preferredContactNumber']
    if (step1Keys.some((k) => Boolean(firstError(k))) || (err instanceof ApiError && err.status === 409)) {
      step.value = 1
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <AuthShowcaseSplit>
    <AppCard class="fill-height d-flex flex-column justify-space-between pa-2 pa-sm-4" :loading="isSubmitting">
      <div>
        <!-- Top Auth Switcher Tabs + Step Pill (Matches Stitch Screen 1) -->
        <div class="d-flex flex-wrap align-center justify-space-between ga-2 pb-4 mb-4 auth-tabs-bar">
          <div class="d-flex align-center ga-6">
            <span class="auth-tab auth-tab--active text-subtitle-1 font-weight-bold">
              Create an Account
            </span>
            <RouterLink to="/login" class="auth-tab text-subtitle-1 font-weight-semibold text-decoration-none">
              Sign In
            </RouterLink>
          </div>

          <v-chip size="small" variant="outlined" class="font-mono text-caption" @click="step = 1">
            {{ step === 1 ? 'Step 1 of 2: Account Details' : 'Step 2 of 2: Default Hub' }}
          </v-chip>
        </div>

        <v-progress-linear
          :model-value="step === 1 ? 50 : 100"
          color="primary"
          height="4"
          rounded
          class="mb-5"
        />

        <ErrorBanner
          v-if="formError"
          title="Registration could not be completed"
          :detail="formError"
          :retryable="false"
          class="mb-4"
        />

        <!-- STEP 1: Role, Identity, and Mobile Money Numbers -->
        <v-form v-if="step === 1" novalidate @submit.prevent="handleNextStep">
          <div class="d-flex flex-column ga-4">
            <RegisterRoleSelector v-model="role" />

            <v-row dense>
              <v-col cols="12" sm="6">
                <label class="field-label">Full Legal Name</label>
                <v-text-field
                  v-model="fullName"
                  placeholder="Marcelle Manga"
                  prepend-inner-icon="mdi-account-outline"
                  autocomplete="name"
                  :error="Boolean(firstError('fullName'))"
                  :error-messages="firstError('fullName')"
                  @update:model-value="clearField('fullName')"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <label class="field-label">Email Address</label>
                <v-text-field
                  v-model="email"
                  type="email"
                  placeholder="marcelle@example.cm"
                  prepend-inner-icon="mdi-email-outline"
                  autocomplete="email"
                  :error="Boolean(firstError('email'))"
                  :error-messages="firstError('email')"
                  @update:model-value="clearField('email')"
                />
              </v-col>
            </v-row>

            <div>
              <div class="d-flex align-center justify-space-between mb-1">
                <label class="field-label mb-0">Phone / Mobile Money Number</label>
                <span class="text-caption font-mono text-success font-weight-semibold">
                  ● Cameroon (+237)
                </span>
              </div>
              <v-text-field
                v-model="paymentPhoneNumber"
                placeholder="237677894210"
                prepend-inner-icon="mdi-cellphone-check"
                class="font-mono"
                :error="Boolean(firstError('paymentPhoneNumber'))"
                :error-messages="firstError('paymentPhoneNumber')"
                @update:model-value="clearField('paymentPhoneNumber')"
              />
              <span class="text-caption text-medium-emphasis d-block mt-1">
                Used for instant mobile money escrow releases &amp; courier coordination.
              </span>
            </div>

            <v-checkbox
              v-model="syncContactPhone"
              label="Use this phone number to receive 6-digit SMS delivery handshake codes."
            />

            <div v-if="!syncContactPhone">
              <label class="field-label">Preferred Contact Number</label>
              <v-text-field
                v-model="preferredContactNumber"
                placeholder="237699123456"
                prepend-inner-icon="mdi-phone-outline"
                class="font-mono"
                :error="Boolean(firstError('preferredContactNumber'))"
                :error-messages="firstError('preferredContactNumber')"
                @update:model-value="clearField('preferredContactNumber')"
              />
            </div>

            <div>
              <label class="field-label">Password</label>
              <v-text-field
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="8 to 72 characters"
                prepend-inner-icon="mdi-key-outline"
                :append-inner-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                autocomplete="new-password"
                :error="Boolean(firstError('password'))"
                :error-messages="firstError('password')"
                @click:append-inner="showPassword = !showPassword"
                @update:model-value="clearField('password')"
              />
            </div>

            <v-sheet rounded="lg" class="step2-preview-box pa-3 d-flex align-center justify-space-between ga-3">
              <div class="d-flex align-center ga-2">
                <v-icon icon="mdi-map-marker-radius-outline" color="primary" size="20" />
                <div>
                  <div class="text-caption font-weight-bold">Next Step: Default Hub / Landmark</div>
                  <div class="text-caption text-medium-emphasis">
                    Pin your Douala or Yaoundé neighborhood on the interactive map
                  </div>
                </div>
              </div>
              <span class="font-mono text-caption text-medium-emphasis d-none d-sm-inline">Step 2/2</span>
            </v-sheet>

            <v-btn type="submit" color="primary" variant="flat" size="large" block append-icon="mdi-arrow-right" class="font-weight-bold">
              Continue to Default Location
            </v-btn>
          </div>
        </v-form>

        <!-- STEP 2: LocationPicker on Map -->
        <v-form v-else novalidate @submit.prevent="handleSubmit">
          <div class="d-flex flex-column ga-4">
            <LocationPicker
              ref="locationPickerRef"
              :model-value="registeredLocation"
              label="Default Dispatch Hub &amp; Landmark"
              :disabled="isSubmitting"
              :error-message="firstErrorForPrefix('registeredLocation')"
              @update:model-value="handleLocationUpdate"
            />

            <div class="d-flex align-center ga-3 pt-2">
              <v-btn variant="tonal" color="secondary" size="large" prepend-icon="mdi-arrow-left" :disabled="isSubmitting" @click="step = 1">
                Back
              </v-btn>
              <v-btn type="submit" color="primary" variant="flat" size="large" append-icon="mdi-arrow-right" :loading="isSubmitting" :disabled="isSubmitting" class="flex-grow-1 font-weight-bold">
                Create Protected Account
              </v-btn>
            </div>
          </div>
        </v-form>
      </div>

      <div class="pt-5 mt-5 auth-footer-bar text-center">
        <p class="text-caption text-medium-emphasis mb-2">
          By continuing, you agree to Parcella's Escrow Service Terms &amp; Carrier Protocols.
        </p>
        <div class="text-body-2">
          <span class="text-medium-emphasis">Already have an active account? </span>
          <RouterLink to="/login" class="text-primary font-weight-bold text-decoration-none">
            Sign In to Dashboard
          </RouterLink>
        </div>
      </div>
    </AppCard>
  </AuthShowcaseSplit>
</template>

<style scoped>
.auth-tabs-bar {
  border-bottom: 1px solid var(--border-subtle);
}

.auth-tab {
  position: relative;
  color: rgb(var(--v-theme-on-surface-variant));
  padding-bottom: 12px;
  margin-bottom: -17px;
}

.auth-tab--active {
  color: rgb(var(--v-theme-primary));
  border-bottom: 2px solid rgb(var(--v-theme-primary));
}

.step2-preview-box {
  background-color: rgba(var(--v-theme-surface-variant), 0.6);
  border: 1px solid var(--border-subtle);
}

.auth-footer-bar {
  border-top: 1px solid var(--border-subtle);
}
</style>
