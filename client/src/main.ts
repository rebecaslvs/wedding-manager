import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './index.css'
import { initializeData } from './utils/initialData'

initializeData()

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
