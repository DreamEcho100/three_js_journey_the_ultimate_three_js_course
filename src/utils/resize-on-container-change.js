/**
 * @import THREE from 'three'
 */

/**
 * @param {{
 *  container: Element,
 *  renderer: THREE.WebGLRenderer,
 *  camera: THREE.PerspectiveCamera,
 *  setAspectRatio?: (aspectRatio: number, width: number, height: number) => void
 * }} param
 *
 * @returns {ResizeObserver}
 *
 * @description
 * Resize the renderer and camera when the container size changes.
 */
export default function resizeOnContainerChange(param) {
  const canvasResizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const { width, height } = entry.contentRect;
      const aspectRatio = width / height;

      param.setAspectRatio?.(aspectRatio, width, height);
      param.renderer.setSize(width, height);
      param.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      param.camera.aspect = aspectRatio;
      param.camera.updateProjectionMatrix();
    }
  });

  canvasResizeObserver.observe(param.container);

  return canvasResizeObserver;
}
