<script setup lang="ts">
import { computed, useSlots } from 'vue'
import EmptyState from './EmptyState.vue'
import ErrorBanner from './ErrorBanner.vue'

interface Props {
  headers: ReadonlyArray<Record<string, unknown>>
  items: ReadonlyArray<unknown>
  totalItems?: number
  page?: number
  itemsPerPage?: number
  loading?: boolean
  error?: unknown
  emptyTitle?: string
  emptyDescription?: string
  emptyIcon?: string
}

const props = withDefaults(defineProps<Props>(), {
  totalItems: undefined,
  page: 1,
  itemsPerPage: 20,
  loading: false,
  error: undefined,
  emptyTitle: 'No records found',
  emptyDescription: 'Try adjusting your filters or check back later for updated logistics data.',
  emptyIcon: 'mdi-package-variant-closed',
})

const emit = defineEmits<{
  'update:page': [page: number]
  'update:itemsPerPage': [size: number]
  retry: []
}>()

const slots = useSlots()

const resolvedTotalItems = computed(() => {
  return props.totalItems !== undefined ? props.totalItems : props.items.length
})

const itemSlotNames = computed(() => {
  return Object.keys(slots).filter((name) => name.startsWith('item.'))
})
</script>

<template>
  <div class="data-table-wrapper">
    <div
      v-if="$slots.filters"
      class="data-table__filters d-flex align-center flex-wrap ga-3 pa-4"
    >
      <slot name="filters" />
    </div>

    <div v-if="error" class="pa-4">
      <ErrorBanner :error="error" @retry="emit('retry')" />
    </div>

    <v-data-table-server
      v-else
      :headers="headers as never"
      :items="items as never"
      :items-length="resolvedTotalItems"
      :page="page"
      :items-per-page="itemsPerPage"
      :loading="loading"
      class="data-table bg-surface"
      hover
      @update:page="emit('update:page', $event)"
      @update:items-per-page="emit('update:itemsPerPage', $event)"
    >
      <template
        v-for="slotName in itemSlotNames"
        :key="slotName"
        v-slot:[slotName]="slotProps"
      >
        <slot :name="slotName" v-bind="slotProps ?? {}" />
      </template>

      <template v-slot:no-data>
        <EmptyState
          :title="emptyTitle"
          :description="emptyDescription"
          :icon="emptyIcon"
          compact
        />
      </template>
    </v-data-table-server>
  </div>
</template>

<style scoped lang="scss">
.data-table-wrapper {
  background-color: rgb(var(--v-theme-surface));
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: var(--radius-lg, 14px);
  overflow: hidden;
}

.data-table__filters {
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  background-color: rgba(var(--v-theme-surface-variant), 0.25);
}

.data-table {
  background-color: transparent;
}
</style>
