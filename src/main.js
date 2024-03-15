import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index.js";

import { library } from "@fortawesome/fontawesome-svg-core";
// import { faTwitter } from '@fortawesome/free-brands-svg-icons'
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, set } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDXZBjrWEXvWjrLMxl8hHoMLHWXIAFCY-8",
  authDomain: "sc2006mapapp.firebaseapp.com",
  projectId: "sc2006mapapp",
  storageBucket: "sc2006mapapp.appspot.com",
  messagingSenderId: "623622689953",
  appId: "1:623622689953:web:880d2ad2c3aa03394b8ce0",
  measurementId: "G-FVQ918BFWF",
};

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

initializeApp(firebaseConfig);
const app = createApp(App);

app.component("font-awesome-icon", FontAwesomeIcon);
app.use(router);
app.mount("#app");
