<script setup lang="ts">
import { computed, watch, type Component } from 'vue'
import { useRoute } from 'vue-router'
import { useTheme } from 'vuetify'
import { useThemeStore } from '@/shared/stores/theme'
import PublicLayout from '@/layouts/PublicLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import ErrorLayout from '@/layouts/ErrorLayout.vue'
import AppToast from '@/components/common/AppToast.vue'

const route = useRoute()
const theme = useTheme()
const themeStore = useThemeStore()

themeStore.init()

watch(
  () => themeStore.resolvedTheme,
  (val) => {
    if (typeof theme.change === 'function') {
      theme.change(val)
    } else {
      theme.global.name.value = val
    }
  },
  { immediate: true },
)

const layoutMap: Record<string, Component> = {
  public: PublicLayout,
  auth: AuthLayout,
  error: ErrorLayout,
}

const layoutComponent = computed<Component>(() => {
  const layoutKey = (route.meta?.layout as string | undefined) ?? 'auth'
  return layoutMap[layoutKey] ?? AuthLayout
})
</script>

<template>
  <v-app>
    <component :is="layoutComponent">
      <router-view />
    </component>
    <AppToast />
  </v-app>
</template>
