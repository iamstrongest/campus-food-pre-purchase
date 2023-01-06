export default function useMove(id) {
  const element = document.getElementById(id);
  let x, y;
  element.addEventListener("mousedown", mouseDown);
  element.addEventListener("mouseup", mouseUp);
  function mouseDown(e) {
    x = e.clientX - element.offsetLeft;
    y = e.clientY - element.offsetTop;
    element.addEventListener("mousemove", mouseMove);
  }
  function mouseUp() {
    element.removeEventListener("mousemove", mouseMove);
  }
  function mouseMove(e) {
    element.style.left = e.clientX - x + "px";
    element.style.top = e.clientY - y + "px";
  }
}
