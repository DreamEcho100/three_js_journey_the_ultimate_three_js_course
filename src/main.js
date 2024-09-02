import { basicAnimations } from "./5-basic-animation copy/index.js";
import "./style.css";

const appElement = /** @type {HTMLDivElement} */ document.querySelector("#app");

if (!appElement) {
  throw new Error("App element is not found");
}

appElement.innerHTML = `
  <canvas id="webgl"></canvas>
`;

const canvas = /** @type {HTMLCanvasElement | null} */ (
  document.querySelector("canvas#webgl")
);

if (!canvas) {
  throw new Error("Canvas is not found");
}

basicAnimations(canvas);
