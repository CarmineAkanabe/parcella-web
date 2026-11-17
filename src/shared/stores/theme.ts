import { defineStore } from 'pinia'

export type ThemePreference = 'light' | 'dark' | 'system'

export const THEME_STORAGE_KEY = 'parcella_theme'

function readStoredPreference(): ThemePreference {
  if (typeof localStorage === 'undefined') return 'light'
  const raw = localStorage.getItem(THEME_STORAGE_KEY)
  if (raw === 'light' || raw === 'dark' || raw === 'system') {
    return raw
  }
  return 'light'
}

function getSystemDark(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export const useThemeStore = defineStore('theme', {
  state: () => ({
    preference: readStoredPreference() as ThemePreference,
    systemDark: getSystemDark(),
    initialized: false,
  }),

  getters: {
    resolvedTheme(state): 'light' | 'dark' {
      if (state.preference === 'system') {
        return state.systemDark ? 'dark' : 'light'
      }
      return state.preference
    },

    isDark(): boolean {
      return this.resolvedTheme === 'dark'
    },
  },

  actions: {
    init(): void {
      if (this.initialized) return
      this.preference = readStoredPreference()
      this.systemDark = getSystemDark()

      if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        const listener = (event: MediaQueryListEvent) => {
          this.systemDark = event.matches
        }
        if (typeof mediaQuery.addEventListener === 'function') {
          mediaQuery.addEventListener('change', listener)
        }
      }

      this.initialized = true
    },

    setPreference(pref: ThemePreference): void {
      this.preference = pref
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(THEME_STORAGE_KEY, pref)
      }
    },

    toggleTheme(): void {
      const next: ThemePreference = this.resolvedTheme === 'dark' ? 'light' : 'dark'
      this.setPreference(next)
    },
  },
})
