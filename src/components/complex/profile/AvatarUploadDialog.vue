<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import { ErrorBanner } from '@/components/common'
import { useToast } from '@/shared/composables/useToast'
import { useAuthStore } from '@/shared/stores/auth'
import type { UserResponse } from '@/shared/types'
import { validateImageFile } from '@/shared/utils'

interface Props {
  modelValue: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  uploaded: [user: UserResponse]
}>()

const authStore = useAuthStore()
const toast = useToast()

const fileInputRef = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const previewUrl = ref<string | null>(null)
const errorMessage = ref<string | null>(null)
const isUploading = ref(false)

function revokePreview(): void {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = null
  }
}

function resetDialog(): void {
  revokePreview()
  selectedFile.value = null
  errorMessage.value = null
  isUploading.value = false
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

watch(
  () => props.modelValue,
  (open) => {
    if (!open) {
      resetDialog()
    }
  },
)

onBeforeUnmount(() => {
  revokePreview()
})

function triggerFileInput(): void {
  fileInputRef.value?.click()
}

function handleFileChange(event: Event): void {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  const validationError = validateImageFile(file, 2 * 1024 * 1024)
  if (validationError) {
    errorMessage.value = validationError
    resetDialog()
    return
  }

  errorMessage.value = null
  revokePreview()
  selectedFile.value = file
  previewUrl.value = URL.createObjectURL(file)
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

async function handleUpload(): Promise<void> {
  if (!selectedFile.value) return

  isUploading.value = true
  errorMessage.value = null
  try {
    const updatedUser = await authStore.uploadAvatar(selectedFile.value)
    toast.success('Profile avatar updated successfully.')
    emit('uploaded', updatedUser)
    emit('update:modelValue', false)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to upload avatar photo.'
    errorMessage.value = message
  } finally {
    isUploading.value = false
  }
}
</script>

<template>
  <v-dialog
    :model-value="modelValue"
    max-width="460"
    :persistent="isUploading"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <v-card class="pa-6 avatar-dialog-card" rounded="lg" elevation="0">
      <div class="d-flex align-center justify-space-between mb-4">
        <div>
          <h3 class="text-h6 font-weight-bold">Update Profile Photo</h3>
          <p class="text-caption text-medium-emphasis mb-0">
            JPG or PNG format, maximum 2 MB file size.
          </p>
        </div>
        <v-btn
          icon="mdi-close"
          variant="text"
          size="small"
          :disabled="isUploading"
          @click="emit('update:modelValue', false)"
        />
      </div>

      <ErrorBanner
        v-if="errorMessage"
        title="Upload Error"
        :detail="errorMessage"
        :retryable="false"
        class="mb-4"
      />

      <input
        ref="fileInputRef"
        type="file"
        accept="image/jpeg,image/png"
        class="d-none"
        @change="handleFileChange"
      />

      <!-- Dropzone / Selector when no file chosen -->
      <div
        v-if="!selectedFile"
        class="avatar-picker-dropzone pa-6 text-center rounded-lg cursor-pointer"
        @click="triggerFileInput"
      >
        <v-avatar size="56" color="surface-variant" class="mb-3">
          <v-icon icon="mdi-camera-plus-outline" size="28" color="primary" />
        </v-avatar>
        <div class="text-body-2 font-weight-bold mb-1">Select an Image File</div>
        <div class="text-caption text-medium-emphasis mb-3">
          Click here to browse your computer
        </div>
        <v-btn
          variant="tonal"
          color="primary"
          size="small"
          prepend-icon="mdi-folder-image"
          @click.stop="triggerFileInput"
        >
          Choose Photo
        </v-btn>
      </div>

      <!-- Preview when file is selected -->
      <div v-else class="avatar-preview-box pa-4 rounded-lg text-center">
        <div class="d-flex justify-center mb-3">
          <v-avatar size="104" rounded="lg" class="preview-avatar">
            <v-img :src="previewUrl!" cover alt="Selected avatar preview" />
          </v-avatar>
        </div>
        <div class="text-body-2 font-weight-bold text-truncate mb-1">
          {{ selectedFile.name }}
        </div>
        <div class="text-caption font-mono text-medium-emphasis mb-3">
          {{ formatFileSize(selectedFile.size) }}
        </div>

        <v-btn
          variant="text"
          color="secondary"
          size="small"
          prepend-icon="mdi-refresh"
          :disabled="isUploading"
          @click="triggerFileInput"
        >
          Choose Different File
        </v-btn>
      </div>

      <div class="d-flex align-center justify-end ga-3 mt-6">
        <v-btn
          variant="tonal"
          color="secondary"
          :disabled="isUploading"
          @click="emit('update:modelValue', false)"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          prepend-icon="mdi-cloud-upload-outline"
          :loading="isUploading"
          :disabled="!selectedFile || isUploading"
          @click="handleUpload"
        >
          Upload Photo
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.avatar-dialog-card {
  background-color: rgb(var(--v-theme-surface));
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.avatar-picker-dropzone {
  border: 2px dashed rgba(var(--v-border-color), var(--v-border-opacity));
  background-color: rgba(var(--v-theme-surface-variant), 0.3);
  transition: border-color var(--transition-fast), background-color var(--transition-fast);
}

.avatar-picker-dropzone:hover {
  border-color: rgb(var(--v-theme-primary));
  background-color: rgba(var(--v-theme-surface-variant), 0.5);
}

.avatar-preview-box {
  background-color: rgba(var(--v-theme-surface-variant), 0.4);
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.preview-avatar {
  border: 2px solid rgb(var(--v-theme-primary));
}
</style>
