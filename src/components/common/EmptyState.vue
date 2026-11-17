<script setup lang="ts">
interface Props {
  title: string
  description?: string
  icon?: string
  actionLabel?: string
  compact?: boolean
}

withDefaults(defineProps<Props>(), {
  description: undefined,
  icon: 'mdi-package-variant-closed',
  actionLabel: undefined,
  compact: false,
})

const emit = defineEmits<{
  action: []
}>()
</script>

<template>
  <div
    class="empty-state d-flex flex-column align-center justify-center text-center mx-auto"
    :class="compact ? 'py-6 px-4' : 'py-12 px-6'"
  >
    <div class="empty-state__badge d-flex align-center justify-center mb-4">
      <slot name="icon">
        <v-icon :icon="icon" :size="compact ? 28 : 36" color="primary" />
      </slot>
    </div>

    <h3
      class="font-weight-bold text-high-emphasis mb-2"
      :class="compact ? 'text-subtitle-1' : 'text-h6'"
    >
      {{ title }}
    </h3>

    <p
      v-if="description"
      class="empty-state__description text-body-2 text-medium-emphasis mb-6"
    >
      {{ description }}
    </p>

    <div v-if="$slots.actions || actionLabel" class="d-flex align-center justify-center ga-3">
      <slot name="actions">
        <v-btn
          v-if="actionLabel"
          color="primary"
          variant="flat"
          prepend-icon="mdi-plus"
          @click="emit('action')"
        >
          {{ actionLabel }}
        </v-btn>
      </slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
.empty-state {
  max-width: 460px;
}

.empty-state__badge {
  width: 64px;
  height: 64px;
  border-radius: var(--radius-lg, 14px);
  background-color: rgba(var(--v-theme-primary), 0.12);
  border: 1px solid rgba(var(--v-theme-primary), 0.24);
}

.empty-state__description {
  max-width: 380px;
}
</style>
