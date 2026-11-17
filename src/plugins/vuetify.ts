import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify, type ThemeDefinition } from 'vuetify'

const lightTheme: ThemeDefinition = {
  dark: false,
  colors: {
    background: '#FAF8F5',
    surface: '#F3EFEA',
    'surface-bright': '#FFFFFF',
    'surface-variant': '#E6E0D6',
    'on-surface-variant': '#4A525D',
    primary: '#D95D39',
    'primary-darken-1': '#B84625',
    secondary: '#2C353D',
    'secondary-darken-1': '#1B2228',
    success: '#15803D',
    warning: '#B45309',
    error: '#B91C1C',
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
    },
    VSelect: {
      variant: 'outlined',
      density: 'comfortable',
      color: 'primary',
    },
    VTextarea: {
      variant: 'outlined',
      density: 'comfortable',
      color: 'primary',
    },
    VChip: {
      rounded: 'md',
    },
  },
})

export default vuetify
