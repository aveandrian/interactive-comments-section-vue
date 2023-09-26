import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import specific icons */
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons'
library.add(faMinus, faPlus)


createApp(App).mount('#app')
