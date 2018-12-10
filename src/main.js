import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import ViserVue from 'viser-vue'
Vue.use(ElementUI)
Vue.use(ViserVue)
Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
