<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import { EmptyState, ErrorBanner } from '@/components/common'
import { fetchAdminDriverLicenseBlobApi } from '@/features/admin'

interface Props {
  licenseImageUrl?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  licenseImageUrl: null,
})

const blobUrl = ref<string | null>(null)
const isLoading = ref(false)
const loadError = ref<unknown>(null)
const zoomLevel = ref(1)
const rotation = ref(0)

function revokeCurrentBlob(): void {
  if (blobUrl.value) {
    URL.revokeObjectURL(blobUrl.value)
    blobUrl.value = null
  }
}

async function loadBlob(): Promise<void> {
  if (!props.licenseImageUrl) {
    revokeCurrentBlob()
    isLoading.value = false
    loadError.value = null
    return
  }

  isLoading.value = true
  loadError.value = null
  revokeCurrentBlob()

  try {
    const blob = await fetchAdminDriverLicenseBlobApi(props.licenseImageUrl)
    blobUrl.value = URL.createObjectURL(blob)
  } catch (err: unknown) {
    loadError.value = err
  } finally {
    isLoading.value = false
  }
}

watch(
  () => props.licenseImageUrl,
  () => {
    zoomLevel.value = 1
    rotation.value = 0
    loadBlob()
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  revokeCurrentBlob()
})

function zoomIn(): void {
  zoomLevel.value = Math.min(3, +(zoomLevel.value + 0.25).toFixed(2))
}

function zoomOut(): void {
  zoomLevel.value = Math.max(0.5, +(zoomLevel.value - 0.25).toFixed(2))
}

function rotate(): void {
  rotation.value = (rotation.value + 90) % 360
}

function resetTransform(): void {
  zoomLevel.value = 1
  rotation.value = 0
}

function openInNewTab(): void {
  if (blobUrl.value) {
    window.open(blobUrl.value, '_blank')
  }
}
</script>

<template>
  <div class="license-viewer-container d-flex flex-column h-100 rounded-lg overflow-hidden">
    <!-- Header / Inspection Toolbar -->
    <div class="viewer-toolbar px-4 py-2 d-flex align-center justify-space-between flex-wrap ga-2">
      <div class="d-flex align-center ga-2">
        <v-icon icon="mdi-card-account-details-outline" size="20" color="primary" />
        <span class="text-caption font-weight-bold text-uppercase">
          Official Driver License Inspection
        </span>
      </div>

      <div v-if="blobUrl" class="d-flex align-center ga-1">
        <v-btn
          icon="mdi-magnify-plus-outline"
          variant="text"
          size="small"
          aria-label="Zoom in"
          @click="zoomIn"
        />
        <v-btn
          icon="mdi-magnify-minus-outline"
          variant="text"
          size="small"
          aria-label="Zoom out"
          @click="zoomOut"
        />
        <v-btn
          icon="mdi-rotate-right"
          variant="text"
          size="small"
          aria-label="Rotate image"
          @click="rotate"
        />
        <v-btn
          icon="mdi-restore"
          variant="text"
          size="small"
          aria-label="Reset zoom and rotation"
          @click="resetTransform"
        />
        <v-btn
          icon="mdi-open-in-new"
          variant="text"
          size="small"
          aria-label="Open full image in new tab"
          @click="openInNewTab"
        />
        <span class="text-caption font-mono text-medium-emphasis ml-2">
          {{ Math.round(zoomLevel * 100) }}%
        </span>
      </div>
    </div>

    <!-- Viewer Stage -->
    <div class="viewer-stage flex-grow-1 position-relative d-flex align-center justify-center pa-4">
      <!-- Loading Skeleton -->
      <div v-if="isLoading" class="text-center py-12">
        <v-progress-circular indeterminate color="primary" size="48" width="3" />
        <div class="text-caption text-medium-emphasis mt-3">
          Decrypting courier license image stream...
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="loadError" class="pa-4 w-100">
        <ErrorBanner
          title="Could not load license document"
          detail="The authenticated document stream could not be fetched from the server."
          @retry="loadBlob"
        />
      </div>

      <!-- Empty State: No license uploaded yet -->
      <EmptyState
        v-else-if="!props.licenseImageUrl"
        icon="mdi-file-alert-outline"
        title="No Driver License Uploaded"
        description="The courier applicant has not submitted an official driver license document yet. Applications cannot be approved until a valid document is on file."
        class="py-12"
      />

      <!-- Image Canvas -->
      <div
        v-else-if="blobUrl"
        class="image-canvas-wrapper w-100 h-100 d-flex align-center justify-center overflow-hidden"
      >
        <img
          :src="blobUrl"
          alt="Courier driver license inspection"
          class="license-img rounded"
          :style="{
            transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
          }"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.license-viewer-container {
  background-color: rgba(var(--v-theme-surface-variant), 0.25);
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  min-height: 420px;
}

.viewer-toolbar {
  background-color: rgb(var(--v-theme-surface));
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.viewer-stage {
  min-height: 380px;
  background-color: rgba(0, 0, 0, 0.08);
}

.image-canvas-wrapper {
  user-select: none;
}

.license-img {
  max-width: 90%;
  max-height: 360px;
  object-fit: contain;
  transition: transform var(--transition-fast);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
}
</style>
