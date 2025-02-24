import {
	BoxGeometry,
	Clock,
	Mesh,
	MeshBasicMaterial,
	PerspectiveCamera,
	Scene,
	WebGLRenderer,
} from "three";
import fullScreenOnDblClick from "#utils/full-screen-on-db-click";
import resizeOnContainerChange from "#utils/resize-on-container-change";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import Stats from "three/addons/libs/stats.module.js";

/**
 * @param {HTMLCanvasElement} canvas
 * @param {Element} container
 */
export function template1(canvas, container) {
	/**
	 * @typedef {{
	 * 	canvas: {
	 * 		width: number;
	 * 		height: number;
	 * 		aspectRatio: number;
	 * 	}
	 * }} ConfigBase
	 */

	/**
	 * @typedef {ConfigBase & { _original: ConfigBase }} Config
	 */

	/**
	 * @template T
	 *
	 * @param {T} baseConfig
	 * @returns {T & { _original: T }}
	 */
	function initConfig(baseConfig) {
		return {
			...baseConfig,
			_original: structuredClone(baseConfig),
		};
	}

	/** @type {Config} */
	const config = initConfig({
		canvas: {
			// width: 800,
			// height: 600,
			// aspectRatio: 800 / 600,
			width: window.innerWidth,
			height: window.innerHeight,
			aspectRatio: window.innerWidth / window.innerHeight,
		},
	});

	const scene = new Scene();

	const camera = new PerspectiveCamera(45, config.canvas.aspectRatio, 0.1, 100);
	scene.add(camera);
	camera.position.y = 5;
	camera.position.z = -10;
	// camera.position.set(2, 1, 4);

	const controls = new OrbitControls(camera, canvas);
	controls.enableDamping = true;

	const renderer = new WebGLRenderer({ canvas });
	renderer.setSize(config.canvas.width, config.canvas.height);

	const clock = new Clock();
	const stats = new Stats();
	document.body.appendChild(stats.dom);

	fullScreenOnDblClick(container);
	resizeOnContainerChange({
		camera: camera,
		container,
		renderer: renderer,
		setAspectRatio: (aspectRatio, width, height) => {
			config.canvas.aspectRatio = aspectRatio;
			config.canvas.width = width;
			config.canvas.height = height;
		},
	});

	const cube = new Mesh(
		new BoxGeometry(1, 1, 1),
		new MeshBasicMaterial({
			color: 0xffff00,
		}),
	);
	scene.add(cube);
	cube.position.set(0, 0, 0);

	function tick() {
		const elapsedTime = clock.getElapsedTime();

		cube.position.y = Math.cos(elapsedTime);
		cube.position.x = Math.sin(elapsedTime);

		controls.update();
		renderer.render(scene, camera);
		stats.update();
		requestAnimationFrame(tick);
	}

	tick();
}
