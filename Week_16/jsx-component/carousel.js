import { Component } from "./framework";
import { enableGesture } from "./gesture.js";
import { Timeline, Animation } from "./animation.js";
import { ease } from "./ease.js";

export class Carousel extends Component {
  constructor() {
    super();
    this.attributes = Object.create(null);
  }
  setAttribute(name, value) {
    this.attributes[name] = value;
  }
  render() {
    console.log(this.attributes);
    this.root = document.createElement("div");
    this.root.classList.add("carousel");
    for (let record of this.attributes.src) {
      let child = document.createElement("div");
      child.style.backgroundImage = `url(${record})`;
      this.root.appendChild(child);
    }

    enableGesture(this.root);
    let timeline = new Timeline();
    timeline.start();

    let children = this.root.children;

    let handler = null;

    let position = 0;

    let t = 0;
    this.root.addEventListener("start", (event) => {
      timeline.pause();
      clearInterval(handler);
      let progress = (Date.now() - t) / 1500;
      ax = ease(progress) * 500 - 500;
    });
    this.root.addEventListener("pan", (event) => {
      let x = event.clientX - event.startX -ax;
      let current = position - (x - (x % 500)) / 500;

      for (let offset of [-1, 0, 1]) {
        let pos = current + offset;
        // 计算图片所在 index
        pos = ((pos % children.length) + children.length) % children.length;
        console.log("pos", pos);

        children[pos].style.transition = "none";
        children[pos].style.transform = `translateX(${
          -pos * 500 + offset * 500 + (x % 500)
        }px)`;
      }
    });

    this.root.addEventListener("panend", (event) => {
      timeline.reset();
      timeline.start();
      let x = event.clientX - event.startX -ax;
      let current = position - (x - (x % 500)) / 500;
      let direction = Math.round((x % 500) / 500);
      for (let offset of [-1, 0, 1]) {
        let pos = current + offset;
        // 计算图片所在 index
        pos = ((pos % children.length) + children.length) % children.length;
        console.log("pos", pos);

        children[pos].style.transition = "none";

        timeline.add(
          new Animation(
            children[pos].style,
            "transfrom",
            - pos * 500 + offset * 500 + x % 500,
            - pos * 500 + offset * 500 + direction * 500,
            1500,
            0,
            ease,
            (v) => `translateX(${v}px)`
          )
        );
      }
    });

    // this.root.addEventListener('mousedown', event => {
    //   let children = this.root.children;
    //   let startX = event.clientX;

    //   let move = event => {
    //     let x = event.clientX - startX;

    //     let current = position - ((x - x % 500) / 500);

    //     for (let offset of [-1, 0, 1]) {
    //       let pos = current + offset;
    //       // 计算图片所在 index
    //       pos = (pos + children.length) % children.length;
    //       console.log('pos', pos);

    //       children[pos].style.transition = 'none';
    //       children[pos].style.transform = `translateX(${-pos * 500 + offset * 500 + (x % 500)}px)`;
    //     }

    //   };

    //   let up = event => {
    //     let x = event.clientX - startX;
    //     position = position - Math.round(x / 500);

    //     for (let offset of [0, -Math.sign(Math.round(x / 500) - x + 250 * Math.sign(x))]) {
    //       let pos = position + offset;
    //       // 计算图片所在 index
    //       pos = (pos + children.length) % children.length;

    //       children[pos].style.transition = '';
    //       children[pos].style.transform = `translateX(${-pos * 500 + offset * 500}px)`;
    //     }

    //     document.removeEventListener('mousemove', move);
    //     document.removeEventListener('mouseup', up);

    //   };

    //   document.addEventListener('mousemove', move);
    //   document.addEventListener('mouseup', up);

    // });

    let nextPicture = () => {
      let children = this.root.children;
      // 下一张图片的 index
      let nextPosition = (position + 1) % children.length;
      // 当前图片的节点
      let current = children[position];
      // 下一张图片的节点
      let next = children[nextPosition];

      t = Date.now();
      // 禁用图片的动效
      // next.style.transition = "none";
      // 移动下一张图片到正确的位置
      // next.style.transform = `translateX(${500 - nextIndex * 500}px)`;

      timeline.add(
        new Animation(
          current.style,
          "transform",
          -position * 500,
          -500 - position * 500,
          1500,
          0,
          ease,
          (v) => `translateX(${v}px)`
        )
      );
      timeline.add(
        new Animation(
          next.style,
          "transfrom",
          500 - nextPosition * 500,
          -nextPosition * 500,
          1500,
          0,
          ease,
          (v) => `translateX(${v}px)`
        )
      );
      
      position = nextPosition;
      
    }

    // 当前图片的 index
    setInterval(nextPicture, 3000);

    return this.root;
  }
  mountTo(parent) {
    parent.appendChild(this.render());
  }
}
