import * as THREE from "three";
import gsap from "gsap";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
// https://threejs.org/docs/#examples/en/controls/OrbitControls

/**
 * @param {HTMLCanvasElement} canvas
 * @param {Element} container
 */
export function setup2(canvas, container) {
  // Sizes
  const sizes = {
    width: 800,
    height: 600,
  };
  let aspectRatio = sizes.width / sizes.height;

  /**
   * What is happening here?
   * We are creating a new ResizeObserver
   * A ResizeObserver is an object that can observe changes to the size of an element
   * And it can notify us when the size of the element changes
   * We are creating a new ResizeObserver and we are passing a callback function to it
   * This callback function will be called every time the size of the element changes
   * And it will receive a list of entries
   * Each entry will contain information about the element whose size has changed
   * In our case, we are interested in the contentRect property of the entry
   * The contentRect property contains the new size of the element
   * And it has a width and a height property
   * We are updating the sizes object with the new width and height
   * And we are updating the aspectRatio variable with the new aspect ratio
   * The aspect ratio is the ratio of the width to the height of the element
   */
  const canvasResizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const { width, height } = entry.contentRect;
      sizes.width = width;
      sizes.height = height;
      aspectRatio = width / height;

      /**
       * What is happening here?
       * We are updating the size of the renderer
       * The renderer is the object that will draw the scene from the camera's point of view
       * And it will draw it on the canvas
       *
       * And we are updating the pixel ratio of the renderer
       * The pixel ratio is the ratio of the size of a device's physical pixels to the size of its logical pixels
       * And it is used to render high-resolution graphics on high-resolution displays
       * We are setting the pixel ratio to the minimum of the device pixel ratio and 2
       * This will ensure that the renderer will render high-resolution graphics on high-resolution displays
       * But it will not render graphics at a higher resolution than 2 times the size of the logical pixels
       * This is to prevent the renderer from rendering graphics at a higher resolution than the device can handle
       * And it will ensure that the graphics will be rendered at a reasonable resolution
       * The device pixel ratio could change if the user zooms in or out on the page or if having multiple monitors with different pixel densities connected to the computer and moving the window between them
       *
       * We are updating the aspect ratio of the camera
       * The aspect ratio is the ratio of the width to the height of the camera
       *
       * And we are updating the projection matrix of the camera
       * The projection matrix is a matrix that is used to project 3D coordinates into 2D coordinates
       * And it is based on the aspect ratio of the camera
       * So when we update the aspect ratio of the camera, we need to update the projection matrix
       */
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      camera.aspect = aspectRatio;
      camera.updateProjectionMatrix();
    }
  });

  canvasResizeObserver.observe(container);

  window.addEventListener("dblclick", () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      container.requestFullscreen();
    }
  });

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
  /**
   * The pixel ratio is the ratio of the resolution of the canvas to the resolution of the screen
   * The pixel ratio can be used to improve the quality of the graphics
   * The pixel ratio must be between 1 and 2
   * The pixel ratio can be changed by setting the renderer.pixelRatio property
   * We are setting the pixel ratio to the minimum of the device pixel ratio and 2
   * The device pixel ratio is the ratio of the resolution of the screen to the resolution of the canvas
   * And it is usually 1, 2, or 3
   * So we are setting the pixel ratio to the minimum of 2 and the device pixel ratio
   * This will ensure that the pixel ratio is always between 1 and 2
   */
  renderer.pixelRatio = Math.min(window.devicePixelRatio, 2);

  // canvas.style.width = "100%";
  // canvas.style.height = "100%";

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
