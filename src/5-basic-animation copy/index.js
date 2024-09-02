import * as THREE from "three";
import gsap from "gsap";

/** @param {HTMLCanvasElement} canvas  */
export function basicAnimations(canvas) {
  const scene = new THREE.Scene();

  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xff0000 }),
  );

  scene.add(mesh);

  const axesHelper = new THREE.AxesHelper(1.5);
  mesh.add(axesHelper);

  // Sizes
  const sizes = {
    width: 800,
    height: 600,
  };

  const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height);
  camera.position.z = 10;
  scene.add(camera);

  const renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setSize(sizes.width, sizes.height);

  gsap.to(mesh.position, { x: 2, duration: 1, delay: 1 });
  gsap.to(mesh.position, { x: -2, duration: 2, delay: 2 });
  gsap.to(mesh.position, { x: 0, duration: 1, delay: 4 });

  const clock = new THREE.Clock();

  function tick() {
    const elapsedTime = clock.getElapsedTime();

    // mesh.position.x = Math.sin(elapsedTime);
    mesh.position.y = Math.cos(elapsedTime);
    mesh.position.z = Math.sin(elapsedTime);
    camera.lookAt(mesh.position);

    window.requestAnimationFrame(tick);
    renderer.render(scene, camera);
  }

  tick();
}
