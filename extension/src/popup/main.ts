import Buefy from 'buefy'
import 'buefy/dist/css/buefy.css'

import { createApp } from 'vue'
import Popper from 'vue3-popper'

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'
/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
/* import specific icons */
import {
  faGear, faHome, faMagnifyingGlass, faMoon, faPlus, faSun,
} from '@fortawesome/free-solid-svg-icons'

import App from './Popup.vue'
import { setupApp } from '~/logic/common-setup'
import '~/styles/theme.scss'
import '~/styles/main.css'
import { StoreKey, store } from '~/storage/store'

library.add(
  faGear, faMagnifyingGlass, faPlus, faHome,
  faSun, faMoon,
)

const app = createApp(App)
app.use(Buefy, {
  defaultIconComponent: 'vue-fontawesome',
  defaultIconPack: 'fas',
})

app.use(store, StoreKey)
app.component('vue-fontawesome', FontAwesomeIcon)
app.component('Popper', Popper)

setupApp(app)
app.mount('#app')
