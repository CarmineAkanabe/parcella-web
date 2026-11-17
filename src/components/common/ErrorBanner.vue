<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title?: string
  detail?: string
  error?: unknown
  retryable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: undefined,
  detail: undefined,
  error: undefined,
  retryable: true,
})

const emit = defineEmits<{
  retry: []
}>()

const resolvedTitle = computed(() => {
  if (props.title) return props.title
  if (props.error && typeof props.error === 'object') {
    const errObj = props.error as Record<string, unknown>
    if (typeof errObj.title === 'string' && errObj.title.trim()) {
      return errObj.title
    }
  }
  return 'Operation Failed'
})

const resolvedDetail = computed(() => {
  if (props.detail) return props.detail
  if (typeof props.error === 'string' && props.error.trim()) {
    return props.error
  }
  if (props.error && typeof props.error === 'object') {
    const errObj = props.error as Record<string, unknown>
    if (typeof errObj.detail === 'string' && errObj.detail.trim()) {
      return errObj.detail
    }
    if (typeof errObj.message === 'string' && errObj.message.trim()) {
      return errObj.message
    }
  }
  return 'An unexpected error occurred while communicating with the server. Please try again.'
})
</script>

<template>
  <v-alert
    type="error"
    variant="tonal"
    icon="mdi-alert-octagon-outline"
    class="error-banner"
    rounded="lg"
  >
    <div class="d-flex flex-column flex-sm-row align-sm-center justify-space-between ga-4">
      <div>
        <div class="text-subtitle-2 font-weight-bold">
          {{ resolvedTitle }}
        </div>
        <div class="text-body-2 mt-1">
          {{ resolvedDetail }}
        </div>
      </div>

      <v-btn
        v-if="retryable"
        color="error"
        variant="outlined"
        size="small"
        prepend-icon="mdi-refresh"
        class="flex-shrink-0"
        @click="emit('retry')"
      >
        Retry
      </v-btn>
    </div>
  </v-alert>
</template>

<style scoped lang="scss">
.error-banner {
  border: 1px solid rgba(var(--v-theme-error), 0.35);
}
</style>
