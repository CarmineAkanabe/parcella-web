<script setup lang="ts">
import { computed } from 'vue'
import { useDisplay } from 'vuetify'
import { useAuthStore } from '@/shared/stores/auth'
import { getPrimaryNavForRole, SECONDARY_NAV_ITEMS } from './navConfig'

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
  }>(),
  {
    modelValue: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const { mdAndUp } = useDisplay()
const authStore = useAuthStore()

const isOpen = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val),
})

const primaryItems = computed(() => getPrimaryNavForRole(authStore.role))
const bottomBarItems = computed(() => primaryItems.value.slice(0, 4))
</script>

<template>
  <v-navigation-drawer
    v-if="!mdAndUp"
    v-model="isOpen"
    temporary
    width="272"
    class="mobile-nav-drawer"
  >
    <div class="pa-4 d-flex align-center justify-space-between">
      <div class="d-flex align-center ga-3">
        <v-avatar color="primary" variant="tonal" rounded="lg" size="36">
          <v-icon icon="mdi-cube-send" size="20" />
        </v-avatar>
        <div>
          <div class="text-subtitle-2 font-weight-bold">PARCELLA</div>
          <div class="text-caption font-mono text-medium-emphasis">
            // {{ authStore.role ?? 'CUSTOMER' }}
          </div>
        </div>
      </div>
      <v-btn
        icon="mdi-close"
        variant="text"
        size="small"
        aria-label="Close navigation menu"
        @click="isOpen = false"
      />
    </div>

    <v-divider />

    <v-list nav density="comfortable" class="px-3 pt-3">
      <v-list-item
        v-for="item in primaryItems"
        :key="item.routeName"
        :to="item.to"
        :prepend-icon="item.icon"
        :title="item.title"
        color="primary"
        rounded="lg"
        class="mb-1"
        @click="isOpen = false"
      />
    </v-list>

    <v-divider class="my-2" />

    <v-list nav density="comfortable" class="px-3">
      <v-list-item
        v-for="item in SECONDARY_NAV_ITEMS"
        :key="item.routeName"
        :to="item.to"
        :prepend-icon="item.icon"
        :title="item.title"
        color="primary"
        rounded="lg"
        class="mb-1"
        @click="isOpen = false"
      />
    </v-list>
  </v-navigation-drawer>

  <v-bottom-navigation
    v-if="!mdAndUp"
    grow
    height="60"
    color="primary"
    class="mobile-bottom-bar"
  >
    <v-btn
      v-for="item in bottomBarItems"
      :key="item.routeName"
      :to="item.to"
      :value="item.routeName"
    >
      <v-icon :icon="item.icon" />
      <span class="text-caption">{{ item.title }}</span>
    </v-btn>
  </v-bottom-navigation>
</template>

<style scoped>
.mobile-nav-drawer {
  background-color: rgb(var(--v-theme-surface));
}

.mobile-bottom-bar {
  background-color: rgb(var(--v-theme-surface));
  border-top: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}
</style>
