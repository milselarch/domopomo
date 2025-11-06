import {createApp} from 'vue'
import App from './App.vue'
import Buefy from 'buefy'
import 'buefy/dist/css/buefy.css';

import './style.scss';
import '@fortawesome/fontawesome-free/css/all.css';

import {
  faCheck, faCheckCircle, faInfoCircle, faExclamationTriangle, faExclamationCircle,
  faArrowUp, faAngleRight, faAngleLeft, faAngleDown,
  faEye, faEyeSlash, faCaretDown, faCaretUp, faUpload,
  faHome, faGear, faCircle
} from "@fortawesome/free-solid-svg-icons";
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(
  faCheck, faCheckCircle, faInfoCircle, faExclamationTriangle, faExclamationCircle,
  faArrowUp, faAngleRight, faAngleLeft, faAngleDown,
  faEye, faEyeSlash, faCaretDown, faCaretUp, faUpload,
  faHome, faGear, faCircle
);

const app = createApp(App)
app.component('vue-fontawesome', FontAwesomeIcon);
app.use(Buefy, {
  defaultIconComponent: 'vue-fontawesome',
  defaultIconPack: 'fas',
});

app.mount('#app')
