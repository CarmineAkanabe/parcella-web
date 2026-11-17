<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

interface Props {
  title: string
  subtitle?: string
  eyebrow?: string
  backTo?: string | Record<string, unknown>
}

defineProps<Props>()
</script>

<template>
  <header class="page-header d-flex flex-column flex-sm-row align-sm-center justify-space-between ga-4 mb-6">
    <div class="d-flex align-start ga-3 min-w-0">
      <v-btn
        v-if="backTo"
        :to="backTo as RouteLocationRaw"
        icon="mdi-arrow-left"
        variant="tonal"
        color="secondary"
        size="small"
        class="mt-1 flex-shrink-0"
        aria-label="Go back"
      />

      <div class="min-w-0">
        <div
          v-if="eyebrow"
          class="text-caption font-mono text-uppercase text-primary font-weight-semibold mb-1"
        >
          {{ eyebrow }}
        </div>

        <div class="d-flex align-center flex-wrap ga-3">
          <h1 class="text-h5 text-md-h4 font-weight-bold text-high-emphasis">
            {{ title }}
          </h1>
          <slot name="status" />
        </div>

        <p v-if="subtitle" class="text-body-2 text-medium-emphasis mt-1 mb-0">
          {{ subtitle }}
        </p>
      </div>
    </div>

    <div v-if="$slots.actions" class="d-flex align-center flex-wrap ga-2 flex-shrink-0">
      <slot name="actions" />
    </div>
  </header>
</template>

<style scoped lang="scss">
.page-header {
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  padding-bottom: 16px;
}
</style>
