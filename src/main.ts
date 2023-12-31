import { createApp } from 'vue'
import App from './App.vue'
import router from './router/router'

// unocss
import 'virtual:uno.css'

// tailwind reset style
import '@unocss/reset/tailwind.css'

// style
import './style.css'

createApp(App)
  .use(router)
  .mount('#app')
