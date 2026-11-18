<script setup lang="ts">
interface Props {
  showWordmark?: boolean
  subtitle?: string
  size?: 'sm' | 'md' | 'lg'
}

withDefaults(defineProps<Props>(), {
  showWordmark: true,
  subtitle: undefined,
  size: 'md',
})
</script>

<template>
  <div class="app-logo d-inline-flex align-center ga-2 select-none" :class="`app-logo--${size}`">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 170 165"
      class="app-logo__mark flex-shrink-0"
      role="img"
      aria-label="Parcella parcel mark"
    >
      <g fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path d="M27 54 78 27l51 27v61l-51 28-51-28Z" class="logo-stroke-primary" stroke-width="10" />
        <path d="m27 54 51 29 51-29M78 83v60" class="logo-stroke-primary" stroke-width="9" />
        <path d="m53 40 51 29" class="logo-stroke-emerald" stroke-width="9" />
        <path d="M129 84h27m-11-12 12 12-12 12" class="logo-stroke-emerald" stroke-width="9" />
        <path d="M8 76h12M13 98h7" class="logo-stroke-primary" stroke-width="8" />
      </g>
    </svg>

    <div v-if="showWordmark" class="d-flex flex-column min-w-0">
      <div class="d-flex align-center ga-1">
        <span class="app-logo__word font-weight-extrabold text-high-emphasis lh-none">
          Parcella
        </span>
      </div>
      <span v-if="subtitle" class="app-logo__sub text-caption text-medium-emphasis whitespace-nowrap">
        {{ subtitle }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.app-logo--sm .app-logo__mark {
  width: 30px;
  height: 30px;
}

.app-logo--md .app-logo__mark {
  width: 36px;
  height: 36px;
}

.app-logo--lg .app-logo__mark {
  width: 44px;
  height: 44px;
}

.app-logo--sm .app-logo__word {
  font-size: 16px;
  letter-spacing: -0.03em;
}

.app-logo--md .app-logo__word {
  font-size: 19px;
  letter-spacing: -0.03em;
}

.app-logo--lg .app-logo__word {
  font-size: 23px;
  letter-spacing: -0.035em;
}

.app-logo__sub {
  font-size: 10.5px !important;
  line-height: 1.25;
}

.lh-none {
  line-height: 1.05;
}

.whitespace-nowrap {
  white-space: nowrap;
}

.logo-stroke-primary {
  stroke: rgb(var(--v-theme-primary));
}

.logo-stroke-emerald {
  stroke: rgb(var(--v-theme-success));
}
</style>
