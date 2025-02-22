import {
    AdditiveBlending,
	BoxGeometry,
	BufferAttribute,
	BufferGeometry,
	Clock,
	Mesh,
	MeshBasicMaterial,
	PerspectiveCamera,
	Points,
	PointsMaterial,
	Scene,
	WebGLRenderer,
} from "three";
import fullScreenOnDblClick from "#utils/full-screen-on-dblcick";
import resizeOnContainerChange from "#utils/resize-on-container-change";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { loadTextures_obj } from "#utils/texture-loader-handler.js";

/**
 * @param {HTMLCanvasElement} canvas
 * @param {Element} container
 */
export function setup6_particles(canvas, container) {
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
			aspectRatio: 800 / 600,
		},
	};

	const [textures] = loadTextures_obj([
		["/6- particles/textures/particles/11.png", "pointsTexture"],
	]);

	const scene = new Scene();

	const camera = new PerspectiveCamera(45, config.canvas.aspectRatio);
	scene.add(camera);
	camera.position.z = 6;

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

	// Geometry
	const pointsGeometry = new BufferGeometry();

	const POINTS_SIZE = 50000;
	const positions = new Float32Array(POINTS_SIZE * 3);
	const colors = new Float32Array(POINTS_SIZE * 3);
	for (let i = 0; i < POINTS_SIZE * 3; i++) {
		const rand = Math.random();
		positions[i] = (rand - 0.5) * 10;
		colors[i] = rand;
	}

	pointsGeometry.setAttribute("position", new BufferAttribute(positions, 3));
	// You should enable `vertixColors` on the `PointsMaterial`
	pointsGeometry.setAttribute("color", new BufferAttribute(positions, 3));

	// Material
	const pointsMaterial = new PointsMaterial({
		size: 0.1,
		sizeAttenuation: true,

		// color: 0xff88cc,

		// map: textures.pointsTexture,
		transparent: true,
		alphaMap: textures.pointsTexture,
		// alphaTest: 0.001,
		// Disable depthTest to avoid rendering issues with transparency
		// depthTest: false,
		// depthWrite: false,
		blending: AdditiveBlending,
		vertexColors: true,
	});

	// Points
	const points = new Points(pointsGeometry, pointsMaterial);
	scene.add(points);

	const cube = new Mesh(new BoxGeometry(1, 1, 1), new MeshBasicMaterial());
	scene.add(cube);
	cube.position.set(0, 0, 0);

	function tick() {
		const elapsedTime = clock.getElapsedTime();

		// points.position.y = Math.cos(elapsedTime);
		// points.position.x = Math.sin(elapsedTime);

		// points.rotation.y = 0.1 * elapsedTime * Math.PI;
		cube.rotation.y = -0.15 * elapsedTime * Math.PI;

		points.rotation.y = elapsedTime * 0.05;

		for (let i = 0; i < POINTS_SIZE; i++) {
			const i3 = i * 3;

			const x = points.geometry.attributes.position.array[i3 + 0];
			points.geometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x);
		}
		points.geometry.attributes.position.needsUpdate = true;

		controls.update();

		if (elapsedTime % 0.016 > 0) {
			renderer.render(scene, camera);
		}

		requestAnimationFrame(tick);
	}

	tick();
}
