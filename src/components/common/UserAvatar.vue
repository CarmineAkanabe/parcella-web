<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { resolveApiAssetUrl } from '@/shared/utils'

interface Props {
  avatarUrl?: string | null
  fullName?: string | null
  size?: number | string
  rounded?: string | boolean | number
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  avatarUrl: null,
  fullName: null,
  size: 40,
  rounded: 'lg',
  color: 'primary',
})

const imageError = ref(false)

watch(
  () => props.avatarUrl,
  () => {
    imageError.value = false
  },
)

const resolvedUrl = computed(() => {
  return resolveApiAssetUrl(props.avatarUrl)
})

const initials = computed(() => {
  const name = props.fullName?.trim()
  if (!name) return 'PC'
  const parts = name.split(/\s+/)
  const first = parts[0]?.[0] ?? 'P'
  const second = parts[1]?.[0] ?? ''
  return `${first}${second}`.toUpperCase()
})
</script>

<template>
  <v-avatar
    :size="size"
    :rounded="rounded as never"
    :color="color"
    class="user-avatar-root"
  >
    <v-img
      v-if="resolvedUrl && !imageError"
      :src="resolvedUrl"
      :alt="fullName || 'User avatar'"
      cover
      @error="imageError = true"
    >
      <template #placeholder>
        <div class="d-flex align-center justify-center fill-height bg-surface-variant">
          <v-progress-circular indeterminate size="16" width="2" color="primary" />
        </div>
      </template>
    </v-img>
    <span v-else class="user-avatar__initials font-weight-bold">
      {{ initials }}
    </span>
  </v-avatar>
</template>

<style scoped>
.user-avatar-root {
  overflow: hidden;
  user-select: none;
  flex-shrink: 0;
}

.user-avatar__initials {
  letter-spacing: 0.5px;
}
</style>
