import * as THREE from "three";
import gsap from "gsap";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import GUI from "lil-gui";
// https://threejs.org/docs/#examples/en/controls/OrbitControls

/**
 * @param {HTMLCanvasElement} canvas
 * @param {Element} container
 */
export function setup2(canvas, container) {
  // Sizes
  const sizes = { width: 800, height: 600 };
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

  const gui = new GUI({
    title: "Debug UI",
    width: 300,
    closeFolders: true,
  });
  gui.close();
  gui.hide();

  window.addEventListener("keydown", (event) => {
    console.log("___ event.key", event.key);
    if (event.ctrlKey && event.key.toLowerCase() === "h") {
      event.preventDefault();
      if (gui._hidden) {
        gui.show();
        return;
      }

      gui.hide();
    }
  });

  const debugUIConfig = {
    cubeColor: "#a778d8",
    spinCube: () => {
      gsap.to(cube.rotation, { y: cube.rotation.y + Math.PI * 2 });
    },
    cubeSubDivision: 2,
  };

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
    new THREE.MeshBasicMaterial({ color: debugUIConfig.cubeColor }),
  );
  scene.add(cube);

  const cubeTweaksUi = gui.addFolder("Cube");
  cubeTweaksUi.add(cube.material, "wireframe");
  cubeTweaksUi
    .addColor(debugUIConfig, "cubeColor")
    .onChange(
      /** @param {string} value  */
      (value) => {
        cube.material.color.set(value);
      },
    )
    .name("color");
  cubeTweaksUi.add(debugUIConfig, "spinCube");
  cubeTweaksUi
    .add(debugUIConfig, "cubeSubDivision")
    .name("sub division")
    .min(1)
    .max(20)
    .step(1)
    .onFinishChange(
      /** @param {number} value  */
      (value) => {
        cube.geometry.dispose();
        // prettier-ignore
        cube.geometry = new THREE.BoxGeometry(
          1, 1, 1,
          value, value, value
        );
      },
    );

  const axesHelper = new THREE.AxesHelper(1.5);
  cube.add(axesHelper);

  /**
   * What is happening here?
   * We are creating a Float32Array
   * A Float32Array is a typed array that can store 32-bit floating-point numbers
   * And it is used to store the position of the vertices of a 3D object
   * In this case, we are creating a Float32Array with 9 values
   * Each group of 3 values represents the position of a vertex in 3D space
   * And we are creating a triangle with 3 vertices
   * The first vertex is at the origin (0, 0, 0)
   * The second vertex is at (0, 1, 0)
   * The third vertex is at (1, 0, 0)
   * So we have a triangle with vertices at (0, 0, 0), (0, 1, 0), and (1, 0, 0)
   * And we are storing these values in the positionArray
   * And we will use this array to create a BufferAttribute
   * And we will set this attribute to the geometry of the triangle
   * So the geometry will know the position of the vertices of the triangle
   * And it will use this information to render the triangle
   */
  // prettier-ignore
  const positionArray = new Float32Array([
      0, 0, 0, // vertex 1
      0, 1, 0, // vertex 2
      1, 0, 0, // vertex 3
    ]);

  /**
   * What is happening here?
   * We are creating a new BufferAttribute
   * A BufferAttribute is an object that contains the data needed to render a 3D object
   * And it is used to store the data in a typed array
   * And it is used to update the data directly in the typed array
   * Without having to create a new array every time
   * We are creating a new BufferAttribute with the positionArray
   * And we are setting the itemSize to 3
   * The itemSize is the number of values for each vertex
   * In this case, we have 3 values for each vertex (x, y, z)
   * And we are setting the attribute to the geometry
   * The attribute is the data that will be used to render the 3D object
   * And we are setting the attribute to the position attribute of the geometry
   * The position attribute is the data that will be used to position the vertices of the 3D object
   * And we are creating a new BufferGeometry
   * A BufferGeometry is an object that contains the data needed to render a 3D object
   * And it is more efficient than using a Geometry object
   * Because it allows us to store the data in a typed array
   * And it allows us to update the data directly in the typed array
   * Without having to create a new array every time
   * We are setting the position attribute to the geometry
   * The position attribute is the data that will be used to position the vertices of the 3D object
   * And we are creating a new MeshBasicMaterial
   * A MeshBasicMaterial is a material that will be used to render the 3D object
   * And we are setting the color to red
   * And we are setting the wireframe to true
   * The wireframe is a mode that will render the 3D object as a wireframe
   * And we are creating a new Mesh with the geometry and the material
   * A Mesh is a 3D object that will be added to the scene
   * And we are adding the mesh to the scene
   */
  const positionAttribute = new THREE.BufferAttribute(positionArray, 3);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", positionAttribute);

  const material = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    wireframe: true,
  });
  const triangle = new THREE.Mesh(geometry, material);
  scene.add(triangle);

  const triangleTweaksUi = gui.addFolder("Triangle");
  triangleTweaksUi
    .add(triangle.position, "y")
    .min(-3)
    .max(3)
    .step(0.1)
    .name("elevation");
  triangleTweaksUi.add(triangle.position, "z").min(-3).max(3).step(0.1);
  triangleTweaksUi.add(triangle, "visible");

  const position2ArraySize = 50;
  const position2Array = new Float32Array(position2ArraySize * 3 * 3);

  for (let i = 0; i < position2Array.length; i++) {
    position2Array[i] = (Math.random() - 0.4) * 4;
  }

  const position2Attribute = new THREE.BufferAttribute(position2Array, 3);
  const geometry2 = new THREE.BufferGeometry();
  geometry2.setAttribute("position", position2Attribute);

  const triangle2 = new THREE.Mesh(
    // new THREE.BufferGeometry(),
    geometry2,
    new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      wireframe: true,
    }),
  );
  // triangle2.geometry.setAttribute("position", position2Attribute);
  scene.add(triangle2);

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

  gsap.to(triangle.position, { x: 2, duration: 1, delay: 1 });
  gsap.to(triangle.position, { x: -2, duration: 2, delay: 2 });
  gsap.to(triangle.position, { x: 0, duration: 1, delay: 4 });

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
