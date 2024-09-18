import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import fullScreenOnDblClick from '../../utils/full-screen-on-dblcick';
import resizeOnContainerChange from '../../utils/resize-on-container-change';
import GUI from 'lil-gui';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js';
// import helvetikerRegularTypeface from "three/examples/fonts/helvetiker_bold.typeface.json";

/**
 * @param {HTMLCanvasElement} canvas
 * @param {Element} container
 */
export function setup4(canvas, container) {
	const config = {
		canvas: {
			width: 800,
			height: 600,
			aspectRatio: 800 / 600
		}
	};
	const scene = new THREE.Scene();

	const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
	scene.add(ambientLight);

	const pointLight = new THREE.PointLight(0xff9000, 0.5, 1);
	scene.add(pointLight);
	pointLight.position.x = 1;
	pointLight.position.y = -0.5;
	pointLight.position.z = 1;

	const pointLightHelper = new THREE.PointLightHelper(pointLight);
	scene.add(pointLightHelper);

	const directionalLight = new THREE.DirectionalLight(0x00fffc, 1);
	scene.add(directionalLight);
	directionalLight.position.set(3, 1, 0);

	const directionalLightHelper = new THREE.DirectionalLightHelper(
		directionalLight
	);
	scene.add(directionalLightHelper);

	const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 1);
	scene.add(hemisphereLight);

	const hemisphereLightHelper = new THREE.HemisphereLightHelper(
		hemisphereLight,
		1
	);
	scene.add(hemisphereLightHelper);

	const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 1, 1);
	scene.add(rectAreaLight);
	rectAreaLight.position.set(-1.5, 0, 1.5);
	rectAreaLight.lookAt(new THREE.Vector3());

	const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
	scene.add(rectAreaLightHelper);

	const spotLight = new THREE.SpotLight(
		0x78ff00,
		0.5,
		6,
		Math.PI * 0.1,
		0.25,
		2
	);
	scene.add(spotLight);
	spotLight.intensity = 11;
	// spotLight.distance = 11;
	// spotLight.penumbra = 0;
	scene.add(spotLight.target);
	spotLight.target.position.x = -0.75;
	spotLight.position.set(0, 2, 3);

	const spotLightHelper = new THREE.SpotLightHelper(spotLight);
	scene.add(spotLightHelper);

	const sharedMaterial = new THREE.MeshStandardMaterial({
		roughness: 0.4,
		metalness: 0
		// emissive: 0xffffee,
		// emissiveIntensity: 1,
		// color: 0x000000,
	});

	const sphere = new THREE.Mesh(
		new THREE.SphereGeometry(0.5, 32, 32),
		sharedMaterial
	);
	scene.add(sphere);
	sphere.position.x = -1.5;

	const cube = new THREE.Mesh(
		new THREE.BoxGeometry(0.75, 0.75, 0.75),
		sharedMaterial
	);
	scene.add(cube);

	const torus = new THREE.Mesh(
		new THREE.TorusGeometry(0.3, 0.2, 32, 64),
		sharedMaterial
	);
	scene.add(torus);
	torus.position.x = 1.5;

	const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), sharedMaterial);
	scene.add(plane);
	plane.rotation.x = -Math.PI * 0.5;
	plane.position.y = -0.65;

	const camera = new THREE.PerspectiveCamera(45, config.canvas.aspectRatio);
	scene.add(camera);
	camera.position.x = 1;
	camera.position.y = 3;
	camera.position.z = 10;

	const renderer = new THREE.WebGLRenderer({ canvas });
	renderer.setSize(config.canvas.width, config.canvas.height);

	const controls = new OrbitControls(camera, canvas);
	controls.enableDamping = true;

	fullScreenOnDblClick(container);
	resizeOnContainerChange({
		camera,
		container,
		renderer,
		setAspectRatio: (aspectRatio, width, height) => {
			config.canvas.aspectRatio = aspectRatio;
			config.canvas.width = width;
			config.canvas.height = height;
		}
	});

	const clock = new THREE.Clock();

	function tick() {
		const elapsedTime = clock.getElapsedTime();

		// Update objects
		sphere.rotation.y = 0.1 * elapsedTime;
		cube.rotation.y = 0.1 * elapsedTime;
		torus.rotation.y = 0.1 * elapsedTime;

		sphere.rotation.x = 0.15 * elapsedTime;
		cube.rotation.x = 0.15 * elapsedTime;
		torus.rotation.x = 0.15 * elapsedTime;

		controls.update();
		renderer.render(scene, camera);
		window.requestAnimationFrame(tick);
	}

	tick();
}
