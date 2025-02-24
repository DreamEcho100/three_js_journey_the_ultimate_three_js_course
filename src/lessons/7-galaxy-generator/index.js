import {
	AdditiveBlending,
	BufferAttribute,
	BufferGeometry,
	Clock,
	Color,
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
import { guiAddMany, LIL_GUI_TYPES } from "#utils/lil-gui-helpers.js";
import Stats from "three/addons/libs/stats.module.js";

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

	const camera = new PerspectiveCamera(45, config.canvas.aspectRatio, 0.1, 100);
	scene.add(camera);
	camera.position.set(0, 3, 5);

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

	const pointsParameters = {
		count: 1_000_000,
		size: 0.01,
		radius: 5,
		branches: 3,
		spin: -3,
		pointToCenterRandomnessPower: 1.5,
		randomness: 2,
		randomnessPower: 4,
		insideColor: 0xff6030,
		outsideColor: 0x1b3984,
	};

	function generateGalaxy() {
		const pointsGeometry = new BufferGeometry();

		const pointsPositions = new Float32Array(pointsParameters.count * 3);
		const pointsColors = new Float32Array(pointsParameters.count * 3);

		const insideColor = new Color(pointsParameters.insideColor);
		const outsideColor = new Color(pointsParameters.outsideColor);

		for (let i = 0; i < pointsParameters.count; i++) {
			const i3 = i * 3;
			const radius =
				Math.pow(Math.random(), pointsParameters.pointToCenterRandomnessPower) *
				pointsParameters.radius;
			// Math.random() * pointsParameters.radius;
			const spinAngle = radius * pointsParameters.spin;
			const branchAngle =
				// To get which branch the point is in
				((i % pointsParameters.branches) /
					// to make it between 0 and 1
					pointsParameters.branches) *
				// To get the angle that the branch will be in
				// This works because the branchAngle is between 0 and 1 and 2PI is a full circle angle
				(Math.PI * 2);

			const randomX =
				Math.pow(Math.random(), pointsParameters.randomnessPower) *
				(Math.random() < 0.5 ? 1 : -1);
			const randomY =
				Math.pow(Math.random(), pointsParameters.randomnessPower) *
				(Math.random() < 0.5 ? 1 : -1);
			const randomZ =
				Math.pow(Math.random(), pointsParameters.randomnessPower) *
				(Math.random() < 0.5 ? 1 : -1);

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
			pointsPositions[i3 + 2] =
				Math.sin(branchAngle + spinAngle) * radius + randomZ; // (Math.random() - 0.5) * 0.015; // 0; // (Math.random() - 0.5) * 0.015;

			const mixedColor = insideColor.clone();
			mixedColor.lerp(outsideColor, radius / pointsParameters.radius);
			pointsColors[i3] = mixedColor.r;
			pointsColors[i3 + 1] = mixedColor.g;
			pointsColors[i3 + 2] = mixedColor.b;
		}

		pointsGeometry.setAttribute(
			"position",
			new BufferAttribute(pointsPositions, 3),
		);
		pointsGeometry.setAttribute("color", new BufferAttribute(pointsColors, 3));

		const pointsMaterial = new PointsMaterial({
			size: pointsParameters.size,
			sizeAttenuation: true,
			depthWrite: false,
			blending: AdditiveBlending,
			vertexColors: true,
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
			randomness: { min: 2, max: 10, step: 0.001 },
			randomnessPower: {
				min: 1,
				max: 10,
				step: 0.001,
				name: "randomness power",
			},
			pointToCenterRandomnessPower: {
				min: 1,
				max: 10,
				step: 0.001,
				name: "point to center randomness power",
			},
			insideColor: {
				$$type: LIL_GUI_TYPES.COLOR,
				name: "inside color",
			},
			outsideColor: {
				$$type: LIL_GUI_TYPES.COLOR,
				name: "outside color",
			},
		},
		{ shared: { onFinishChange } },
	);

	// gui
	// 	.addColor(pointsParameters, "insideColor")
	// 	.name("inside color")
	// 	.onFinishChange(onFinishChange);
	// gui
	// 	.addColor(pointsParameters, "outsideColor")
	// 	.name("outside color")
	// 	.onFinishChange(onFinishChange);

	function tick() {
		const elapsedTime = clock.getElapsedTime();

		galaxy.rotation.y = elapsedTime * 0.1;

		controls.update();
		renderer.render(scene, camera);
		stats.update();
		requestAnimationFrame(tick);
	}

	tick();
}
