export function createElement(type, attributes, ...children) {
  console.log('type:', type)
  // 创建元素
  let element;
  if (typeof type === "string") {
    element = new ElementWrapper(type);
  } else {
    element = new type();
  }

  // 挂上属性
  for (let name in attributes) {
    element.setAttribute(name, attributes[name]);
  }
  let processChildren = (children) => {
    // 挂上所有子元素
    for (let child of children) {
      if((typeof child === "object") && (child instanceof Array)){
        processChildren(child)
        continue
      } 
      if (typeof child === "string") {
        child = new TextWrapper(child);
      }
      console.log(child)
      element.appendChild(child);
    }
  }
  processChildren(children)
  
  // 最后我们的 element 就是一个节点
  // 所以我们可以直接返回
  return element;
}

export let STATE = Symbol("state");
export const ATTRIBUTE = Symbol("attribute");

export class Component {
  constructor(type) {
    this[ATTRIBUTE] = Object.create(null);
    this[STATE] = Object.create(null);
  }
  render(){
    return this.root
  }
  // 挂載元素的属性
  setAttribute(name, value) {
    this[ATTRIBUTE][name] = value;
  }

  // 挂載元素子元素
  appendChild(child) {
    child.mountTo(this.root);
  }
  // 挂載当前元素
  mountTo(parent) {
    if(!this.root)
      this.render()
    parent.appendChild(this.root);
  }
  triggerEvent(type, args){
    this[ATTRIBUTE]["on" + type.replace(/^[\s\S]/, s => s.toUpperCase())](new CustomEvent(type, { detail: args }))
  }
  
}

class ElementWrapper extends Component {
  // 构造函数
  // 创建 DOM 节点
  constructor(type) {
    super()
    this.root = document.createElement(type);
  }
  // 挂載元素的属性
  setAttribute(name, value) {
    this.root.setAttribute(name, value);
  }
  
}

class TextWrapper extends Component {
  // 构造函数
  // 创建 DOM 节点
  constructor(content) {
    super()
    this.root = document.createTextNode(content);
  }
}
