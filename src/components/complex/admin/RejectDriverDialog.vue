<script setup lang="ts">
import { ref, watch } from 'vue'
import { ErrorBanner } from '@/components/common'
import { rejectDriverSchema } from '@/features/admin'
import { useFormErrors } from '@/shared/composables/useFormErrors'

interface Props {
  modelValue: boolean
  driverName?: string
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  driverName: 'Courier Applicant',
  loading: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: [note: string]
}>()

const note = ref('')

const {
  formError,
  validate,
  firstError,
  clearField,
  clearAll,
} = useFormErrors(rejectDriverSchema)

const quickReasons = [
  'Blurry photo — document details are illegible',
  'Expired driver license document',
  'Full name does not match registered account',
  'Document edges cropped or information obscured',
]

function handleSelectReason(reason: string): void {
  note.value = reason
  clearField('note')
}

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      note.value = ''
      clearAll()
    }
  },
)

function handleSubmit(): void {
  const payload = { note: note.value.trim() }
  if (!validate(payload)) {
    return
  }
  emit('confirm', payload.note)
}
</script>

<template>
  <v-dialog
    :model-value="modelValue"
    max-width="500"
    :persistent="loading"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <v-card class="pa-6 reject-dialog-card" rounded="lg" elevation="0">
      <div class="d-flex align-start ga-3 mb-4">
        <v-avatar color="error" variant="tonal" rounded="lg" size="44" class="flex-shrink-0">
          <v-icon icon="mdi-account-cancel-outline" color="error" size="24" />
        </v-avatar>
        <div>
          <h3 class="text-h6 font-weight-bold">Reject Driver Application</h3>
          <p class="text-caption text-medium-emphasis mb-0">
            For {{ driverName }}. Please specify why this application cannot be approved.
          </p>
        </div>
      </div>

      <ErrorBanner
        v-if="formError"
        title="Validation Error"
        :detail="formError"
        :retryable="false"
        class="mb-3"
      />

      <div class="mb-3">
        <span class="text-caption font-weight-bold text-uppercase text-medium-emphasis d-block mb-2">
          Quick-Fill Common Reasons
        </span>
        <div class="d-flex flex-wrap ga-2">
          <v-chip
            v-for="reason in quickReasons"
            :key="reason"
            size="small"
            variant="tonal"
            color="secondary"
            class="reason-chip cursor-pointer"
            @click="handleSelectReason(reason)"
          >
            {{ reason }}
          </v-chip>
        </div>
      </div>

      <div class="mb-4">
        <label class="field-label">Rejection Notice / Instructions (Required)</label>
        <v-textarea
          v-model="note"
          rows="4"
          counter="500"
          placeholder="Explain clearly what document issues must be fixed before the driver resubmits..."
          :disabled="loading"
          :error="Boolean(firstError('note'))"
          :error-messages="firstError('note')"
          @update:model-value="clearField('note')"
        />
        <span class="text-caption text-medium-emphasis">
          This message is shown directly to the driver on their dashboard so they can upload a corrected document.
        </span>
      </div>

      <div class="d-flex align-center justify-end ga-3">
        <v-btn
          variant="tonal"
          color="secondary"
          :disabled="loading"
          @click="emit('update:modelValue', false)"
        >
          Cancel
        </v-btn>
        <v-btn
          color="error"
          variant="flat"
          prepend-icon="mdi-close-circle-outline"
          :loading="loading"
          :disabled="loading"
          @click="handleSubmit"
        >
          Confirm Rejection
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.reject-dialog-card {
  background-color: rgb(var(--v-theme-surface));
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.reason-chip:hover {
  background-color: rgba(var(--v-theme-primary), 0.15);
}
</style>
