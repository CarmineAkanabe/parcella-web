<script setup lang="ts">
import { ref } from 'vue'
import SidebarShell from '@/shells/SidebarShell.vue'
import MobileNavShell from '@/shells/MobileNavShell.vue'
import HeaderShell from '@/shells/HeaderShell.vue'
import { RouteTransition } from '@/components/common'

const mobileDrawerOpen = ref(false)
</script>

<template>
  <SidebarShell />
  <MobileNavShell v-model="mobileDrawerOpen" />
  <HeaderShell @toggle-mobile="mobileDrawerOpen = !mobileDrawerOpen" />

  <v-main class="auth-layout-main">
    <v-container fluid class="pa-4 pa-md-6 max-w-workspace">
      <RouteTransition>
        <slot />
      </RouteTransition>
    </v-container>
  </v-main>
</template>

<style scoped>
.auth-layout-main {
  min-height: 100vh;
  background-color: rgb(var(--v-theme-background));
}

.max-w-workspace {
  max-width: 1440px;
}
</style>
