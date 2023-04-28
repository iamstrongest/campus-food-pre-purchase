window.addEventListener("resize", () => {
  getFontSize();
});
function getFontSize() {
  let deviceWidth = document.documentElement.clientWidth || window.innerWidth;
  let fontSize = 100 / deviceWidth + "vw";
  document.documentElement.style.fontSize = fontSize;
}
getFontSize();
