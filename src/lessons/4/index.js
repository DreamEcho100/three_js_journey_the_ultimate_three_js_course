import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import fullScreenOnDblClick from "../../utils/full-screen-on-dblcick";
import resizeOnContainerChange from "../../utils/resize-on-container-change";
import GUI from "lil-gui";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";
// import helvetikerRegularTypeface from "three/examples/fonts/helvetiker_bold.typeface.json";

/**
 * @param {HTMLCanvasElement} canvas
 * @param {Element} container
 */
export function setup4(canvas, container) {
  setup4_2(canvas, container);
}

/**
 * @param {HTMLCanvasElement} canvas
 * @param {Element} container
 */
function setup4_2(canvas, container) {
  const config = {
    canvas: {
      width: 800,
      height: 600,
      aspectRatio: 800 / 600,
    },
  };

  const textureLoader = new THREE.TextureLoader();
  const bakedShadow = textureLoader.load("/textures/bakedShadow.jpg");
  const simpleShadow = textureLoader.load("/textures/simpleShadow.jpg");

  const scene = new THREE.Scene();

  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    new THREE.MeshStandardMaterial(),
  );
  scene.add(sphere);
  sphere.castShadow = true;

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial(),
    // new THREE.MeshBasicMaterial({ map: bakedShadow }),
  );
  scene.add(floor);
  floor.rotation.x = -Math.PI * 0.5;
  floor.position.y = -1;
  floor.receiveShadow = true;

  const bakedShadowPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      alphaMap: simpleShadow,
    }),
  );
  scene.add(bakedShadowPlane);
  bakedShadowPlane.position.y = -0.99;
  bakedShadowPlane.rotateX(Math.PI * -0.5);

  const pointLight = new THREE.PointLight(0xffffff, 10);
  scene.add(pointLight);
  pointLight.position.set(4, 2, 2);
  pointLight.castShadow = true;
  pointLight.shadow.mapSize.width = 1024;
  pointLight.shadow.mapSize.height = 1024;
  pointLight.shadow.camera.near = 0.1;
  pointLight.shadow.camera.far = 10;
  const pointLightHelper = new THREE.PointLightHelper(pointLight);
  scene.add(pointLightHelper);
  const pointLightCameraHelper = new THREE.CameraHelper(
    pointLight.shadow.camera,
  );
  scene.add(pointLightCameraHelper);

  const spotLight = new THREE.SpotLight(
    0xffffff,
    10,
    10,
    Math.PI * 0.1,
    0.25,
    2,
  );
  scene.add(spotLight);
  spotLight.position.set(0, 2, 2);
  scene.add(spotLight.target);
  spotLight.target.position.z = -1;
  spotLight.castShadow = true;
  spotLight.shadow.mapSize.width = 1024 / 4;
  spotLight.shadow.mapSize.height = 1024 / 4;
  spotLight.shadow.camera.fov = 30;
  spotLight.shadow.camera.near = 1;
  spotLight.shadow.camera.far = 10;
  const spotLightHelper = new THREE.SpotLightHelper(spotLight);
  scene.add(spotLightHelper);
  const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
  scene.add(spotLightCameraHelper);
  spotLightHelper.visible = false;
  spotLightCameraHelper.visible = false;

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  scene.add(directionalLight);
  directionalLight.position.set(1, 2, 4);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;
  directionalLight.shadow.camera.near = 1;
  directionalLight.shadow.camera.far = 10;
  directionalLight.shadow.camera.top = 2;
  directionalLight.shadow.camera.right = 2;
  directionalLight.shadow.camera.bottom = -2;
  directionalLight.shadow.camera.left = -2;
  // directionalLight.shadow.radius = 10;
  const directionalLightHelper = new THREE.DirectionalLightHelper(
    directionalLight,
  );
  scene.add(directionalLightHelper);
  const directionalLightCameraHelper = new THREE.CameraHelper(
    directionalLight.shadow.camera,
  );
  scene.add(directionalLightCameraHelper);
  directionalLightHelper.visible = false;
  directionalLightCameraHelper.visible = false;

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambientLight);

  const camera = new THREE.PerspectiveCamera(45, config.canvas.aspectRatio);
  scene.add(camera);
  camera.position.z = 10;
  camera.position.y = 5;
  camera.position.x = -5;

  const renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setSize(config.canvas.width, config.canvas.height);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  const clock = new THREE.Clock();

  fullScreenOnDblClick(container);
  resizeOnContainerChange({
    camera,
    container,
    renderer,
    setAspectRatio: (aspectRatio, width, height) => {
      config.canvas.aspectRatio = aspectRatio;
      config.canvas.width = width;
      config.canvas.height = height;
    },
  });

  function tick() {
    const ellapsedTime = clock.getElapsedTime();

    sphere.position.x = Math.sin(ellapsedTime) * 1.5;
    sphere.position.z = Math.cos(ellapsedTime) * 1.5;
    sphere.position.y = Math.abs(Math.sin(ellapsedTime * 3));

    bakedShadowPlane.position.x = sphere.position.x;
    bakedShadowPlane.position.z = sphere.position.z;
    bakedShadowPlane.material.opacity = (1 - sphere.position.y) * 0.5;

    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }

  tick();
}

/**
 * @param {HTMLCanvasElement} canvas
 * @param {Element} container
 */
function setup4_1(canvas, container) {
  const config = {
    canvas: {
      width: 800,
      height: 600,
      aspectRatio: 800 / 600,
    },
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
    directionalLight,
  );
  scene.add(directionalLightHelper);

  const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 1);
  scene.add(hemisphereLight);

  const hemisphereLightHelper = new THREE.HemisphereLightHelper(
    hemisphereLight,
    1,
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
    2,
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
    metalness: 0,
    // emissive: 0xffffee,
    // emissiveIntensity: 1,
    // color: 0x000000,
  });
  sharedMaterial.side = THREE.DoubleSide;

  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    sharedMaterial,
  );
  scene.add(sphere);
  sphere.position.x = -1.5;

  const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.75, 0.75),
    sharedMaterial,
  );
  scene.add(cube);

  const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 32, 64),
    sharedMaterial,
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
    },
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
