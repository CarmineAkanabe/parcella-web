<script setup lang="ts">
import type { RegisterRole } from '@/features/auth'

interface Props {
  modelValue: RegisterRole
}

defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: RegisterRole]
}>()

const ROLE_OPTIONS: Array<{ value: RegisterRole; badge?: string; title: string; subtitle: string }> = [
  {
    value: 'CUSTOMER',
    badge: 'Sender / Buyer',
    title: 'Customer',
    subtitle: 'Send & receive packages with escrow payment security.',
  },
  {
    value: 'DRIVER',
    title: 'Courier / Driver',
    subtitle: 'Deliver packages & earn verified daily payouts.',
  },
]
</script>

<template>
  <div>
    <label class="field-label">Select Your Platform Role</label>
    <div class="role-grid">
      <button
        v-for="opt in ROLE_OPTIONS"
        :key="opt.value"
        type="button"
        class="role-option text-left pa-3"
        :class="{ 'role-option--active': modelValue === opt.value }"
        @click="emit('update:modelValue', opt.value)"
      >
        <div class="d-flex align-center ga-2 mb-1">
          <v-icon
            :icon="modelValue === opt.value ? 'mdi-radiobox-marked' : 'mdi-radiobox-blank'"
            :color="modelValue === opt.value ? 'primary' : 'secondary'"
            size="18"
          />
          <span class="text-body-2 font-weight-bold">{{ opt.title }}</span>
          <v-chip v-if="opt.badge" size="x-small" color="success" variant="tonal" class="font-mono">
            {{ opt.badge }}
          </v-chip>
        </div>
        <div class="text-caption text-medium-emphasis pl-6">{{ opt.subtitle }}</div>
      </button>
    </div>
  </div>
</template>

<style scoped>
.role-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

@media (max-width: 560px) {
  .role-grid {
    grid-template-columns: 1fr;
  }
}

.role-option {
  border-radius: var(--radius-md);
  border: 1.5px solid var(--border-subtle);
  background-color: rgb(var(--v-theme-surface));
  color: rgb(var(--v-theme-on-surface));
  cursor: pointer;
  transition: border-color var(--transition-fast), background-color var(--transition-fast);
}

.role-option--active {
  border-color: rgb(var(--v-theme-primary));
  background-color: rgba(var(--v-theme-primary), 0.05);
}
</style>
