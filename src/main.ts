import { createApp } from 'vue'
import '@/assets/styles/main.scss'
import App from './App.vue'
import { pinia } from './plugins/pinia'
import { vuetify } from './plugins/vuetify'
import { router } from './plugins/router'

const app = createApp(App)

app.use(pinia)
app.use(vuetify)
app.use(router)

app.mount('#app')
