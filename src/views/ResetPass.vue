<template>
  <div class="form-container">
    <div class="logo-container">Forgot Password</div>

    <form class="form">
      <div class="form-group">
        <label for="email">Email</label>
        <input
          id="email"
          v-model="inputEmail"
          type="text"
          name="email"
          placeholder="Enter your email"
          required=""
        />
      </div>

      <button class="form-submit-btn" type="submit" @click="passwordReset">
        Send Email
      </button>
    </form>

    <p class="signup-link">
      Don't have an account?
      <a href="#/Register" class="signup-link link"> Sign up now</a>
    </p>
  </div>
</template>
<script setup>
import {
  signInWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  getAuth,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useRouter } from "vue-router";
import { reactive, ref, onUpdated } from "vue";
// Sign in the user with email and password
const inputEmail = ref("");
const errMsg = ref("");
const router = useRouter();
const auth = getAuth();

const passwordReset = () => {
  sendPasswordResetEmail(auth, inputEmail.value)
    .then(() => {
      // Password reset email sent!
      console.log("Password reset email sent!");
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);
    });
};
onUpdated(() => {
  console.log(inputEmail.value);
});
</script>
<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap");
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Poppins", sans-serif;
}
.form-container {
  margin-left: auto;
  margin-right: auto;
  margin-top: 30px;
  max-width: 400px;
  background-color: #fff;
  padding: 32px 24px;
  font-size: 14px;
  font-family: inherit;
  color: #212121;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  border-radius: 10px;
  box-shadow:
    0px 0px 3px rgba(0, 0, 0, 0.084),
    0px 2px 3px rgba(0, 0, 0, 0.168);
}
.form-container button:active {
  scale: 0.95;
}

.form-container .logo-container {
  text-align: center;
  font-weight: 600;
  font-size: 18px;
}

.form-container .form {
  display: flex;
  flex-direction: column;
}

.form-container .form-group {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.form-container .form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-container .form-group input {
  width: 90%;
  padding: 12px 16px;
  border-radius: 6px;
  font-family: inherit;
  border: 1px solid #ccc;
}

.form-container .form-group input::placeholder {
  opacity: 0.5;
}

.form-container .form-group input:focus {
  outline: none;
  border-color: #1778f2;
}

.form-container .form-submit-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: inherit;
  color: #fff;
  background-color: #d13400;
  border: none;
  width: 100%;
  padding: 12px 16px;
  font-size: inherit;
  gap: 8px;
  margin: 12px 0;
  cursor: pointer;
  border-radius: 6px;
  box-shadow:
    0px 0px 3px rgba(0, 0, 0, 0.084),
    0px 2px 3px rgba(0, 0, 0, 0.168);
}

.form-container .form-submit-btn:hover {
  background-color: #e63900;
}

.form-container .link {
  color: #1778f2;
  text-decoration: none;
}

.form-container .signup-link {
  align-self: center;
  font-weight: 500;
}

.form-container .signup-link .link {
  font-weight: 400;
}

.form-container .link:hover {
  text-decoration: underline;
}
</style>
