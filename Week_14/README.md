# 前端组件化基础知识学习笔记
> 组件化在前端架构里面是最重要的一个部分,组件化的概念是从开始研究如何扩展 HTML 标签开始的，最后延伸出来的一套前端架构体系。而它最重要的作用就是提高前端代码的复用性, 架构模式就是大家特别熟悉的 MVC, MVVM 等设计模式，这个话题主要关心的就是前端跟数据逻辑层之间的交互。
一个好的组件化体系是可以帮助一个前端团队提升他们代码的复用率，从而也提升了团队的整体效率

## 1.组件的基本知识|组件的基本概念和基本组成部分
### 1.1 对象与组件
对象三大要素：
- Properties —— 属性
- Methods —— 方法
- Inherit —— 继承关系

组件中的要素有：

- Properties —— 属性
  - 从属关系
- Methods —— 方法
  - 在 JavaScript 当中的 Property 是允许有 get 和 set 这样的方法的，所以最终 method 和 property 两者的作用也是差不多的。
- Inherit —— 继承
- Attribute —— 特性
  - 强调描述性
  - Attribute 是一种声明型的语言，也是标记型代码 Markup Code。
- Config & State —— 配置与状态 
  - 对组件的一种配置
  - 当用户去操作或者是一些方法被调用的时候，一个 state 就会发生变化
  - state 和 properties、attributes、config 都有可能是相似或者相同的
- Event —— 事件
  - 当一个组件内部因为某种行为或者事件触发到了变化时，组件就会给使用者发送 event 消息。所以这里的 event 的方向就是反过来的，从组件往外传输的
- Lifecycle —— 生命周期
- Children —— 子组件 
  - 组件形成树形结构的必要条件
### 1.2 组件 Component
![avatar](https://github.com/PH-C/Frontend-09-Template/blob/main/Week_14/1.jpg)

### 1.3 Attribute vs Property
Attribute:
```
<my-component attribute="v" />
<script>
  myComponent.getAttribute('a')
  myComponent.setAttribute('a', value)
</script>
```
Property:
```
myComponent.a = 'value';
```
> 从上面的例子来看，好像这只是两种不同的写法，其实它们的行为是有区别的。下面介绍一些实际的例子来体现这种不同之处。

#### 1.3.1 Class 属性
```
<div class="class1 class2"></div>

<script>
  var div = document.getElementByTagName('div');
  div.className // 输出就是 class1 class2	
</script>
```
>  Class 是一个关键字，所以早期 class 作为关键词是不允许做为属性名的,现在可以了，但是在 HTML 中属性中仍然叫做 class, 但是在 DOM 对象中的 property 就变成了 className。但是两者还是一个互相反射的关系的， 比如说在 React 里面，我们写 className它自动就把 Class 给设置了
#### 1.3.2 Style 属性
```
<div class="class1 class2" style="color:blue"></div>

<script>
  var div = document.getElementByTagName('div');
  div.style // 这里就是一个对象
</script>

```
> 有些时候 Attribute 是一个字符串，而在 Property 中就是一个字符串语义化之后的对象。最典型的就是 Style 。
在 HTML 里面的 Style 属性他是一个字符串，同时我们可以使用 getAttribute 和 setAttribute 去取得和设置这个属性。但是如果我们用这个 Style 属性，我们就会得到一个 key 和 vaule 的结构。
#### 1.3.3 Href 属性
```
<a href="//m.taobao.com"></a>
<script>
  var a = document.getElementByTagName('a');
  // 这个获得的结果就是 "http://m.taobao.com"， 这个 url 是 resolve 过的结果
  // 所以这个是 Property
  a.href;
  // 而这个获得的是 "//m.taobao.com", 跟 HTML 代码中完全一致
  // 所以这个是 Attribute
  a.getAttribute('href');
</script>

```
> 在 HTML 中 href 的 attribute 和 property 的意思就是非常相似的。但是它的 property 是经过 resolve 过的 url。

> 比如我们的 href 的值输入的是 “//m.taobao.com”。这个时候前面的 http 或者是 https 协议是根据当前的页面做的，所以这里的 href 就需要编译一遍才能响应当前页面的协议。

> 所以在我们 href 里面写了什么就出来什么的，就是 attribute。如果是经过 resolve 的就是我们的 property 了。

### 1.4 Input 和 value
> 在上面的代码中我们也可以看到，我们可以同时访问 property 和 attribute。它们的语义虽然非常的接近，但是它们不是一样的东西。

> 不过如果我们更改了任何一方，都会让另外一方发生改变。这个是需要我们去注意的现象
- 我们很多都以为 property 和 attribute 中的 value 都是完全等效的。其实不是的，这个 attribute 中的 input 的 value 相当于一个 value 的默认值。不论是用户在 input 中输入了值，还是开发者使用 JavaScript 对 input 的 value 进行赋值，这个 input 的 attribute 是不会跟着变的。
- 而在 input 的显示上是会优先显示 property，所以 attribute 中的 value 值就相当于一个默认值而已。这就是一个非常著名的坑，早期同学们有使用过 JQuery 的话，我们会觉得里面的 prop 和 attr 是一样的，没想到在 value 这里就会踩坑。

- 所以后来 JQuery 库就出了一个叫 val 的方法，这样我们就不需要去想 attribute 还是 property 的 value，直接用它提供的 val 取值即可。

### 1.5 如何设计组件状态
| Markup   | JS set         | JS Change        | User Input Change | -----  |
| -----    | -----          |  -----           |   -----           | -----  |
| ❎       | ✔             |   ✔              |      ❓           | Property  |
|  ✔       | ✔             |   ✔              |      ❓           | Attribute |
|  ❎      | ❎            |  ❎              |      ✔           | State |
|  ❎      | ✔             |  ❎              |      ❎           | Config |


- Property
  - ❎ 它是不能够被 markup 这种静态的声明语言去设置的
  - ✔ 但是它是可以被 JavaScript 设置和改变的
  - ❓ 大部分情况下 property 是不应该由用户的输入去改变的，但是少数情况下，可能是来源于我们的业务逻辑，才有可能会接受用户输入的改变
- Attribute
  - ❓ 用户的输入就不一定会改变它，与 Property 同理
  - ✔ 是可以由 markup，JavaScript 去设置的，同时也是可以被 JavaScript 所改变的

- State
  - ❎ 状态是会由组件内部去改变的，它不会从组件的外部进行改变。如果我们想设计一个组件是从外部去改变组件的状态的话，那么我们组件内部的 state 就失控了。因为我们不知道组件外部什么时候会改变我们组件的 state，导致我们 state 的一致性无法保证。
  - ✔ 但是作为一个组件的设计者和实践者，我们一定要保证用户输入是能改变我们组件的 state 的。比如说用户点击了一个 tab，然后点中的 tab 就会被激活，这种交互一般都会用 state 去控制的。
- Config
  - ✔ Config 在组件中是一个一次性生效的东西，它只会在我们组件构造的时候触发。所以它是不可更改的。也是因为它的不可更改性，所以我们通常会把 config 留给全局。通常每个页面都会有一份 config，然后拿着这个在页面内去使用。
### 1.6 组件生命周期 Lifecycle
![avatar](https://github.com/PH-C/Frontend-09-Template/blob/main/Week_14/2.jpg)

### 1.7 Children
``` html
<my-button>
  <img src="{{icon}}"/>
  {{title}}
</my-button>
<my-list>
  <li>
  <img src="{{icon}}"/>
  {{title}}
  </li>
</my-list>
```
- Content 型 Children —— 我们有几个 Children，但是最终就能显示出来几个 Children。这种类型的 Children，它的组件树是非常简单的。
- Template 型 Children —— 这个时候整个 Children 它充当了一个模版的作用。比如说我们设计一个 list，但是最后的结果不一定就与我们 Children 代码中写的一致。因为我们 List 肯定是用于多个列表数据的，所以 list 的表示数量是与我们传入组件的 data 数据所相关的。如果我们有 100 个实际的 children 时，我们的 list 模版就会被复制 100 份。

## 2.建立 Markup 
### 2.1 JSX 基本用法
> 首先我们来尝试理解 JSX，JSX 其实它相当于一个纯粹在代码语法上的一种快捷方式。JSX语法在被编译后会出现一个 React.createElement 的一个调用,
> 我们要怎么做让我们的 webpack 编译过程支持 JSX 语法呢？在这里我们需要安装使用@babel/plugin-transform-react-jsx，它做了什么呢？

例如

输入
```javascript
const a = (
  <div id="a">
    <span></span>
  </div>
);
```
输出
```javascript
const a = React.createElement("div", {
  id: 'a'
}, React.createElement("span", null));
```
> 如果需要将React.createElement自定义成我们创建元素的函数名称可以将pragma参数改成如：'createElement’，这样的话上面的输出会变成
```javascript
const a = createElement("div", {
  id: 'a'
}, createElement("span", null));
```
webpack.config.js修改成这样就行
```javascript
module.exports = {
  entry: './main.js',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              [
                '@babel/plugin-transform-react-jsx',
                { pragma: 'createElement' }
              ]
            ],
          },
        },
      },
    ],
  },
};

```
自定义的createElement函数
```javascript
function createElement(type, attributes, ...children) {
  // 创建元素
  let element = document.createElement(type);
  // 挂上属性
  for (let attribute in attributes) {
    element.setAttribute(attribute, attributes[attribute]);
  }
  // 挂上所有子元素
  for (let child of children) {
    if (typeof child === 'string') 
		  child = document.createTextNode(child);
    element.appendChild(child);
  }
  // 最后我们的 element 就是一个节点
  // 所以我们可以直接返回
  return element;
}
```
### 2.2 实现自定义标签
如果我们将a变量修改成首字母大写的标签包裹的元素
```javascript
let a = (
  <Div id="a">
    hello world：
    <span>a</span>
    <span>b</span>
    <span>c</span>
  </Div>
);
```
> 我们发现main.js在@babel/plugin-transform-react-jsx的翻译下，代码实际上会变成如下模样，@babel/plugin-transform-react-jsx会把首字母大写的自定义元素转成一个构造函数（类）如果是一个类,就在代码中创建一对元素，即我们需要实例化Div并给实例化后的实例对象设置属性id和class，如果是普通元素如我们直接使用dom自带的api 如果是元素节点则使用document.createElement()，如果是文本节点则使用document.createTextNode() 设置属性使用ele.setAttribute(name, value)，
```javascript
createElement(
      Div,
      {
        id: "a",
      },
      "hello world：",
      createElement("span", null, "a"),
      createElement("span", null, "b"),
      createElement("span", null, "c"),
)
```

```javascript
function createElement(type, attributes, ...children) {
  // 创建元素
  let element;
  if (typeof type === 'string') {
    element = document.createElement(type);
  } else {
    element = new type(); // 实例化元素类
  }

  // 挂上属性
  for (let name in attributes) {
    element.setAttribute(name, attributes[name]);
  }
  // 挂上所有子元素
  for (let child of children) {
    if (typeof child === 'string') child = document.createTextNode(child);
    element.appendChild(child);
  }
  // 最后我们的 element 就是一个节点
  // 所以我们可以直接返回
  return element;
}

```
> 我们还需要使用自定义元素节点ElementWrapper类，使用文本节点TextWrapper类，同时在createElement函数中用new ElementWrapper(type)替换document.createElement()，如果是文本节点则使用new new TextWrapper(child)替换document.createTextNode()。
```javascript
class TextWrapper {
  // 构造函数
  // 创建 DOM 节点
  constructor(content) {
    this.root = document.createTextNode(content);
  }
  // 挂載元素的属性
  setAttribute(name, attribute) {
    this.root.setAttribute(name, attribute);
  }
  // 挂載元素子元素
  appendChild(child) {
    child.mountTo(this.root);
  }
  // 挂載当前元素
  mountTo(parent) {
    parent.appendChild(this.root);
  }
}

class ElementWrapper {
  // 构造函数
  // 创建 DOM 节点
  constructor(type) {
    this.root = document.createElement(type);
  }
  // 挂載元素的属性
  setAttribute(name, attribute) {
    this.root.setAttribute(name, attribute);
  }
  // 挂載元素子元素
  appendChild(child) {
    child.mountTo(this.root);
  }
  // 挂載当前元素
  mountTo(parent) {
    parent.appendChild(this.root);
  }
}


function createElement(type, attributes, ...children) {
  // 创建元素
  let element;
  if (typeof type === 'string') {
    element = new ElementWrapper(type);
  } else {
    element = new type();
  }
  // 挂上属性
  for (let attribute in attributes) {
    element.setAttribute(attribute, attributes[attribute]);
  }
  // 挂上所有子元素
  for (let child of children) {
    if (typeof child === 'string') 
      child = new TextWrapper(child);
    element.appendChild(child);
  }
  // 最后我们的 element 就是一个节点
  // 所以我们可以直接返回
  return element;
}
```