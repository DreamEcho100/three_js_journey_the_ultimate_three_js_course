import {
	AdditiveBlending,
	BufferAttribute,
	BufferGeometry,
	Clock,
	PerspectiveCamera,
	Points,
	PointsMaterial,
	Scene,
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
export function setup7(canvas, container) {
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

	const scene = new Scene();

	const camera = new PerspectiveCamera(45, config.canvas.aspectRatio);
	scene.add(camera);
	camera.position.y = 5;
	camera.position.z = -10;
	// camera.position.set(2, 1, 4);

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

	const pointsParameters = {
		count: 100_000,
		size: 0.01,
		radius: 5,
		branches: 5,
	};

	function generateGalaxy() {
		const pointsGeometry = new BufferGeometry();
		const pointsPositions = new Float32Array(pointsParameters.count * 3);

		for (let i = 0; i < pointsParameters.count; i++) {
			const i3 = i * 3;
			const radius = (Math.random() - 0.5) * pointsParameters.radius;
			pointsPositions[i3] = radius; // radius;
			pointsPositions[i3 + 1] = (Math.random() - 0.5) * 0.015; // 0; // (Math.random() - 0.5) * 0.015;
			pointsPositions[i3 + 2] = (Math.random() - 0.5) * 0.015; // 0; // (Math.random() - 0.5) * 0.015;
		}

		pointsGeometry.setAttribute(
			"position",
			new BufferAttribute(pointsPositions, 3),
		);

		const pointsMaterial = new PointsMaterial({
			size: pointsParameters.size,
			sizeAttenuation: true,
			depthWrite: false,
			blending: AdditiveBlending,
		});

		const points = new Points(pointsGeometry, pointsMaterial);
		scene.add(points);

		return /** @type {const} */ ([
			points,
			() => {
				points.geometry.dispose();
				points.material.dispose();
				scene.remove(points);
			},
		]);
	}

	let [galaxy, disposeGalaxy] = generateGalaxy();

	gui
		.add(pointsParameters, "count")
		.min(100)
		.max(1_000_000)
		.step(100)
		.onFinishChange(() => {
			disposeGalaxy();
			[galaxy, disposeGalaxy] = generateGalaxy();
		});
	gui
		.add(pointsParameters, "size")
		.min(0.001)
		.max(0.1)
		.step(0.001)
		.onFinishChange(() => {
			disposeGalaxy();
			[galaxy, disposeGalaxy] = generateGalaxy();
		});
	gui
		.add(pointsParameters, "radius")
		.min(0.01)
		.max(20)
		.step(0.01)
		.onFinishChange(() => {
			disposeGalaxy();
			[galaxy, disposeGalaxy] = generateGalaxy();
		});
	gui
		.add(pointsParameters, "branches")
		.min(2)
		.max(20)
		.step(1)
		.onFinishChange(() => {
			disposeGalaxy();
			[galaxy, disposeGalaxy] = generateGalaxy();
		});

	// NOTE: stopped at [22:22]

	function tick() {
		const elapsedTime = clock.getElapsedTime();

		controls.update();

		if (elapsedTime % 0.016 > 0) {
			renderer.render(scene, camera);
		}

		requestAnimationFrame(tick);
	}

	tick();
}
