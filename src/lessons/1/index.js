import * as THREE from "three";

/** @param {HTMLCanvasElement} canvas  */
export function setup1(canvas) {
  // Scene
  const scene = new THREE.Scene();

  // Mesh
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    // wireframe: true,
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // Position
  mesh.position.x = 1;
  mesh.position.y = 1;
  mesh.position.z = 1;

  // Scale
  mesh.scale.set(1.1, 1.3, 1.25);

  // Rotation
  mesh.rotation.reorder("YXZ");
  mesh.rotation.x = Math.PI * 0.25;
  mesh.rotation.y = Math.PI * 0.25;
  mesh.rotation.z = Math.PI * 0.25;

  const axesHelper = new THREE.AxesHelper(1.5);
  mesh.add(axesHelper);

  // length of the vector from the origin to the mesh position
  // It can be used to:
  // - check if the mesh is in the center of the scene
  // - check if the mesh is in the camera (view, frustum, field of view, near and far planes, aspect ratio, etc)
  console.log(mesh.position.length());

  const group = new THREE.Group();
  scene.add(group);

  const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xff0000 }),
  );
  cube1.position.x = -1.5;
  group.add(cube1);

  const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
  );
  group.add(cube2);

  const cube3 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0x0000ff }),
  );
  cube3.position.x = 1.5;
  group.add(cube3);

  group.position.y = 1.5;
  group.scale.z = 1.1;
  group.rotation.x = Math.PI * 0.25;

  // Sizes
  const sizes = {
    width: 800,
    height: 600,
  };

  // Camera
  const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
  camera.position.set(2, 1, 4);
  scene.add(camera);

  // distance between the mesh and the camera
  // It can be used to:
  // - check if the mesh is in the camera (view, frustum, field of view, near and far planes, aspect ratio, etc)
  console.log(mesh.position.distanceTo(camera.position));

  mesh.position.normalize();
  console.log(mesh.position.length());

  camera.lookAt(mesh.position);

  // Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas,
  });
  renderer.setSize(sizes.width, sizes.height);
  renderer.render(scene, camera);
}
