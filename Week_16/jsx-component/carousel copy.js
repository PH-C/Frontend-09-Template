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
    // console.log(this.attributes);
    this.root = document.createElement("div");
    this.root.classList.add("carousel");
    for (let record of this.attributes.src) {
      let child = document.createElement("div");
      child.style.backgroundImage = `url(${record})`;
      this.root.appendChild(child);
    }

    enableGesture(this.root);
    let timeline = new Timeline;
    timeline.start();

    let handler = null;

    let children = this.root.children;

    let position = 0;
    
    let t = 0;
    let ax = 0;

    this.root.addEventListener("start", (event) => {
      timeline.pause();
      clearInterval(handler);
      if (Date.now() - t < 500){
        let progress = (Date.now() - t) / 500;
        ax = ease(progress) * 500 - 500;
      } else {
        ax = 0;
      }
     
    });

    this.root.addEventListener("pan", (event) => {
      let x = event.clientX - event.startX -ax;
      let current = position - ((x - x % 500) / 500);

      for (let offset of [-1, 0, 1]) {
        let pos = current + offset;
        // 计算图片所在 index
        pos = (pos % children.length + children.length) % children.length;
        // console.log("pos", pos);

        children[pos].style.transition = "none";
        children[pos].style.transform = `translateX(${-pos * 500 + offset * 500 + x % 500}px)`;
      }
    });

    this.root.addEventListener("end", (event) => {
      timeline.reset();
      timeline.start();
      handler = setInterval(nextPicture, 3000)

      let x = event.clientX - event.startX -ax;
      let current = position - ((x - (x % 500)) / 500);

      let direction = Math.round((x % 500) / 500);

      if(event.isFlick) {
        if(event.velocity < 0){
          direction = Math.ceil((x % 500) / 500)
        } else {
          direction = Math.floor((x % 500) / 500)
        }
        console.log(event.velocity)
      }

      for (let offset of [-1, 0, 1]) {
        let pos = current + offset;
        // 计算图片所在 index
        pos = ((pos % children.length) + children.length) % children.length;
        // console.log("pos", pos);

        children[pos].style.transition = "none";

        timeline.add(
          new Animation(
            children[pos].style,
            "transform",
            - pos * 500 + offset * 500 + x % 500,
            - pos * 500 + offset * 500 + direction * 500,
            500,
            0,
            ease,
            (v) => `translateX(${v}px)`
          )
        );
        position = position - ((x - (x % 500)) / 500) - direction;
        position = ((position % children.length) + children.length) % children.length;
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

      timeline.add(
        new Animation(
          current.style,
          "transform",
          -position * 500,
          -500 - position * 500,
          500,
          0,
          ease,
          (v) => `translateX(${v}px)`
        )
      );
      timeline.add(
        new Animation(
          next.style,
          "transform",
          500 - nextPosition * 500,
          -nextPosition * 500,
          500,
          0,
          ease,
          (v) => `translateX(${v}px)`
        )
      );
      
      position = nextPosition;
      
    }

    // 当前图片的 index
    // nextPicture()
    handler = setInterval(nextPicture, 3000);

    return this.root;
  }
  mountTo(parent) {
    parent.appendChild(this.render());
  }
}
