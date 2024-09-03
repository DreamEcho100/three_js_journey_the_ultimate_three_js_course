import * as THREE from "three";
import gsap from "gsap";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
// https://threejs.org/docs/#examples/en/controls/OrbitControls

/** @param {HTMLCanvasElement} canvas  */
export function setup2(canvas) {
  // Sizes
  const sizes = {
    width: 800,
    height: 600,
  };
  const cursor = { x: 0, y: 0 };
  const cursorPadding = 0.5;

  window.addEventListener("pointermove", (event) => {
    /**
     * What is happening here?
     * `event.clientX` is the distance from the left of the window to the cursor
     * And we assume that the canvas starts from the left top of the window
     * So we can use this value to calculate the cursor's position relative to the canvas
     * And we can do this by dividing `event.clientX` by the width of the window
     * This will give us a value between 0 and 1
     * And we can use this value to set the cursor's X position
     * But we need to add a padding to center the cursor
     * So we subtract `cursorPadding` from the value
     * And we do the same for the Y position
     */

    cursor.x = event.clientX / sizes.width - cursorPadding;
    /**
     * `event.clientY` is the distance from the top of the window to the cursor
     * And it increases as we go down
     * But the Three.js coordinate system is different
     * The Y axis increases as we go up
     * So we need to invert the value somewhere
     * We can do it here
     */
    cursor.y = -(event.clientY / sizes.height - cursorPadding);
  });

  const scene = new THREE.Scene();

  const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xff0000 }),
  );

  scene.add(cube);

  const axesHelper = new THREE.AxesHelper(1.5);
  cube.add(axesHelper);

  const aspectRatio = sizes.width / sizes.height;
  const camera = new THREE.PerspectiveCamera(45, aspectRatio, 0.1, 100);
  // const camera = new THREE.OrthographicCamera(
  //   -1 * aspectRatio,
  //   1 * aspectRatio,
  //   1,
  //   -1,
  //   0.1,
  //   100,
  // );
  // camera.position.x = 2;
  // camera.position.y = 2;
  camera.position.z = 10;
  scene.add(camera);

  const controls = new OrbitControls(camera, canvas);
  /**
   * The damping factor is the amount of time it takes for the camera to stop moving
   * The lower the damping factor, the faster the camera will stop moving (less smooth)
   * The higher the damping factor, the slower the camera will stop moving (more smooth)
   * The damping factor must be between 0 and 1
   * The damping factor can be changed by setting the controls.dampingFactor property
   */
  controls.enableDamping = true;

  const renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setSize(sizes.width, sizes.height);

  gsap.to(cube.position, { x: 2, duration: 1, delay: 1 });
  gsap.to(cube.position, { x: -2, duration: 2, delay: 2 });
  gsap.to(cube.position, { x: 0, duration: 1, delay: 4 });

  const clock = new THREE.Clock();

  function tick() {
    const elapsedTime = clock.getElapsedTime();

    // mesh.position.x = Math.sin(elapsedTime);
    cube.position.y = Math.cos(elapsedTime);
    cube.position.z = Math.sin(elapsedTime);
    // camera.lookAt(mesh.position);

    /**
     * We can use the cursor's position to rotate the camera
     * We can rotate the camera around the X axis based on the cursor's Y position
     * And we can rotate the camera around the Y axis based on the cursor's X position
     */

    /**
     * The following code will rotate the camera in a way that makes it look like the camera is orbiting around the mesh in the center
     */
    // camera.position.x = cursor.x * 3;
    // camera.position.y = cursor.y * 3;

    /**
     * The following code will rotate the camera in a way that makes it look like the camera is orbiting around the mesh in the center
     * But the camera will be further away from the mesh
     */
    // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3;
    // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3;
    // camera.position.y = cursor.y * 3 + 2;
    // camera.lookAt(cube.position);

    /**
     * The controls.update() method must be called after any manual changes to the camera's position
     * For example, damping the camera's position will not work if we don't call controls.update() after changing the camera's position
     * The controls.update() method must be called at the end of the tick function
     */
    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
  }

  tick();
}
