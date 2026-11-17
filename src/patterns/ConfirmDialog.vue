<script setup lang="ts">
interface Props {
  modelValue: boolean
  title: string
  message: string
  itemName?: string
  confirmLabel?: string
  cancelLabel?: string
  destructive?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  itemName: undefined,
  confirmLabel: 'Confirm',
  cancelLabel: 'Cancel',
  destructive: false,
  loading: false,
})

const emit = defineEmits<{
  'update:modelValue': [val: boolean]
  confirm: []
  cancel: []
}>()

function handleCancel(): void {
  if (props.loading) return
  emit('cancel')
  emit('update:modelValue', false)
}

function handleConfirm(): void {
  if (props.loading) return
  emit('confirm')
}
</script>

<template>
  <v-dialog
    :model-value="modelValue"
    max-width="460"
    :persistent="loading"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <v-card class="confirm-dialog pa-6" rounded="lg" elevation="0">
      <div class="d-flex align-start ga-4 mb-4">
        <div
          class="confirm-dialog__icon d-flex align-center justify-center flex-shrink-0"
          :class="destructive ? 'confirm-dialog__icon--error' : 'confirm-dialog__icon--primary'"
        >
          <v-icon
            :icon="destructive ? 'mdi-alert-octagon-outline' : 'mdi-help-circle-outline'"
            :color="destructive ? 'error' : 'primary'"
            size="24"
          />
        </div>

        <div class="min-w-0">
          <h3 class="text-h6 font-weight-bold text-high-emphasis">
            {{ title }}
          </h3>
          <p class="text-body-2 text-medium-emphasis mt-1 mb-0">
            {{ message }}
          </p>
          <div
            v-if="itemName"
            class="confirm-dialog__item font-mono text-caption font-weight-semibold px-3 py-2 mt-3"
          >
            {{ itemName }}
          </div>
        </div>
      </div>

      <div class="d-flex align-center justify-end ga-3 mt-6">
        <v-btn
          variant="tonal"
          color="secondary"
          class="font-weight-semibold"
          :disabled="loading"
          @click="handleCancel"
        >
          {{ cancelLabel }}
        </v-btn>

        <v-btn
          :color="destructive ? 'error' : 'primary'"
          variant="flat"
          class="font-weight-semibold"
          :loading="loading"
          :disabled="loading"
          @click="handleConfirm"
        >
          {{ confirmLabel }}
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss">
.confirm-dialog {
  background-color: rgb(var(--v-theme-surface));
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.confirm-dialog__icon {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md, 10px);
}

.confirm-dialog__icon--primary {
  background-color: rgba(var(--v-theme-primary), 0.12);
  border: 1px solid rgba(var(--v-theme-primary), 0.25);
}

.confirm-dialog__icon--error {
  background-color: rgba(var(--v-theme-error), 0.12);
  border: 1px solid rgba(var(--v-theme-error), 0.25);
}

.confirm-dialog__item {
  background-color: rgba(var(--v-theme-surface-variant), 0.5);
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: var(--radius-sm, 6px);
}
</style>
