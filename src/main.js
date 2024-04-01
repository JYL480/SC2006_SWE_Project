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
  databaseURL: "https://sc2006mapapp-default-rtdb.asia-southeast1.firebasedatabase.app",
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

const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);  // Firebase Realtime Database (Not FireStore)

const app = createApp(App);

app.component("FontAwesomeIcon", FontAwesomeIcon);
app.use(router);
app.mount("#app");

export { database };    // Can be imported from other scripts with something like `import { [var] } from "src/main.js"`
