import {
	BoxGeometry,
	Clock,
	Mesh,
	MeshBasicMaterial,
	PerspectiveCamera,
	Scene,
	WebGLRenderer
} from 'three';
import fullScreenOnDblClick from '#utils/full-screen-on-dblcick';
import resizeOnContainerChange from '#/utils/resize-on-container-change';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

/**
 * @param {HTMLCanvasElement} canvas
 * @param {Element} container
 */
export function setup5(canvas, container) {
	/**
	 * @type {{
	 * 	canvas: {
	 * 		width: number;
	 * 		height: number;
	 * 		aspectRatio: number;
	 * 	},
	 * }}
	 */
	const config = {
		canvas: {
			width: 800,
			height: 600,
			aspectRatio: 800 / 600
		}
	};

	/**
	 * @typedef {[
	 * 	scene: Scene,
	 * 	camera: PerspectiveCamera,
	 * 	controls: OrbitControls,
	 * 	renderer: WebGLRenderer,
	 * 	clock: Clock,
	 * 	cube: Mesh
	 * ]} Entities
	 */

	const ENTITIES_SIZE = 6;
	/** @type {Entities} */
	const entities = /** @type {*} */ (new Array(ENTITIES_SIZE));
	const SCENE_INDEX = 0;
	const CAMERA_INDEX = 1;
	const CONTROLS_INDEX = 2;
	const RENDERER_INDEX = 3;
	const CLOCK_INDEX = 4;
	const CUBE_INDEX = 5;

	entities[SCENE_INDEX] = new Scene();

	entities[CAMERA_INDEX] = new PerspectiveCamera(45, config.canvas.aspectRatio);
	entities[SCENE_INDEX].add(entities[CAMERA_INDEX]);
	entities[CAMERA_INDEX].position.y = 5;
	entities[CAMERA_INDEX].position.z = -10;
	// camera.position.set(2, 1, 4);

	entities[CONTROLS_INDEX] = new OrbitControls(entities[CAMERA_INDEX], canvas);
	entities[CONTROLS_INDEX].enableDamping = true;

	entities[RENDERER_INDEX] = new WebGLRenderer({ canvas });
	entities[RENDERER_INDEX].setSize(config.canvas.width, config.canvas.height);

	entities[CLOCK_INDEX] = new Clock();

	fullScreenOnDblClick(container);
	resizeOnContainerChange({
		camera: entities[CAMERA_INDEX],
		container,
		renderer: entities[RENDERER_INDEX],
		setAspectRatio: (aspectRatio, width, height) => {
			config.canvas.aspectRatio = aspectRatio;
			config.canvas.width = width;
			config.canvas.height = height;
		}
	});

	entities[CUBE_INDEX] = new Mesh(
		new BoxGeometry(1, 1, 1),
		new MeshBasicMaterial({
			color: 0xffff00
		})
	);
	entities[SCENE_INDEX].add(entities[CUBE_INDEX]);
	entities[CUBE_INDEX].position.set(0, 0, 0);

	function tick() {
		const elapsedTime = entities[CLOCK_INDEX].getElapsedTime();

		entities[CUBE_INDEX].position.y = Math.cos(elapsedTime);
		entities[CUBE_INDEX].position.x = Math.sin(elapsedTime);

		entities[CONTROLS_INDEX].update();

		if (elapsedTime % 0.016 > 0) {
			entities[RENDERER_INDEX].render(
				entities[SCENE_INDEX],
				entities[CAMERA_INDEX]
			);
		}

		requestAnimationFrame(tick);
	}

	tick();
}
