
import { Component, createElement } from './framework'

class Carousel extends Component{
  constructor(){
    super();
    this.attributes = Object.create(null);
  }
  setAttribute(name, value) {
    this.attributes[name] = value;
  }
  render(){
    console.log(this.attributes)
    this.root = document.createElement("div");
    this.root.classList.add('carousel');
    for(let record of this.attributes.src){
      let child = document.createElement('div');
      
      child.style.backgroundImage = `url(${record})`;
      this.root.appendChild(child);
    }

    let position = 0

    this.root.addEventListener('mousedown', event => {
      let children = this.root.children;
      let startX = event.clientX;

      let move = event => {
        let x = event.clientX - startX;

        let current = position - ((x - x % 500) / 500);

        for (let offset of [-1, 0, 1]) {
          let pos = current + offset;
          // 计算图片所在 index
          pos = (pos + children.length) % children.length;
          console.log('pos', pos);

          children[pos].style.transition = 'none';
          children[pos].style.transform = `translateX(${-pos * 500 + offset * 500 + (x % 500)}px)`;
        }

      };

      let up = event => {
        let x = event.clientX - startX;
        position = position - Math.round(x / 500);

        for (let offset of [0, -Math.sign(Math.round(x / 500) - x + 250 * Math.sign(x))]) {
          let pos = position + offset;
          // 计算图片所在 index
          pos = (pos + children.length) % children.length;

          children[pos].style.transition = '';
          children[pos].style.transform = `translateX(${-pos * 500 + offset * 500}px)`;
        }

        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', up);

      };

      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', up);

    });


    // // 当前图片的 index
    // let currentIndex = 0;
    // setInterval(() => {
    //   let children = this.root.children;
    //   // 下一张图片的 index
    //   let nextIndex = (currentIndex + 1) % children.length;
    //   // 当前图片的节点
    //   let current = children[currentIndex];
    //   // 下一张图片的节点
    //   let next = children[nextIndex]; 
    //   // 禁用图片的动效
    //   next.style.transition = 'none'; 
    //   // 移动下一张图片到正确的位置
    //   next.style.transform = `translateX(${-100 * (nextIndex - 1)}%)`;

    //   // 执行轮播效果，延迟了一帧的时间 16 毫秒
    //   setTimeout(() => {
    //     // 启用 CSS 中的动效
    //     next.style.transition = ''; 
    //     // 先移动当前图片离开当前位置
    //     current.style.transform = `translateX(${-100 * (currentIndex + 1)}%)`;
    //     // 移动下一张图片到当前显示的位置
    //     next.style.transform = `translateX(${-100 * nextIndex}%)`;
    
    //     // 最后更新当前位置的 index
    //     currentIndex = nextIndex;
    //   }, 16);

    // }, 3000);

    return this.root;
  }
  mountTo(parent) {
    parent.appendChild(this.render());
  }
}
let d = [
  'https://source.unsplash.com/Y8lCoTRgHPE/1142x640',
  'https://source.unsplash.com/v7daTKlZzaw/1142x640',
  'https://source.unsplash.com/DlkF4-dbCOU/1142x640',
  'https://source.unsplash.com/8SQ6xjkxkCo/1142x640',
];
let a = <Carousel src={d}/>;

a.mountTo(document.body);
//  document.body.appendChild(a);
