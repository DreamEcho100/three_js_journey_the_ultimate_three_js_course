/** @param {Element} elem */
export default function fullScreenOnDblClick(elem) {
  window.addEventListener("dblclick", () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      elem.requestFullscreen();
    }
  });
}
