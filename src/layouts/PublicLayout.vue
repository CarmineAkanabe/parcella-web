<script setup lang="ts">
import PublicHeaderShell from '@/shells/PublicHeaderShell.vue'
import FooterShell from '@/shells/FooterShell.vue'
import { RouteTransition } from '@/components/common'
</script>

<template>
  <v-main class="public-layout d-flex flex-column justify-space-between">
    <PublicHeaderShell />

    <div class="public-layout__body flex-grow-1 d-flex flex-column">
      <RouteTransition>
        <slot />
      </RouteTransition>
    </div>

    <FooterShell />
  </v-main>
</template>

<style scoped>
.public-layout {
  min-height: 100vh;
  background-color: rgb(var(--v-theme-background));
}
</style>
