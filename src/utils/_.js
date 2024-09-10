import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import fullScreenOnDblClick from "./full-screen-on-dblcick";
import resizeOnContainerChange from "./resize-on-container-change";

/**
 * @param {HTMLCanvasElement} canvas
 * @param {Element} container
 */
export function setup3(canvas, container) {
  const sizes = { width: 800, height: 600 };

  let aspectRatio = sizes.width / sizes.height;

  const scene = new THREE.Scene();

  const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({
      color: 0xffff00,
    }),
  );
  scene.add(cube);

  const camera = new THREE.PerspectiveCamera(45, aspectRatio);
  scene.add(camera);
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
