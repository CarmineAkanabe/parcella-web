<script setup lang="ts">
import { computed } from 'vue'
import { useToast, type ToastVariant } from '@/shared/composables/useToast'

const { visible, message, variant, timeout, dismiss } = useToast()

const ICON_MAP: Record<ToastVariant, string> = {
  info: 'mdi-information-outline',
  success: 'mdi-check-circle-outline',
  warning: 'mdi-alert-outline',
  error: 'mdi-alert-octagon-outline',
}

const icon = computed(() => ICON_MAP[variant.value] ?? 'mdi-information-outline')
</script>

<template>
  <v-snackbar
    v-model="visible"
    :timeout="timeout"
    :color="variant"
    location="bottom end"
    rounded="lg"
    elevation="4"
  >
    <div class="d-flex align-center ga-3">
      <v-icon :icon="icon" size="20" class="flex-shrink-0" />
      <span class="text-body-2 font-weight-medium">{{ message }}</span>
    </div>

    <template v-slot:actions>
      <v-btn
        variant="text"
        size="small"
        class="font-weight-semibold"
        @click="dismiss"
      >
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>
