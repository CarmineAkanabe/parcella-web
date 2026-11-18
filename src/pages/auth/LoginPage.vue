<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { AppCard, ErrorBanner } from '@/components/common'
import AuthShowcaseSplit from '@/components/complex/auth/AuthShowcaseSplit.vue'
import { loginSchema } from '@/features/auth'
import { useFormErrors } from '@/shared/composables/useFormErrors'
import { useToast } from '@/shared/composables/useToast'
import { useAuthStore } from '@/shared/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const isSubmitting = ref(false)

const {
  formError,
  validate,
  setServerErrors,
  firstError,
  clearField,
  clearAll,
} = useFormErrors(loginSchema)

onMounted(() => {
  const prefillEmail = route.query.email
  if (typeof prefillEmail === 'string' && prefillEmail.trim()) {
    email.value = prefillEmail.trim()
  }
})

function resolvePostLoginTarget(): string {
  const redirectParam = route.query.redirect
  if (
    typeof redirectParam === 'string' &&
    redirectParam.startsWith('/') &&
    !redirectParam.startsWith('//') &&
    !redirectParam.startsWith('/login') &&
    !redirectParam.startsWith('/register')
  ) {
    return redirectParam
  }
  return authStore.homeRoute
}

async function handleSubmit(): Promise<void> {
  const payload = {
    email: email.value.trim(),
    password: password.value,
  }

  if (!validate(payload)) {
    return
  }

  isSubmitting.value = true
  try {
    const result = await authStore.login(payload)
    toast.success(`Welcome back, ${result.user.fullName}.`)
    await router.push(resolvePostLoginTarget())
  } catch (err: unknown) {
    setServerErrors(err)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <AuthShowcaseSplit>
    <AppCard class="fill-height d-flex flex-column justify-space-between pa-2 pa-sm-4" :loading="isSubmitting">
    <div>
      <!-- Top Auth Switcher Tabs (Matches Stitch Header) -->
      <div class="d-flex flex-wrap align-center justify-space-between ga-2 pb-4 mb-5 auth-tabs-bar">
        <div class="d-flex align-center ga-6">
          <RouterLink to="/register" class="auth-tab text-subtitle-1 font-weight-semibold text-decoration-none">
            Create an Account
          </RouterLink>
          <span class="auth-tab auth-tab--active text-subtitle-1 font-weight-bold">
            Sign In
          </span>
        </div>

        <v-chip size="small" variant="outlined" class="font-mono text-caption">
          Escrow Console Access
        </v-chip>
      </div>

      <div class="mb-6">
        <h2 class="text-h5 font-weight-bold mb-1">Welcome back to Parcella</h2>
        <p class="text-body-2 text-medium-emphasis mb-0">
          Enter your registered email and password to access your deliveries and escrow wallet.
        </p>
      </div>

      <v-form novalidate @submit.prevent="handleSubmit">
        <div class="d-flex flex-column ga-4">
          <ErrorBanner
            v-if="formError"
            title="Sign-in failed"
            :detail="formError"
            :retryable="false"
          />

          <div>
            <label class="field-label">Email Address</label>
            <v-text-field
              v-model="email"
              type="email"
              placeholder="marcelle@example.cm"
              prepend-inner-icon="mdi-email-outline"
              autocomplete="email"
              :disabled="isSubmitting"
              :error="Boolean(firstError('email'))"
              :error-messages="firstError('email')"
              @update:model-value="clearField('email')"
            />
          </div>

          <div>
            <label class="field-label">Password</label>
            <v-text-field
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••••••"
              prepend-inner-icon="mdi-key-outline"
              :append-inner-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
              autocomplete="current-password"
              :disabled="isSubmitting"
              :error="Boolean(firstError('password'))"
              :error-messages="firstError('password')"
              @click:append-inner="showPassword = !showPassword"
              @update:model-value="clearField('password')"
            />
          </div>

          <v-btn
            type="submit"
            color="primary"
            variant="flat"
            size="large"
            block
            append-icon="mdi-arrow-right"
            :loading="isSubmitting"
            :disabled="isSubmitting"
            class="mt-2 font-weight-bold"
            @click="clearAll"
          >
            Sign In to Dashboard
          </v-btn>
        </div>
      </v-form>
    </div>

    <div class="pt-6 mt-6 auth-footer-bar text-center">
      <p class="text-caption text-medium-emphasis mb-3">
        Protected by 2-step pickup and drop-off verification codes across Douala &amp; Yaoundé.
      </p>
      <div class="text-body-2">
        <span class="text-medium-emphasis">New to Parcella? </span>
        <RouterLink to="/register" class="text-primary font-weight-bold text-decoration-none">
          Create a Protected Account
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

.auth-footer-bar {
  border-top: 1px solid var(--border-subtle);
}
</style>
