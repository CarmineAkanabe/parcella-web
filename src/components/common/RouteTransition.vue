<script setup lang="ts">
// RouteTransition: wraps route views in a smooth 180ms cubic-bezier transition
// while respecting prefers-reduced-motion.
</script>

<template>
  <Transition name="route-fade" mode="out-in">
    <slot />
  </Transition>
</template>

<style scoped lang="scss">
.route-fade-enter-active,
.route-fade-leave-active {
  transition:
    opacity 180ms var(--ease-out-expo, cubic-bezier(0.16, 1, 0.3, 1)),
    transform 180ms var(--ease-out-expo, cubic-bezier(0.16, 1, 0.3, 1));
}

.route-fade-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

.route-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

@media (prefers-reduced-motion: reduce) {
  .route-fade-enter-active,
  .route-fade-leave-active {
    transition: none !important;
  }

  .route-fade-enter-from,
  .route-fade-leave-to {
    opacity: 1;
    transform: none !important;
  }
}
</style>
