# 重学HTML学习笔记
## 1 HTML的定义：XML与SGML
### 1.1 DTD与XML namespace
- http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd
- http://www.w3.org/1999/xhtml

- DTD是SGML规定的定义它的子集的文档的格式
- HTML最早设计出来是SGML的一个子集，所以它有这个DTD

### 1.2 namespace

- HTML
- XHTML
- MathML
- SVG

## 2 HTML标签语义
- header
- aside
- nav
- section
## 3 HTML语法
### 3.1 合法元素

- Element:`<tagName>...</tagName>`
- Text:text
- Comment:`<!--comments-->`
- DocumentType:`<!Doctype html>`
- ProcessingInstruction:`<?a 1?> `预处理
- `CDATA:<![CDATA[]]>` 一种特殊的语法，产生的也是文本节点，不需要考虑转义问题

字符引用

- `&#161;` 
- `&amp;` &
- `&lt;` <
- `&quot;` "

## 4 浏览器API|DOM API
> 不只是dom api

### 4.1 NODE 节点
- Element：元素型节点，跟标签对应
  - HTMLElement
    - HTMLAnchorElement
    - HTMLAppletElement
    - HTMLAreaElement
    - HTMLAudioElement
    - HTMLBaseElement
    - HTMLBodyElement 
    - ...
  - SVGElement
    - SVGAElement
    - SVGAltGlyphElement 
    - ...
- Document:文档根节点
- CharacterData字符数据
  - Text:文本节点
    - CDATASection:CDATA节点
  - Comment：注释
  - ProcessingInstruction:处理信息
- DocumentFragment:文档片段
- DocumentType:文档类型

### 4.2 导航类操作

- Node
  - parentNode
  - childNodes
  - firstChild
  - lastChild
  - nextSibling
  - previousSibling
- element
  - parentElement
  - children
  - firstElementChild
  - lastElementChild
  - nextElementSibling
  - previousElementSibling

### 4.3 修改操作

- appendChild 添加一个节点到所有子元素的后面
- insertBefore 插入一个节点到某个子元素的前面
- removeChild 删除一个子元素
- replaceChild 替换一个子元素

### 4.4 高级操作

- compareDocumentPosition 是一个用于比较两个节点中关系的函数
- contains 检查一个节点是否包含另一个节点的函数
- isEqualNode 检查两个节点是否完全相同
- isSameNode 检查两个节点是否是同一个节点，实际在JavaScript中可以使用“===”
- cloneNode 复制一个节点，如果传入参数true，会连同子元素做深拷贝
  
## 5.浏览器API|事件API

## 5.1 addEventListener(type, listener, options)
- type 定义要监听的事件类型
- listener 必须是一个JS函数或者是实现了EventListener接口的对象
- options
  - capture boolean类型，表示是否在捕获阶段触发listener
  - once boolean类型，设置为true，listener会被触发调用一次之后移除
  - passive boolean类型，设置为true时，在listener内部不可调用- 
  - preventDefault（可以用于移动端滑动事件优化）
## 5.2 冒泡与捕获
- 冒泡和捕获是浏览器处理事件的一种机制，在任何一个事件的触发过程中都会发生，而和我们是否添加监听没有关系
- 任何一个事件都是先捕获后冒泡,我们无法直接从鼠标获取点击的位置，而是由浏览器从外到内计算事件发生在哪个元素上，这就是捕获阶段，从触发元素层层向外相应事件的过程就是冒泡阶段

## 6.浏览器API|Range API
## 6.1 一个问题：把一个元素所有的子元素逆序
使用range api
``` html
<div id="a">
  <span>1</span>
  <p>2</p>
  <a>3</a>
  <div>4</div>
</div>
<script>
    let element = document.getElementById('a');
    function reveseChildren(element){

       var range = new Range();//创建一个range对象
       
       range.selectNodeContents(element);//选中元素的所有内容

       let fragment = range.extractContents();//从dom上取下所有选中内容,DOM树上提取一个Range里面的内容, range.extractContents调用后，range中的内容就会从DOM树中移除extractContents返回的是一个Fragment对象,

        // 操作fragment，不重排不影响页面布局
       let l = fragment.childNodes.length;
       while(l-- > 0){
           fragment.appendChild(fragment.childNodes[l])
           // Fragment是Node的一个子类，可以容纳一些元素，在appendChild的操作时，不会将自身添加到DOM上，而是会将所有的子节点放上去
       }

       //修改后的fragment的内容再次放回元素中
       element.appendChild(fragment);
    }

    reveseChildren(element)
</script>
```
## 6.2 Range API
Range
- 范围，可以理解为HTML文档流里面的有一个起始点和一个终止点的一段范围
- range是不能跳的，可能会有多个Range，但是每一个range一定是连续的
- range只需要起点在DOM树中的位置先于终点即可，不需要管层级关系
- 起止点都是由一个element和偏移值来决定的 
```
 var range = new Range()
 range.setStart(element, 9)
 range.setEnd(element, 4)
 var range = document.getSelection().getRangeAt(0)
```
一些便捷API
- range.setStartBefore 把起点设置到某个节点之前
- range.setEndBefore 把终点设置到某个节点之前
- range.setStartAfter 把起点设置到某个节点之后
- range.setEndAfter 把终点设置到某个节点之后
- range.selectNode 使 Range 包含某个节点及其内容，元素标签的开始位置即为<前面
- range.selectNodeContents 选择一个节点（一般是元素）的内容
```html
<div id="a">123
<span style="background-color: pink;">456789</span>0123456789</div>
<script>
  let range = new Range();
  range.setStart(document.getElementById("a").childNodes[1].childNodes[0], 3);
  range.setEnd(document.getElementById("a").childNodes[2], 3);
</script>
```
## 7.浏览器API|CSSOM
CSSOM的访问
- document.styleSheets 
  
### 7.1 使用css的方法
- style标签
- link标签

### 7.2 Rules

- document.styleSheets[0].cssRules 获取样式，只读
- document.styleSheets[0].insertRule("p{color:pink;}", 0) 插入样式 0： 插入的style样式字符串 1： 插入的位置
- document.styleSheets[0].removeRule(0) 删除样式


### 7.3 Rule

- CSSStyleRule
  - selectorText String 选择器部分
  - style k-v结构 样式部分
- CSSCharsetRule
- CSSImportRule
- CSSMediaRule
- CSSFrontFaceRule
- CSSPageRule
- CSSNamespaceRule
- CSSKeyframesRule
- CSSKeyframeRule
- CSSSupportsRule 
- ...
### 7.4 getComputedStyle 计算后的css样式(最终渲染的样式)

- 使用方式 window.getComputedStyle(el, preudoEl)
  - el 想要获取的元素
  - preudoEl 可选，伪元素
- 使用场景
  - 比如元素需要做拖拽，获取元素的transform
  -  transform, CSS动画的中间态，想要暂停动画，没有办法DOM API，style和cssRule判断播到哪了，需要使用getComputedStyle去获取实时的状态

## 8.浏览器API|CSSOM View
获取layout和render后的一些信息

### 8.1 window

- window.innerWidth，window.innerHeight 浏览器实际渲染html内容的区域的宽高
- window.outerrWidth，window.outerHeight 浏览器窗口总共占的宽高，包括工具栏
- window.devicePixelRatio
屏幕上的物理像素和代码里面的逻辑像素px之间的比值
正常的设备，比值是1:1，retina屏上是1:2，在有些安卓机上还有可能是1:3
- window.screen 屏幕的信息
  - window.screen.width 屏幕宽
  - window.screen.height 屏幕高
  - window.screen.availWidth 屏幕可用宽
  - window.screen.availHeight 屏幕可用高（去除物理按键占用的部分，取决于硬件配置）

### 8.2 Window API

- window.open("about:blank", "_blank", "width=100,height=100,left=100,right=100")
原始的标准里面的定义只有两个参数，但是CSSOM的Window API给它加了第三个参数
我们可以指定，我们打开的窗口的宽高和在屏幕上所处的位置
- moveTo(x,y); 移动我们自己创建的窗口的位置，直接修改为目标值
- moveBy(x, y); 移动我们自己创建的窗口的位置，在原来的基础上增加值
- resizeTo(x, y); 修改我们自己创建的窗口的位尺寸，直接修改为目标值
- resizeBy(x, y); 修改我们自己创建的窗口的位尺寸，在原来的基础上增加值

### 8.2 scroll API
- scroll的元素
  - scrollTop 当前元素当前滚动到的位置（垂直方向）
  - scrollLeft 当前元素滚动到的位置（水平方向）
  - scrollwidth 可滚动类型的最大宽度
  - scrollHeight 可滚动类型的最大高度
  - scroll(x, y) 滚动到一个坐标位置
  - scrollBy(x, y) 在当前基础上滚动一段距离
  - scrollIntoView() 滚动到元素的可见区域
- window的scroll
  - scrollX 窗口水平方向滚动到的位置，对应元素的scrollLeft
  - scrollY 窗口垂直方向滚动到的位置，对应元素的scrollTop
  - scroll(x,y) 和元素scroll的一致
  - scrollBy(x,y) 和元素scrollBy的一致

### 8.2 layout API
- getClientRects() 获取元素内部生成的所有盒的位置大小信息
- getBoundingClientRect() 获取元素本身占用的位置和大小信息
``` html
<style>
    .x::before{
        content:"额外 额外 额外 额外 额外";
        background-color:pink;
    }
</style>

<div style="width:100px;height:400px;overflow:auto;">
    文字<span class="x" style="background-color:lightblue;">文字 文字 文字 文字 文字 文字 文字</span>
</div>
<script>
    var x = document.getElementsByClassName('x')[0];
    //获取x元素layout时内部生成的所有盒的信息（会有多个盒产生，是一个数组），并且x的伪元素也会参与到生成盒的过程中
    console.log(x.getClientRects());
    //获取x元素layout时包含所有内部生成盒的容器的信息，这个容器的大小等同于元素的实际占用的空间大小
    console.log(x.getBoundingClientRect());
</script>
```
## 9 浏览器API|其他 API
- khronos
  - WebGL
- ECMA
  -  ECMAScript
- WHATWG
  - HTML
- W3C
  - webaudio
  - CG/WG     