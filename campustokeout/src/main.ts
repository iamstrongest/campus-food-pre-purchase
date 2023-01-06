import { createApp } from 'vue'
import "/public/js/adapt.js"
import App from './App.vue'
import router from './router'


import FontAwesomeIcon from '@/utils/ui/font-awesome-ui.js'
import Elment from '@/utils/ui/element-ui.js'

import pinia from "@/stores/index.js";
const app = createApp(App)

app.use(pinia)
app.use(router)
Elment(app);
app.component('font-awesome-icon', FontAwesomeIcon).mount('#app')
