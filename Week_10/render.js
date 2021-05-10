const images = require("images"); //绘制图片

function render(viewport, element) {
  //元素有样式才处理
  if (element.style) {
    var img = images(element.style.width, element.style.height);

    //仅处理background-color
    if (element.style["background-color"]) {
      let color = element.style["background-color"] || "rgb(0, 0, 0)";
      color.match(/rgb\((\d+), ?(\d+), ?(\d+)\)/);

      img.fill(Number(RegExp.$1), Number(RegExp.$2), Number(+RegExp.$3), 1); //填充颜色

      viewport.draw(img, element.style.left || 0, element.style.top || 0); //绘制到视口上（根据left和top）
    }
  }

  //如果children，查找每一个child，渲染子元素
  if (element.children) {
    for (var child of element.children) {
      render(viewport, child);
    }
  }
}

module.exports = render;
