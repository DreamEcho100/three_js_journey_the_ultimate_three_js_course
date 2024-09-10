import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import fullScreenOnDblClick from "../../utils/full-screen-on-dblcick";
import resizeOnContainerChange from "../../utils/resize-on-container-change";

/**
 * @param {HTMLCanvasElement} canvas
 * @param {Element} container
 */
export function setup3(canvas, container) {
  setup3_2(canvas, container);
}

/**
 * @param {HTMLCanvasElement} canvas
 * @param {Element} container
 */
export function setup3_2(canvas, container) {
  const config = {
    canvas: { width: 800, height: 600, aspectRatio: 800 / 600 },
  };

  const textureLoader = new THREE.TextureLoader();
  const doorAlpha = textureLoader.load("/textures/door/alpha.jpg");
  const doorAmbientOcclusion = textureLoader.load(
    "/textures/door/ambientOcclusion.jpg",
  );
  const doorColor = textureLoader.load("/textures/door/color.jpg");
  const doorHeight = textureLoader.load("/textures/door/height.jpg");
  const doorMetalness = textureLoader.load("/textures/door/metalness.jpg");
  const doorNormal = textureLoader.load("/textures/door/normal.jpg");
  const doorRoughness = textureLoader.load("/textures/door/roughness.jpg");
  const doorEnvironmentMapTexture = textureLoader.load(
    "/textures/environmentMap/2k.hdr",
  );
  const gradientTexture = textureLoader.load("/textures/gradients/3.jpg");
  const matcapTexture = textureLoader.load("/textures/matcaps/1.png");

  doorColor.colorSpace = THREE.SRGBColorSpace;
  matcapTexture.colorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();

  // const sharedMaterial = new THREE.MeshBasicMaterial({ map: doorColor });
  // sharedMaterial.color = new THREE.Color("red");
  // // sharedMaterial.wireframe = true;
  // sharedMaterial.transparent = true;
  // sharedMaterial.opacity = 0.5;
  // sharedMaterial.side = THREE.DoubleSide;

  // const sharedMaterial = new THREE.MeshNormalMaterial();
  // // sharedMaterial.wireframe = true;
  // sharedMaterial.flatShading = true;

  // const sharedMaterial = new THREE.MeshMatcapMaterial({
  //   matcap: matcapTexture,
  // });

  // const sharedMaterial = new THREE.MeshDepthMaterial();

  // const sharedMaterial = new THREE.MeshLambertMaterial();

  // const sharedMaterial = new THREE.MeshPhongMaterial();
  // sharedMaterial.shininess = 100;
  // sharedMaterial.specular = new THREE.Color(0x1188ff);

  const sharedMaterial = new THREE.MeshToonMaterial();

  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    sharedMaterial,
  );
  sphere.position.x = -1.5;
  scene.add(sphere);

  const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), sharedMaterial);
  scene.add(plane);

  const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 16, 32),
    sharedMaterial,
  );
  torus.position.x = 1.5;
  scene.add(torus);

  const ambientLight = new THREE.AmbientLight();
  scene.add(ambientLight);

  const pontLight = new THREE.PointLight(0xffffff, 30);
  scene.add(pontLight);
  pontLight.position.x = 2;
  pontLight.position.y = 3;
  pontLight.position.z = 4;

  const camera = new THREE.PerspectiveCamera(45, config.canvas.aspectRatio);
  scene.add(camera);
  camera.position.z = 10;

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;

  const renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setSize(config.canvas.width, config.canvas.height);
  renderer.pixelRatio = Math.min(window.devicePixelRatio, 2);

  fullScreenOnDblClick(container);
  resizeOnContainerChange({
    container,
    camera,
    renderer,
    setAspectRatio: (aspectRatio, width, height) => {
      config.canvas.aspectRatio = aspectRatio;
      config.canvas.width = width;
      config.canvas.height = height;
    },
  });

  const clock = new THREE.Clock();

  function tick() {
    controls.update();

    const ellapsedTime = clock.getElapsedTime();

    sphere.rotation.x = ellapsedTime * -0.15;
    sphere.rotation.y = ellapsedTime * 0.1;

    plane.rotation.x = ellapsedTime * -0.15;
    plane.rotation.y = ellapsedTime * 0.1;

    torus.rotation.x = ellapsedTime * -0.15;
    torus.rotation.y = ellapsedTime * 0.1;

    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
  }

  tick();
}

/**
 * @param {HTMLCanvasElement} canvas
 * @param {Element} container
 */
export function setup3_1(canvas, container) {
  const sizes = { width: 800, height: 600 };

  let aspectRatio = sizes.width / sizes.height;

  const scene = new THREE.Scene();

  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load(
    "/textures/Door_Wood_001_SD/Door_Wood_001_basecolor.jpg",
  );
  // const normalTexture = textureLoader.load(
  //   "/textures/Door_Wood_001_SD/Door_Wood_001_normal.jpg",
  // );
  // const ambientOcclusionTexture = textureLoader.load(
  //   "/textures/Door_Wood_001_SD/Door_Wood_001_ambientOcclusion.jpg",
  // );
  // const heightTexture = textureLoader.load(
  //   "/textures/Door_Wood_001_SD/Door_Wood_001_height.png",
  // );
  // const metalnessTexture = textureLoader.load(
  //   "/textures/Door_Wood_001_SD/Door_Wood_001_metallic.jpg",
  // );
  // const opacityTexture = textureLoader.load(
  //   "/textures/Door_Wood_001_SD/Door_Wood_001_opacity.jpg",
  // );
  // const roughnessTexture = textureLoader.load(
  //   "/textures/Door_Wood_001_SD/Door_Wood_001_roughness.jpg",
  // );

  // texture.repeat.x = 2;
  // texture.repeat.y = 2;
  // texture.rotation = Math.PI * 0.25;
  // texture.center.x = 0.5;
  // texture.center.y = 0.5;
  // texture.offset.x = 0.5;
  // texture.offset.y = 10.5;
  texture.generateMipmaps = false;
  texture.minFilter = THREE.NearestFilter;

  const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({
      color: 0xffff00,
      map: texture,
    }),
  );
  scene.add(cube);

  const camera = new THREE.PerspectiveCamera(45, aspectRatio);
  scene.add(camera);
  camera.position.y = 5;
  camera.position.z = 10;

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;

  const renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setSize(sizes.width, sizes.height);
  renderer.pixelRatio = Math.min(window.devicePixelRatio, 2);

  fullScreenOnDblClick(container);
  resizeOnContainerChange({
    camera,
    container,
    renderer,
    setAspectRatio: (_aspectRatio, width, height) => {
      aspectRatio = _aspectRatio;
      sizes.width = width;
      sizes.height = height;
    },
  });

  function tick() {
    controls.update();

    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
  }

  tick();
}
