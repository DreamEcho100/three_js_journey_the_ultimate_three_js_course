import { setup4 } from './lessons/4';
import './style.css';

const appElement = /** @type {HTMLDivElement} */ document.querySelector('#app');

if (!appElement) {
	throw new Error('App element is not found');
}

appElement.innerHTML = `
  <canvas id="webgl" style="width: 100%; height: 100%;"></canvas>
`;

const canvas = /** @type {HTMLCanvasElement | null} */ (
	document.querySelector('canvas#webgl')
);

if (!canvas) {
	throw new Error('Canvas is not found');
}

setup4(canvas, appElement);
