import {
	AmbientLight,
	BoxGeometry,
	Clock,
	ConeGeometry,
	DirectionalLight,
	Float32BufferAttribute,
	Fog,
	Group,
	Mesh,
	MeshStandardMaterial,
	PCFShadowMap,
	PerspectiveCamera,
	PlaneGeometry,
	PointLight,
	RepeatWrapping,
	Scene,
	SphereGeometry,
	WebGLRenderer,
} from "three";
import fullScreenOnDblClick from "#utils/full-screen-on-dblcick";
import resizeOnContainerChange from "#utils/resize-on-container-change";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import GUI from "lil-gui";
import { loadTextures_obj } from "#utils/texture-loader-handler.js";

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
	const FOG_COLOR = 0x262837;

	const [textures] = loadTextures_obj([
		"/haunted-house/textures/door/color.jpg",
		"/haunted-house/textures/door/alpha.jpg",
		"/haunted-house/textures/door/ambientOcclusion.jpg",
		"/haunted-house/textures/door/height.jpg",
		"/haunted-house/textures/door/normal.jpg",
		"/haunted-house/textures/door/metalness.jpg",
		"/haunted-house/textures/door/roughness.jpg",
		"/haunted-house/textures/bricks/color.jpg",
		"/haunted-house/textures/bricks/ambientOcclusion.jpg",
		"/haunted-house/textures/bricks/normal.jpg",
		"/haunted-house/textures/bricks/roughness.jpg",
		"/haunted-house/textures/grass/color.jpg",
		"/haunted-house/textures/grass/ambientOcclusion.jpg",
		"/haunted-house/textures/grass/normal.jpg",
		"/haunted-house/textures/grass/roughness.jpg",
	]);

	const scene = new Scene();

	const camera = new PerspectiveCamera(75, config.canvas.aspectRatio, 0.1, 100);
	scene.add(camera);
	camera.position.x = 4;
	camera.position.y = 3;
	camera.position.z = 10;

	const controls = new OrbitControls(camera, canvas);
	controls.enableDamping = true;

	const renderer = new WebGLRenderer({ canvas });
	renderer.setSize(config.canvas.width, config.canvas.height);
	renderer.setClearColor(FOG_COLOR);
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = PCFShadowMap;

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
	const house = new Group();
	scene.add(house);

	// Walls
	const walls = new Mesh(
		new BoxGeometry(4, 2.5, 4),
		new MeshStandardMaterial({
			// color: 0xac8e82,
			map: textures.colorBricksTexture,
			aoMap: textures.ambientOcclusionBricksTexture,
			normalMap: textures.normalBricksTexture,
			roughnessMap: textures.roughnessBricksTexture,
		}),
	);
	house.add(walls);
	walls.receiveShadow = true;
	walls.geometry.setAttribute(
		"uv2",
		new Float32BufferAttribute(walls.geometry.attributes.uv.array, 2),
	);
	walls.position.y = walls.geometry.parameters.height * 0.5;

	// Roof
	const roof = new Mesh(
		new ConeGeometry(3.4, 1, 4),
		new MeshStandardMaterial({ color: 0xb35f45 }),
	);
	house.add(roof);
	roof.receiveShadow = true;
	roof.position.y =
		walls.geometry.parameters.height + roof.geometry.parameters.height * 0.5;
	roof.rotation.y = Math.PI * 0.25;

	// Door
	const door = new Mesh(
		new PlaneGeometry(
			walls.geometry.parameters.height * 0.88,
			walls.geometry.parameters.height * 0.88,
			100,
			100,
		),
		new MeshStandardMaterial({
			// color: 0xaa7b7b,
			map: textures.colorDoorTexture,
			transparent: true,
			// Will cut unnecessary parts.
			// For this to work, make sure to add `transparent: true,`.
			alphaMap: textures.alphaDoorTexture,
			// Will change the wireframe.
			// Will give it a since of depth and pumps on it.
			// You may need to tweak the `displacementScale` and the geometry `widthSegments` and `heightSegments`.
			displacementMap: textures.heightDoorTexture,
			displacementScale: 0.1,
			// For this to work, make sure to set the `door.geometry.setAttribute('uv2', ...);`.
			aoMap: textures.ambientOcclusionDoorTexture,
			// Will give it a sense of depth.
			normalMap: textures.normalDoorTexture,
			metalnessMap: textures.metalnessDoorTexture,
			metalness: 0.01,
			roughnessMap: textures.roughnessDoorTexture,
			roughness: 1,
		}),
	);
	house.add(door);
	door.geometry.setAttribute(
		"uv2",
		new Float32BufferAttribute(door.geometry.attributes.uv.array, 2),
	);
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

	// /** @type {Mesh<SphereGeometry, MeshStandardMaterial>[]} */
	// new Array(bushesConfig.length);
	const bushes = new Group();
	bushes;

	for (const bushConfig of bushesConfig) {
		const bush = new Mesh(bushSharedGeometry, bushSharedMaterial);
		bush.position.set(bushConfig[0][0], bushConfig[0][1], bushConfig[0][2]);
		bush.scale.set(bushConfig[1], bushConfig[1], bushConfig[1]);
		bush.receiveShadow = true;
		bushes.add(bush);
	}

	scene.add(bushes);

	// Graves
	const gravesSharedGeometry = new BoxGeometry(0.6, 0.8, 0.2);
	const gravesSharedMaterial = new MeshStandardMaterial({ color: 0xb2b6b1 });

	const graves = new Group();
	const GRAVES_SIZE = 50;
	scene.add(graves);

	for (let i = 0; i < GRAVES_SIZE; i++) {
		const angle = Math.random() * Math.PI * 2; // Random angle
		const radius = 3 + Math.random() * 6; // Random radius
		const x = Math.sin(angle) * radius; // Get the x position using cosines
		const z = Math.cos(angle) * radius; // Get the z position using sinus

		// Create the mesh
		const grave = new Mesh(gravesSharedGeometry, gravesSharedMaterial);

		// Position
		grave.position.set(
			x,
			grave.geometry.parameters.height * 0.5 - 0.1, // Math.abs(zRotation) * 0.5,
			z,
		);

		// Rotation
		grave.rotation.z = (Math.random() - 0.5) * 0.4;
		grave.rotation.y = (Math.random() - 0.5) * 0.4;

		grave.castShadow = true;

		// Add to the graves container
		graves.add(grave);
	}

	// Floor
	const floor = new Mesh(
		new PlaneGeometry(20, 20),
		new MeshStandardMaterial({
			// color: 0xa9c388,
			map: textures.colorGrassTexture,
			normalMap: textures.normalGrassTexture,
			roughnessMap: textures.roughnessGrassTexture,
			aoMap: textures.ambientOcclusionGrassTexture,
		}),
	);
	scene.add(floor);
	floor.receiveShadow = true;
	door.geometry.setAttribute(
		"uv2",
		new Float32BufferAttribute(door.geometry.attributes.uv.array, 2),
	);
	floor.rotation.x = -Math.PI * 0.5;
	floor.position.y = 0;
	const floorMaps = [
		textures.colorGrassTexture,
		textures.normalGrassTexture,
		textures.roughnessGrassTexture,
		textures.ambientOcclusionGrassTexture,
	];
	for (const floorMap of floorMaps) {
		floorMap.repeat.set(8, 8);
		floorMap.wrapS = RepeatWrapping;
		floorMap.wrapT = RepeatWrapping;
	}

	/**
	 * Lights
	 */
	// Ambient light
	const ambientLight = new AmbientLight(0xb9d5ff, 0.12);
	scene.add(ambientLight);
	const ambientLightFolder = gui.addFolder("Ambient Light");
	ambientLightFolder.add(ambientLight, "intensity").min(0).max(1).step(0.001);

	// Directional light
	const moonLight = new DirectionalLight(0xb9d5ff, 0.16);
	scene.add(moonLight);
	moonLight.castShadow = true;
	moonLight.shadow.mapSize.width = 256;
	moonLight.shadow.mapSize.height = 256;
	moonLight.shadow.camera.far = 15;
	moonLight.position.set(4, 5, -2);
	const directionalLightFolder = gui.addFolder("Directional Light");
	directionalLightFolder.add(moonLight, "intensity").min(0).max(1).step(0.001);
	directionalLightFolder
		.add(moonLight.position, "x")
		.min(-5)
		.max(5)
		.step(0.001);
	directionalLightFolder
		.add(moonLight.position, "y")
		.min(-5)
		.max(5)
		.step(0.001);
	directionalLightFolder
		.add(moonLight.position, "z")
		.min(-5)
		.max(5)
		.step(0.001);

	// Door light
	const doorLight = new PointLight(0xff7d46, 1.5, 7);
	house.add(doorLight);
	doorLight.castShadow = true;
	doorLight.shadow.mapSize.width = 256;
	doorLight.shadow.mapSize.height = 256;
	doorLight.shadow.camera.far = 7;
	doorLight.position.set(
		0,
		walls.geometry.parameters.height * 0.88, // 2.25,
		// 2.7,
		walls.geometry.parameters.depth * 0.7,
	);

	// Fog
	const fog = new Fog(FOG_COLOR, 1, 15);
	scene.fog = fog;

	/**
	 * Ghosts
	 */
	const ghost1 = new PointLight(0xff00ff, 6, 3);
	scene.add(ghost1);
	ghost1.castShadow = true;
	ghost1.shadow.mapSize.width = 256;
	ghost1.shadow.mapSize.height = 256;
	ghost1.shadow.camera.far = 7;

	const ghost2 = new PointLight(0x00ffff, 6, 3);
	scene.add(ghost2);
	ghost2.castShadow = true;
	ghost2.shadow.mapSize.width = 256;
	ghost2.shadow.mapSize.height = 256;
	ghost2.shadow.camera.far = 7;

	const ghost3 = new PointLight(0xffff00, 6, 3);
	scene.add(ghost3);
	ghost3.castShadow = true;
	ghost3.shadow.mapSize.width = 256;
	ghost3.shadow.mapSize.height = 256;
	ghost3.shadow.camera.far = 7;

	camera.lookAt(house.position);

	function tick() {
		const elapsedTime = clock.getElapsedTime();

		// Ghosts
		const ghost1Angle = elapsedTime * 0.5;
		ghost1.position.x = Math.cos(ghost1Angle) * 4;
		ghost1.position.z = Math.sin(ghost1Angle) * 4;
		ghost1.position.y = Math.sin(elapsedTime * 3);

		const ghost2Angle = -elapsedTime * 0.32;
		ghost2.position.x = Math.cos(ghost2Angle) * 5;
		ghost2.position.z = Math.sin(ghost2Angle) * 5;
		ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

		const ghost3Angle = -elapsedTime * 0.18;
		ghost3.position.x =
			Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32));
		ghost3.position.z =
			Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5));
		ghost3.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

		controls.update();

		renderer.render(scene, camera);

		requestAnimationFrame(tick);
	}
	tick();
}
