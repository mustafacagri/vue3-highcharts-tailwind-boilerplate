import '@/assets/styles/css/index.css'

import { initPlugins } from './plugins'
import { createApp } from 'vue/dist/vue.esm-bundler' // https://github.com/fengyuanchen/vue-feather/issues/8

import App from './App.vue'

const app = createApp(App)

initPlugins(app)

app.mount('#app')
