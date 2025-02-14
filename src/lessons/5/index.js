import {
	BoxGeometry,
	Clock,
	Mesh,
	MeshBasicMaterial,
	PerspectiveCamera,
	Scene,
	WebGLRenderer,
	TextureLoader,
	Texture
} from 'three';
import fullScreenOnDblClick from '#utils/full-screen-on-dblcick';
import resizeOnContainerChange from '#utils/resize-on-container-change';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

const textureLoader = new TextureLoader();
/**
 * @template T
 *
 * @param {T[]} items
 * @returns {T extends any[] ? (T[1] infer Name ? Record<Name, Texture> : never): never}
 */
function textureLoaderHandler(items) {
	/** @type {Record<string, any>} */
	const loadedItems = {};

	for (const item of items) {
		loadedItems[item[1]] = textureLoader.load(item[0]);
	}

	return loadedItems;
}

const { doorColorTexture1, doorAlphaTexture } = textureLoaderHandler([
	['/textures/door/color.jpg', 'doorColorTexture1'],
	['/textures/door/alpha.jpg', 'doorAlphaTexture']
]);
doorColorTexture1;
doorAlphaTexture;

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

	const scene = new Scene();

	const camera = new PerspectiveCamera(45, config.canvas.aspectRatio);
	scene.add(camera);
	camera.position.x = 4;
	camera.position.y = 2;
	camera.position.z = 5;

	const controls = new OrbitControls(camera, canvas);
	controls.enableDamping = true;

	const renderer = new WebGLRenderer({ canvas });
	renderer.setSize(config.canvas.width, config.canvas.height);

	const clock = new Clock();

	fullScreenOnDblClick(container);
	resizeOnContainerChange({
		camera: camera,
		container,
		renderer: renderer,
		setAspectRatio: (aspectRatio, width, height) => {
			config.canvas.aspectRatio = aspectRatio;
			config.canvas.width = width;
			config.canvas.height = height;
		}
	});

	const cube = new Mesh(
		new BoxGeometry(1, 1, 1),
		new MeshBasicMaterial({
			color: 0xffff00
		})
	);
	scene.add(cube);
	cube.position.set(0, 0, 0);

	function tick() {
		const elapsedTime = clock.getElapsedTime();

		cube.position.y = Math.cos(elapsedTime);
		cube.position.x = Math.sin(elapsedTime);

		controls.update();

		if (elapsedTime % 0.016 > 0) {
			renderer.render(scene, camera);
		}

		requestAnimationFrame(tick);
	}

	tick();
}
