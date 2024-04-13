<template>
  <div id="spline-viewer-container"></div>
  <section class="container forms">
    <div class="form login">
      <div class="form-content">
        <header>Register</header>
        <form action="#">
          <div class="field input-field">
            <input
              type="username"
              placeholder="Username"
              class="input"
              :required="true"
              v-model="inputUserName"
            />
          </div>
          <div class="field input-field">
            <input
              type="email"
              placeholder="Email"
              class="input"
              :required="true"
              v-model="inputEmail"
            />
          </div>
          <div class="field input-field">
            <input
              type="password"
              placeholder="At least 8 characters, 1 uppercase, 1 lowercase letters & 1 special character"
              class="password"
              :required="true"
              :pattern="
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
              "
              v-model="password"
            />
            <i class="bx bx-hide eye-icon"></i>
            <ul v-if="showPasswordRequirements" class="password-requirements">
              <li v-if="!password.length >= 8">Minimum 8 characters</li>
              <li v-if="!/[a-z]/.test(password)">
                At least one lowercase letter
              </li>
              <li v-if="!/[A-Z]/.test(password)">
                At least one uppercase letter
              </li>
              <li v-if="!/\d/.test(password)">At least one number</li>
              <li v-if="!/[@$!%*?&]/.test(password)">
                At least one special character
              </li>
            </ul>
          </div>
          <div :class="{ 'moved-down': showPasswordRequirements }">
            <div class="form-link">
              <a href="#" class="forgot-pass">Forgot password?</a>
            </div>
          </div>

          <div class="field button-field">
            <button @click="Register()">Register</button>
          </div>
        </form>
        <div class="form-link">
          <span
            >Already have an account?
            <a href="#" class="link signup-link">LogIn</a></span
          >
        </div>
      </div>
      <div class="line"></div>
      <div class="media-options">
        <a href="#" class="field google">
          <img src="../assets/googleIcon.png" class="google-img" />
          <span @click="signInWithGoogle">Login with Google</span>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup>
// Imports
import {
  reactive,
  onUpdated,
  ref,
  onMounted,
  onBeforeUnmount,
  watch,
} from "vue";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useRouter } from "vue-router";
import { faS } from "@fortawesome/free-solid-svg-icons";
import { SplineViewer } from "@splinetool/viewer";
// import fetchAndWriteToFile from "../test.js";

onMounted(() => {
  console.log("Mounted");
  new SplineViewer({
    el: document.getElementById("spline-viewer-container"),
    scene: "https://unpkg.com/@splinetool/viewer/build/spline-viewer.js",
  });
});

// Register
const inputUserName = ref("");
const inputEmail = ref("");
const password = ref("");
const showPasswordRequirements = ref(false);
const router = useRouter();
const auth = getAuth();

watch(password.value, (newPassword, oldPassword) => {});

const Register = () => {
  createUserWithEmailAndPassword(auth, inputEmail.email, password.password)
    .then((data) => {
      // alert('User Created')
      console.log("User Created");
      router.push("/Login");
      con;
    })
    .catch((error) => {
      console.log(error.message);
      alert(error.message);
    });
};

// Google sign in
const signInWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(getAuth(), provider).then((result) => {
    console.log(result.user);
    router.push("/LandingPage");
  });
};

// Debugging
onUpdated(() => {
  // console.log("Username: ", inputUserName.value);
  // console.log("Email: ", inputEmail.value);
  // console.log("Password: ", password.value);
  console.log(password.value);
  if (password.value != "") {
    showPasswordRequirements.value = true;
  }
});

// Test the fethc api thing
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap");
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Poppins", sans-serif;
}
.container {
  height: 80vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  column-gap: 30px;
}
.form {
  position: absolute;
  max-width: 430px;
  width: 100%;
  padding: 30px;
  border-radius: 6px;
  background: #fff;
}
.form.signup {
  opacity: 0;
  pointer-events: none;
}
.forms.show-signup .form.signup {
  opacity: 1;
  pointer-events: auto;
}
.forms.show-signup .form.login {
  opacity: 0;
  pointer-events: none;
}
header {
  font-size: 28px;
  font-weight: 600;
  color: #232836;
  text-align: center;
}
form {
  margin-top: 30px;
}
.form .field {
  position: relative;
  height: 50px;
  width: 100%;
  margin-top: 20px;
  border-radius: 6px;
}
.field input,
.field button {
  height: 100%;
  width: 100%;
  border: none;
  font-size: 16px;
  font-weight: 400;
  border-radius: 6px;
}
.field input {
  outline: none;
  padding: 0 15px;
  border: 1px solid#CACACA;
}
.field input:focus {
  border-bottom-width: 2px;
}
.eye-icon {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  font-size: 18px;
  color: #8b8b8b;
  cursor: pointer;
  padding: 5px;
}
.field button {
  color: #fff;
  background-color: #0171d3;
  transition: all 0.3s ease;
  cursor: pointer;
}
.field button:hover {
  background-color: #016dcb;
}
.form-link {
  text-align: center;
  margin-top: 10px;
}
.form-link span,
.form-link a {
  font-size: 14px;
  font-weight: 400;
  color: #232836;
}
.form a {
  color: #0171d3;
  text-decoration: none;
}
.form-content a:hover {
  text-decoration: underline;
}
.line {
  position: relative;
  height: 1px;
  width: 100%;
  margin: 36px 0;
  background-color: #d4d4d4;
}
.line::before {
  content: "Or";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  color: #8b8b8b;
  padding: 0 15px;
}
.media-options a {
  display: flex;
  align-items: center;
  justify-content: center;
}
a.facebook {
  color: #fff;
  background-color: #4267b2;
}
a.facebook .facebook-icon {
  height: 28px;
  width: 28px;
  color: #0171d3;
  font-size: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
}
.facebook-icon,
img.google-img {
  position: absolute;
  top: 50%;
  left: 15px;
  transform: translateY(-50%);
}
img.google-img {
  height: 20px;
  width: 20px;
  object-fit: cover;
}
a.google {
  border: 1px solid #cacaca;
}
a.google span {
  font-weight: 500;
  opacity: 0.6;
  color: #232836;
}
@media screen and (max-width: 400px) {
  .form {
    padding: 20px 10px;
  }
}
.moved-down {
  transition: transform 0.2s ease-in-out;
  transform: translateY(
    20px
  ); /* Adjust the translation value for desired movement */
}
</style>
../../test.js
