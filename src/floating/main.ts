import { createApp } from "vue";
import FloatApp from "./FloatApp.vue";
import "../assets/styles/index.css";

createApp(FloatApp)
  .mount("#app")
  .$nextTick(() => {
    postMessage({ payload: "removeLoading" }, "*");
  });