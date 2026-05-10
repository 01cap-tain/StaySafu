import { urlAnalysis, init } from "./frontend/app.js";
import { internetSpeedInit, addColor } from "./frontend/InternetSpeed.js";
import "./style-sheet/index.css";
import "./style-sheet/internetSpeed.css";
import "./style-sheet/spinner.css";

// window.addEventListener("DOMContentLoaded", init);
// window.addEventListener("DOMContentLoaded", internetSpeedInit);

// // init();
// // init();
// pageManager("/internetSpeed.html", internetSpeedInit());
// pageManager("/", init());
addColor();
const global = {
  currentPage: window.location.pathname,
};

switch (global.currentPage) {
  case "/":
    init();
    break;
  case "/internetSpeed.html":
    internetSpeedInit();
    break;
}
