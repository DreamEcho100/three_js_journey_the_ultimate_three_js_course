import {
	AmbientLight,
	BoxGeometry,
	Clock,
	ConeGeometry,
	DirectionalLight,
	Group,
	Mesh,
	MeshBasicMaterial,
	MeshStandardMaterial,
	PerspectiveCamera,
	PlaneGeometry,
	Scene,
	SphereGeometry,
	WebGLRenderer,
} from "three";
import fullScreenOnDblClick from "#utils/full-screen-on-dblcick";
import resizeOnContainerChange from "#utils/resize-on-container-change";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import GUI from "lil-gui";

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
			width: window.innerWidth,
			height: window.innerHeight,
			aspectRatio: window.innerWidth / window.innerHeight,
		},
	};

	const scene = new Scene();

	const camera = new PerspectiveCamera(75, config.canvas.aspectRatio, 0.1, 100);
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
		},
	});

	const gui = new GUI();

	/**
	 * House
	 */
	// Temporary sphere
	const house = new Group();
	scene.add(house);
	house.position.y = 1;

	// Walls
	const walls = new Mesh(
		new BoxGeometry(4, 2.5, 4),
		new MeshStandardMaterial({ color: 0xac8e82 }),
	);
	house.add(walls);
	walls.position.y = walls.geometry.parameters.height * 0.5;

	// Roof
	const roof = new Mesh(
		new ConeGeometry(3.4, 1, 4),
		new MeshStandardMaterial({ color: 0xb35f45 }),
	);
	house.add(roof);
	roof.position.y =
		walls.geometry.parameters.height + roof.geometry.parameters.height * 0.5;
	roof.rotation.y = Math.PI * 0.25;

	// Door
	const door = new Mesh(
		new PlaneGeometry(2, 2),
		new MeshStandardMaterial({ color: 0xaa7b7b }),
	);
	house.add(door);
	door.position.z = walls.geometry.parameters.width * 0.5 + 0.01;
	door.position.y = door.geometry.parameters.height * 0.5;

	// Bushes
	const bushSharedGeometry = new SphereGeometry(1, 16, 16);
	const bushSharedMaterial = new MeshStandardMaterial({ color: 0x89c854 });

	/** @type {[position: [x: number, y: number, z: number], scale: number][]} */
	const bushesConfig = [
		[[0.8, 0.2, 2.2], 0.5],
		[[1.4, 0.1, 2.1], 0.25],
		[[-0.8, 0.1, 2.2], 0.4],
		[[-1, 0.05, 2.6], 0.15],
	];

	// Graves
	// Stopped at 23:15

	/** @type {Mesh<SphereGeometry, MeshStandardMaterial>[]} */
	const bushes = new Array(bushesConfig.length);

	for (const bushConfig of bushesConfig) {
		const bush = new Mesh(bushSharedGeometry, bushSharedMaterial);
		bush.position.set(bushConfig[0][0], bushConfig[0][1], bushConfig[0][2]);
		bush.scale.set(bushConfig[1], bushConfig[1], bushConfig[1]);
		bushes.push(bush);
		house.add(bush);
	}

	// Floor
	const floor = new Mesh(
		new PlaneGeometry(20, 20),
		new MeshStandardMaterial({ color: 0xa9c388 }),
	);
	scene.add(floor);
	floor.rotation.x = -Math.PI * 0.5;
	floor.position.y = 0;

	/**
	 * Lights
	 */
	// Ambient light
	const ambientLight = new AmbientLight(0xffffff, 0.5);
	scene.add(ambientLight);
	gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);

	// Directional light
	const moonLight = new DirectionalLight(0xffffff, 1.5);
	scene.add(moonLight);
	moonLight.position.set(4, 5, -2);
	gui.add(moonLight, "intensity").min(0).max(1).step(0.001);
	gui.add(moonLight.position, "x").min(-5).max(5).step(0.001);
	gui.add(moonLight.position, "y").min(-5).max(5).step(0.001);
	gui.add(moonLight.position, "z").min(-5).max(5).step(0.001);

	function tick() {
		const elapsedTime = clock.getElapsedTime();

		house.position.y = Math.cos(elapsedTime);
		house.position.x = Math.sin(elapsedTime);

		controls.update();

		renderer.render(scene, camera);

		requestAnimationFrame(tick);
	}
	tick();
}
