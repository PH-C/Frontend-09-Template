
import { Component, createElement } from './framework.js';
import { Carousel } from './carousel.js';
import { Timeline, Animation } from './animation.js';

let d = [
  'https://source.unsplash.com/Y8lCoTRgHPE/1142x640',
  'https://source.unsplash.com/v7daTKlZzaw/1142x640',
  'https://source.unsplash.com/DlkF4-dbCOU/1142x640',
  'https://source.unsplash.com/8SQ6xjkxkCo/1142x640',
];
let a = <Carousel src={d}/>;

a.mountTo(document.body);

let tl = new Timeline();

window.tl = tl;
window.animation = new Animation(
  {
    set a(a) {
      console.log(a);
    },
  },
  'property',
  0,
  100,
  1000,
  null
);

tl.start();
