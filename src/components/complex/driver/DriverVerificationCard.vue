<script setup lang="ts">
import { computed, ref } from 'vue'
import { AppCard, ErrorBanner, StatusPill } from '@/components/common'
import { uploadLicenseApi } from '@/features/driver'
import { useToast } from '@/shared/composables/useToast'
import { useAuthStore } from '@/shared/stores/auth'
import type { UserResponse } from '@/shared/types'
import { validateImageFile } from '@/shared/utils'

const emit = defineEmits<{
  uploaded: [user: UserResponse]
}>()

const authStore = useAuthStore()
const toast = useToast()

const fileInputRef = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const previewUrl = ref<string | null>(null)
const errorMessage = ref<string | null>(null)
const isUploading = ref(false)
const uploadedInSession = ref(false)
const showReplacePicker = ref(false)

const driver = computed(() => authStore.user?.driver)
const verificationStatus = computed(() => driver.value?.verificationStatus ?? 'PENDING')
const verificationNote = computed(() => driver.value?.verificationNote)

function triggerFileInput(): void {
  fileInputRef.value?.click()
}

function handleFileChange(event: Event): void {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  const validationError = validateImageFile(file, 5 * 1024 * 1024)
  if (validationError) {
    errorMessage.value = validationError
    clearSelection()
    return
  }

  errorMessage.value = null
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }
  selectedFile.value = file
  previewUrl.value = URL.createObjectURL(file)
}

function clearSelection(): void {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = null
  }
  selectedFile.value = null
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

async function handleUpload(): Promise<void> {
  if (!selectedFile.value) return

  isUploading.value = true
  errorMessage.value = null
  try {
    const updated = await uploadLicenseApi(selectedFile.value)
    authStore.user = updated
    uploadedInSession.value = true
    showReplacePicker.value = false
    clearSelection()
    toast.success('Driver license uploaded. Dossier is now pending admin review.')
    emit('uploaded', updated)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to upload license document'
    errorMessage.value = msg
  } finally {
    isUploading.value = false
  }
}
</script>

<template>
  <AppCard class="verification-card fill-height">
    <div class="d-flex align-center justify-space-between mb-3">
      <div class="d-flex align-center ga-2">
        <v-icon icon="mdi-card-account-details-outline" color="primary" size="22" />
        <h3 class="text-subtitle-1 font-weight-bold">Driver License Verification</h3>
      </div>
      <StatusPill :status="verificationStatus" size="small" />
    </div>

    <!-- Status: REJECTED -->
    <v-alert
      v-if="verificationStatus === 'REJECTED'"
      type="error"
      variant="tonal"
      density="comfortable"
      class="mb-4"
    >
      <div class="text-subtitle-2 font-weight-bold">Application Requires Revision</div>
      <div class="text-body-2 mt-1">
        {{ verificationNote || 'Your uploaded driver credentials were not accepted. Please upload a clear document.' }}
      </div>
      <div class="text-caption mt-2 font-weight-semibold">
        Uploading a replacement license will clear the note and resubmit your dossier for review.
      </div>
    </v-alert>

    <!-- Status: PENDING -->
    <v-alert
      v-else-if="verificationStatus === 'PENDING'"
      type="warning"
      variant="tonal"
      density="comfortable"
      class="mb-4"
    >
      <div class="text-subtitle-2 font-weight-bold">Verification In Progress</div>
      <div class="text-body-2 mt-1">
        Your account is awaiting compliance approval from platform administrators. Ensure your official driver's license is uploaded.
      </div>
      <div v-if="uploadedInSession" class="mt-2 font-mono text-caption text-success font-weight-bold">
        ✓ License photo uploaded in this session &bull; Queued for admin review
      </div>
    </v-alert>

    <!-- Status: APPROVED -->
    <v-alert
      v-else-if="verificationStatus === 'APPROVED'"
      type="success"
      variant="tonal"
      density="comfortable"
      class="mb-4"
    >
      <div class="text-subtitle-2 font-weight-bold">Compliance Status: Approved</div>
      <div class="text-body-2 mt-1">
        Your courier license is verified. You are authorized to accept parcel delivery assignments across Douala and Yaoundé.
      </div>
    </v-alert>

    <!-- Error message if upload failed -->
    <ErrorBanner
      v-if="errorMessage"
      title="License Upload Failed"
      :detail="errorMessage"
      :retryable="false"
      class="mb-3"
    />

    <!-- Upload section for PENDING, REJECTED, or when APPROVED user clicks replace -->
    <div v-if="verificationStatus !== 'APPROVED' || showReplacePicker">
      <input
        ref="fileInputRef"
        type="file"
        accept="image/jpeg,image/png"
        class="d-none"
        @change="handleFileChange"
      />

      <div
        v-if="!selectedFile"
        class="license-dropzone pa-5 text-center rounded-lg cursor-pointer mb-3"
        @click="triggerFileInput"
      >
        <v-icon icon="mdi-file-upload-outline" size="32" color="primary" class="mb-2" />
        <div class="text-body-2 font-weight-bold">Upload Driver's License Photo</div>
        <div class="text-caption text-medium-emphasis">
          JPEG or PNG format, maximum 5 MB. Make sure all text and photo are sharp and legible.
        </div>
      </div>

      <div v-else class="license-selected-box pa-4 rounded-lg mb-3">
        <div class="d-flex align-center justify-space-between mb-2">
          <div class="d-flex align-center ga-2 min-w-0">
            <v-icon icon="mdi-file-check-outline" color="success" size="24" />
            <div class="overflow-hidden">
              <div class="text-body-2 font-weight-bold text-truncate">{{ selectedFile.name }}</div>
              <div class="text-caption font-mono text-medium-emphasis">
                {{ (selectedFile.size / (1024 * 1024)).toFixed(2) }} MB
              </div>
            </div>
          </div>
          <v-btn icon="mdi-close" variant="text" size="small" :disabled="isUploading" @click="clearSelection" />
        </div>

        <div v-if="previewUrl" class="license-thumbnail mb-3 overflow-hidden rounded">
          <v-img :src="previewUrl" max-height="160" cover alt="License preview" />
        </div>

        <div class="d-flex align-center justify-end ga-2">
          <v-btn variant="tonal" color="secondary" size="small" :disabled="isUploading" @click="clearSelection">
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            variant="flat"
            size="small"
            prepend-icon="mdi-cloud-upload"
            :loading="isUploading"
            @click="handleUpload"
          >
            Submit License
          </v-btn>
        </div>
      </div>
    </div>

    <!-- Toggle replace button for APPROVED status -->
    <div v-if="verificationStatus === 'APPROVED' && !showReplacePicker" class="text-right">
      <v-btn
        variant="text"
        size="small"
        color="secondary"
        prepend-icon="mdi-file-refresh-outline"
        @click="showReplacePicker = true"
      >
        Update / Replace License
      </v-btn>
    </div>
  </AppCard>
</template>

<style scoped>
.verification-card {
  background-color: rgb(var(--v-theme-surface));
}

.license-dropzone {
  border: 2px dashed rgba(var(--v-border-color), var(--v-border-opacity));
  background-color: rgba(var(--v-theme-surface-variant), 0.35);
  transition: border-color var(--transition-fast), background-color var(--transition-fast);
}

.license-dropzone:hover {
  border-color: rgb(var(--v-theme-primary));
  background-color: rgba(var(--v-theme-surface-variant), 0.55);
}

.license-selected-box {
  background-color: rgba(var(--v-theme-surface-variant), 0.4);
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.license-thumbnail {
  border: 1px solid var(--border-subtle);
}
</style>
