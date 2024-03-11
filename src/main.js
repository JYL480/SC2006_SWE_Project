import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import { library } from "@fortawesome/fontawesome-svg-core";
// import { faTwitter } from '@fortawesome/free-brands-svg-icons'
import {
  faUser,
  faCartShopping,
  faRightFromBracket,
  faUserPlus,
  faLock,
  faEnvelope,
  fa,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faGoogle,
  faMeta,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(
  faUser,
  faCartShopping,
  faRightFromBracket,
  faUserPlus,
  faLock,
  faEnvelope,
  faGoogle,
  faFacebook
);
const app = createApp(App);

app.use(router).component("font-awesome-icon", FontAwesomeIcon);
app.mount("#app");
