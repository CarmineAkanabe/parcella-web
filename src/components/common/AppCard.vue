<script setup lang="ts">
import { computed, useSlots } from 'vue'

interface Props {
  title?: string
  subtitle?: string
  eyebrow?: string
  padded?: boolean
  interactive?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: undefined,
  subtitle: undefined,
  eyebrow: undefined,
  padded: true,
  interactive: false,
  loading: false,
})

const slots = useSlots()

const hasHeader = computed(() => {
  return Boolean(props.title || props.subtitle || props.eyebrow || slots.header || slots.actions)
})
</script>

<template>
  <v-card
    class="app-card parcella-card"
    :class="{ 'app-card--interactive': interactive }"
    :ripple="interactive"
    elevation="0"
  >
    <v-progress-linear
      v-if="loading"
      indeterminate
      color="primary"
      height="3"
      class="app-card__loader"
    />

    <div
      v-if="hasHeader"
      class="app-card__header d-flex align-center justify-space-between ga-4 px-5 pt-5"
      :class="{ 'pb-4 app-card__header--bordered': !padded }"
    >
      <slot name="header">
        <div class="min-w-0">
          <div
            v-if="eyebrow"
            class="text-caption text-uppercase text-primary font-weight-semibold mb-1"
          >
            {{ eyebrow }}
          </div>
          <h3 v-if="title" class="text-subtitle-1 font-weight-bold text-high-emphasis">
            {{ title }}
          </h3>
          <p v-if="subtitle" class="text-body-2 text-medium-emphasis mt-1 mb-0">
            {{ subtitle }}
          </p>
        </div>
      </slot>

      <div v-if="$slots.actions" class="d-flex align-center ga-2 flex-shrink-0">
        <slot name="actions" />
      </div>
    </div>

    <div :class="padded ? 'pa-5' : ''">
      <slot />
    </div>

    <template v-if="$slots.footer">
      <v-divider />
      <div class="app-card__footer px-5 py-3">
        <slot name="footer" />
      </div>
    </template>
  </v-card>
</template>

<style scoped lang="scss">
.app-card {
  position: relative;
  background-color: rgb(var(--v-theme-surface));
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: var(--radius-lg, 14px);
  box-shadow: var(--shadow-card, none);
  transition:
    transform 180ms var(--ease-out-expo, cubic-bezier(0.16, 1, 0.3, 1)),
    box-shadow 180ms var(--ease-out-expo, cubic-bezier(0.16, 1, 0.3, 1)),
    border-color 180ms var(--ease-out-expo, cubic-bezier(0.16, 1, 0.3, 1));
  overflow: hidden;
}

.app-card--interactive {
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(var(--v-theme-primary), 0.45);
    box-shadow: var(--shadow-elevated, none);
  }

  &:active {
    transform: translateY(0);
  }
}

.app-card__header--bordered {
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.app-card__footer {
  background-color: rgba(var(--v-theme-surface-variant), 0.35);
}
</style>
