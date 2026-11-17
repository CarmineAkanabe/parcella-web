import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify, type ThemeDefinition } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const lightTheme: ThemeDefinition = {
  dark: false,
  colors: {
    background: '#FAF8F5',
    surface: '#FFFFFF',
    'surface-bright': '#FFFFFF',
    'surface-variant': '#F3EFEA',
    'on-surface': '#1F242A',
    'on-surface-variant': '#5A646E',
    primary: '#C54F2C',
    'primary-darken-1': '#A43716',
    secondary: '#2C353D',
    'secondary-darken-1': '#171B21',
    success: '#1E684D',
    warning: '#B45309',
    error: '#BA1A1A',
    info: '#0369A1',
  },
}

const darkTheme: ThemeDefinition = {
  dark: true,
  colors: {
    background: '#0F1216',
    surface: '#171B21',
    'surface-bright': '#1F242D',
    'surface-variant': '#262C36',
    'on-surface': '#F1F5F9',
    'on-surface-variant': '#94A3B8',
    primary: '#E07A2E',
    'primary-darken-1': '#C6631B',
    secondary: '#94A3B8',
    'secondary-darken-1': '#64748B',
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#38BDF8',
  },
}

export const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: lightTheme,
      dark: darkTheme,
    },
  },
  defaults: {
    VBtn: {
      rounded: 'lg',
      elevation: 0,
    },
    VCard: {
      rounded: 'lg',
      elevation: 0,
    },
    VTextField: {
      variant: 'outlined',
      density: 'comfortable',
      color: 'primary',
      hideDetails: 'auto',
    },
    VSelect: {
      variant: 'outlined',
      density: 'comfortable',
      color: 'primary',
      hideDetails: 'auto',
    },
    VTextarea: {
      variant: 'outlined',
      density: 'comfortable',
      color: 'primary',
      hideDetails: 'auto',
    },
    VCheckbox: {
      color: 'primary',
      density: 'compact',
      hideDetails: 'auto',
    },
    VChip: {
      rounded: 'md',
    },
  },
})

export default vuetify
