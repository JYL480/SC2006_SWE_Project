<template>
  <div class="button-container" id="navbar">
    <router-link to="/LandingPage">
      <button class="button">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-house-fill"
          viewBox="0 0 16 16"
        >
          <path
            d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L8 2.207l6.646 6.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293z"
          />
          <path
            d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293z"
          />
        </svg>
      </button>
    </router-link>

    <router-link to="/BookmarkPage">
      <button class="button">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-bookmark-star-fill"
          viewBox="0 0 16 16"
        >
          <path
            fill-rule="evenodd"
            d="M2 15.5V2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.74.439L8 13.069l-5.26 2.87A.5.5 0 0 1 2 15.5M8.16 4.1a.178.178 0 0 0-.32 0l-.634 1.285a.18.18 0 0 1-.134.098l-1.42.206a.178.178 0 0 0-.098.303L6.58 6.993c.042.041.061.1.051.158L6.39 8.565a.178.178 0 0 0 .258.187l1.27-.668a.18.18 0 0 1 .165 0l1.27.668a.178.178 0 0 0 .257-.187L9.368 7.15a.18.18 0 0 1 .05-.158l1.028-1.001a.178.178 0 0 0-.098-.303l-1.42-.206a.18.18 0 0 1-.134-.098z"
          />
        </svg>
      </button>
    </router-link>

    <router-link to="/ProfilePage">
      <button class="button">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-person-circle"
          viewBox="0 0 16 16"
        >
          <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
          <path
            fill-rule="evenodd"
            d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
          />
        </svg>
      </button>
    </router-link>
  </div>
</template>

<script setup></script>

<style>

.button-container {
    display: flex;
    background-color
    : hsl(15, 100%, 41%);
    width: 200px;
    height: 40px;
    align-items: center;
    justify-content: space-around;
    border-radius: 10px;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px,
        rgba(0, 73, 144, 0.5) 5px 10px 15px;
    transition: all 0.5s;
    }
.button-container:hover {
    transform: scale(1.25);
    transition: all 0.5s;
    }

.button {
  outline: 0 !important;
  border: 0 !important;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  transition: all ease-in-out 0.3s;
  cursor: pointer;
}

.button:hover {
  transform: translateY(-3px);
}

.icon {
    font-size: 20px;
    }
#navbar {
  position: fixed;
  bottom: 3.5vh;
  left:33vw;
}
</style>
