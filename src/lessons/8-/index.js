import {
	Clock,
	ConeGeometry,
	DirectionalLight,
	Mesh,
	MeshToonMaterial,
	NearestFilter,
	PerspectiveCamera,
	Scene,
	TorusGeometry,
	TorusKnotGeometry,
	WebGLRenderer,
} from "three";
("db-click");
import fullScreenOnDblClick from "#utils/full-screen-on-db-click";
import resizeOnContainerChange from "#utils/resize-on-container-change";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { guiAddMany, LIL_GUI_TYPES } from "#utils/lil-gui-helpers.js";
import GUI from "lil-gui";
import { loadTextures_obj } from "#utils/texture-loader-handler.js";

/**
 * @param {Element} container
 */
function setupHTML(container) {
	const setupId = Math.random().toString(36).slice(2);

	const content = /** html */ `
    <section class="section pointer-events-on-children-only" data-setup-id="${setupId}">
        <h1>My Portfolio</h1>
    </section>
    <section class="section pointer-events-on-children-only" data-setup-id="${setupId}">
        <h2>My projects</h2>
    </section>
    <section class="section pointer-events-on-children-only" data-setup-id="${setupId}">
        <h2>Contact me</h2>
    </section>
		<style data-setup-id="${setupId}">
			* {
					margin: 0;
					padding: 0;
			}

			html {
					background: #1e1a20;
			}

			// .pointer-events-on-children-only {
			// 	pointer-events: none;
			// }
			// .pointer-events-on-children-only > * {
			// 	pointer-events: auto;
			// }

			.section {
					display: flex;
					align-items: center;
					height: 100vh;
					position: relative;
					font-family: 'Cabin', sans-serif;
					color: #ffeded;
					text-transform: uppercase;
					font-size: 7vmin;
					padding-left: 10%;
					padding-right: 10%;
			}
			.section:nth-child(odd) {
					justify-content: flex-end;
			}

			.webgl {
					position: fixed;
					top: 0;
					left: 0;
					outline: none;
			}
					</style>
		`;

	// insert after the container
	container.insertAdjacentHTML("afterend", content);
	container.classList.add("webgl");
}

/**
 * @param {HTMLCanvasElement} canvas
 * @param {Element} container
 */
export function setup8(canvas, container) {
	setupHTML(container);

	/**
	 * @typedef {{
	 * 	canvas: {
	 * 		width: number;
	 * 		height: number;
	 * 		aspectRatio: number;
	 * 	};
	 * 	cursor: {
	 * 		x: number;
	 * 		y: number;
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
			width: window.innerWidth,
			height: window.innerHeight,
			aspectRatio: window.innerWidth / window.innerHeight,
		},
		cursor: {
			x: 0,
			y: 0,
		},
	});

	const scene = new Scene();

	const camera = new PerspectiveCamera(35, config.canvas.aspectRatio, 0.1, 100);
	scene.add(camera);
	camera.position.z = 6;
	// camera.position.set(2, 1, 4);

	const controls = new OrbitControls(camera, canvas);
	controls.enableDamping = true;
	// Disable rotation to not interfere with scrolling
	controls.enableRotate = false;

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

	const parameters = {
		materialColor: "#ffeded",
	};

	const [textures] = loadTextures_obj([
		["/public/8-/textures/gradients/3.jpg"],
		["/public/8-/textures/gradients/5.jpg"],
	]);

	textures["3GradientsTexture"].magFilter = NearestFilter;

	const sharedMaterial = new MeshToonMaterial({
		color: parameters.materialColor,
		gradientMap: textures["3GradientsTexture"],
	});

	const mesh1 = new Mesh(new TorusGeometry(1, 0.4, 16, 60), sharedMaterial);
	const mesh2 = new Mesh(new ConeGeometry(1, 2, 32), sharedMaterial);
	const mesh3 = new Mesh(
		new TorusKnotGeometry(0.8, 0.35, 100, 16),
		sharedMaterial,
	);
	scene.add(mesh1, mesh2, mesh3);
	const sectionMeshes = [mesh1, mesh2, mesh3];

	const objectsDistance = 4;
	mesh1.position.y = -objectsDistance * 0;
	mesh2.position.y = -objectsDistance * 1;
	mesh3.position.y = -objectsDistance * 2;

	mesh1.position.x = 1.75;
	mesh2.position.x = -1.75;
	mesh3.position.x = 1.75;

	const directionalLight = new DirectionalLight();
	scene.add(directionalLight);
	directionalLight.position.set(1, 1, 0);

	const gui = new GUI();
	guiAddMany(gui, parameters, {
		materialColor: {
			$$type: LIL_GUI_TYPES.COLOR,
			name: "Material Color",
			onChange: () => {
				sharedMaterial.color.set(parameters.materialColor);
				// particlesMaterial.color.set(parameters.materialColor);
			},
		},
	});

	let scrollY = window.scrollY;
	window.addEventListener("scroll", () => {
		scrollY = window.scrollY;

		// mesh1.position.y = -objectsDistance * 0 + scrollY / config.canvas.height;
		// mesh2.position.y = -objectsDistance * 1 + scrollY / config.canvas.height;
		// mesh3.position.y = -objectsDistance * 2 + scrollY / config.canvas.height;
	});
	window.addEventListener("mousemove", (event) => {
		config.cursor.x = event.clientX;
		config.cursor.y = event.clientY;
	});

	let previousTime = 0;

	function tick() {
		const elapsedTime = clock.getElapsedTime();
		const deltaTime = elapsedTime - previousTime;
		previousTime = elapsedTime;

		// cube.position.y = Math.cos(elapsedTime);
		// cube.position.x = Math.sin(elapsedTime);

		const parallaxX =
			// To get it relative to the canvas that is centered/fixed
			config.cursor.x / config.canvas.width -
			// To get it relative to the center of the canvas
			0.5;

		const parallaxY = config.cursor.y / config.canvas.height - 0.5;

		camera.position.y = (-scrollY / config.canvas.height) * objectsDistance;

		camera.position.x = parallaxX;
		camera.position.y += parallaxY;

		for (const mesh of sectionMeshes) {
			mesh.rotation.x += deltaTime * 0.1;
			mesh.rotation.y += deltaTime * 0.12;
		}
		// controls.update();
		renderer.render(scene, camera);
		stats.update();
		requestAnimationFrame(tick);
	}

	tick();
}
