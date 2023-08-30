import { createApp } from './main'
import { createPinia } from 'pinia'
import UI from './UI';
import '@ui/theme/default/index.css'

const pinia = createPinia()

const { app } = createApp()

app.use(pinia)
UI.install(app)
app.mount('#app')
