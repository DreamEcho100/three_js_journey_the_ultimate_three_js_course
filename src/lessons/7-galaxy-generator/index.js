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
import { guiAddMany } from "#utils/lil-gui-helpers.js";

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
	camera.position.set(3, 3, 3);
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

	const pointsParameters = {
		count: 100_000,
		size: 0.01,
		radius: 5,
		branches: 3,
		spin: 1,
		randomness: 0.2,
	};

	function generateGalaxy() {
		const pointsGeometry = new BufferGeometry();
		const pointsPositions = new Float32Array(pointsParameters.count * 3);

		for (let i = 0; i < pointsParameters.count; i++) {
			const i3 = i * 3;
			const radius = Math.random() * pointsParameters.radius;
			const spinAngle = radius * pointsParameters.spin;
			const branchAngle =
				// To get which branch the point is in
				((i % pointsParameters.branches) /
					// to make it between 0 and 1
					pointsParameters.branches) *
				// To get the angle that the branch will be in
				// This works because the branchAngle is between 0 and 1 and 2PI is a full circle angle
				(Math.PI * 2);

			if (i < 20) {
				console.log(i, branchAngle);
			}

			const randomX = (Math.random() - 0.5) * pointsParameters.randomness;
			const randomY = (Math.random() - 0.5) * pointsParameters.randomness;
			const randomZ = (Math.random() - 0.5) * pointsParameters.randomness;

			pointsPositions[i3] =
				// The `Math.cos(branchAngle + spinAngle)` is to make the points in a circle
				// The `Math.cos` helps to make the points in a circle
				Math.cos(
					// The `branchAngle + spinAngle` is to make the points in a spiral
					// How?
					// The `branchAngle` is to make the points in a circle, to give them a distance from the center of the circle
					branchAngle +
						// The `spinAngle` is to make the points in a spiral, to give them a distance from the center of the circle
						spinAngle,
				) *
				// The `radius` is to make the points in a circle, to give them a distance from the center of the circle
				radius + 
				randomX;
			pointsPositions[i3 + 1] = randomY; // (Math.random() - 0.5) * 0.015; // 0; // (Math.random() - 0.5) * 0.015;
			pointsPositions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ; // (Math.random() - 0.5) * 0.015; // 0; // (Math.random() - 0.5) * 0.015;
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

	function onFinishChange() {
		disposeGalaxy();
		[galaxy, disposeGalaxy] = generateGalaxy();
	}

	const gui = new GUI();
	guiAddMany(
		gui,
		pointsParameters,
		{
			count: { min: 100, max: 1_000_000, step: 100 },
			size: { min: 0.001, max: 0.1, step: 0.001 },
			radius: { min: 0.01, max: 20, step: 0.01 },
			branches: { min: 2, max: 20, step: 1 },
			spin: { min: -5, max: 5, step: 0.001 },
			randomness: { min: 2, max: 2, step: 0.001 },
		},
		{ shared: { onFinishChange } },
	);

	// NOTE: stopped at [50:28]

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
