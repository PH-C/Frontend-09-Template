# 重学CSS学习笔记
## 1.1 CSS 语法的研究
### 1.1.1 CSS 2.1 语法标准
- https://www.w3.org/TR/CSS21/grammar.html#q25.0
- https://www.w3.org/TR/css-syntax-3
  
[CSS 2.1 语法标准](https://www.w3.org/TR/CSS21/grammar.html)是使用 “产生式” 来表达的。但是这里会有一些 CSS 中特别的表达方式和标准：
- [ ] —— 方括号代表组的概念
- ? —— 问号代表可以存在和不存在
- | —— 单竖线代表 “或” 的意思
- * —— 星号代表 0 个或 多个

### 1.1.2 CSS 总体结构
- @charset 
- @import
- rules —— 多个规则，这里面的规则没有顺序要求
  - @media
  - @page 打印
  - rule —— 这里基本上就是我们平时写的 CSS 样式规则部分

## 1.2 CSS @规则的研究
At-rules
- @charset ： https://www.w3.org/TR/css-syntax-3/
- @import ：https://www.w3.org/TR/css-cascade-4/
- @media ：https://www.w3.org/TR/css3-conditional/
> - Media 不是在我们的 media query 标准里
> - 它在 CSS3 的 conditional 标准里
> - 但是在 media 的 conditional 标准中又去引用了 media query，规定了 media 后面的一部分的查询规则
> - 所以我们常常去讲 media query 是一个新特性，其实它并不是，它是类似一个预置好的函数的一个规范
> - 真正把 Media 特性真正引入到 CSS3 当中，是通过 CSS3 中的 conditional 标准
> - 那么 Conditional，就是 “有条件的”，顾名思义就是用来控制一些规则在有效条件下才会生效

- @page ： https://www.w3.org/TR/css-page-3/
> - page 是有一份单独的 CSS3 标准来表述它
> - 就是 css page 3 它主要是给我们需要打印的页面所使用的
> - 理论上这个叫做分页媒体，其实主要的分页媒体就是打印机
> - 我们的页面是不会有分页的
- @counter-style ：https://www.w3.org/TR/css-counter-styles-3
> - 我们平时写列表的时候会有一个 counter
> - 也就是列表最前面的那个 “小黑点” 或者是 “小数字”
- @keyframes ：https://www.w3.org/TR/css-animations-1/
> - keyframes 是用于我们的动画效果定义的
- @fontface ：https://www.w3.org/TR/css-fonts-3/
> - fontface 就是我们使用 web font 功能时候用到的
> - 它可以用来定义一切字体
> - 由此延伸出一个技巧叫 Icon font
- @supports ：https://www.w3.org/TR/css3-conditional/
> - 这个同样是来自于 conditional 的标准
> - 它是用来检查某些 CSS 的功能是否存在的
- @namespace ：https://www.w3.org/TR/css-namespaces-3/
> - 现在 HTML 里面除了 HTML 命名空间，还引入了 SVG、MathML 等这样的其他的命名空间的标记和标签
> - 所以 CSS 里面有了对应的设施，其实主要是 一个完备性的考量，并不是一个特别重要的规则

## 1.3 CSS规则的结构
```
div {
  background-color: blue;
}
```
- 选择器 —— selector (div)
  -  https://www.w3.org/TR/selectors-3/
  -  https://www.w3.org/TR/selectors-4/
- 声明 —— declaration
  - Key —— 键 (background-color)
    - Properties
    - Variables
      -  https://www.w3.org/TR/css-variables/
  - Value —— 值 (blue)
    - https://www.w3.org/TR/css-values-4/

## 1.4 实验 收集标准
### 收集整套 CSS 标准
``` javascript
// 获取 CSS 相关的标准列表
JSON.stringify(
  Array.prototype.slice
    .call(document.querySelector('#container').children)
    .filter(e => e.getAttribute('data-tag').match(/css/)) // 找到有 CSS tag 的
    .map(e => ({ name: e.children[1].innerText, url: e.children[1].children[0].href })) // 只获取标题名字和链接
);

```
### 获取爬取信息
``` javascript
let standards = [...] // 这里面的内容就是我们刚刚从 W3C 网页中爬取到的内容
                 
let iframe = document.createElement('iframe');
document.body.innerHtml = '';
document.body.appendChild(iframe);

function happen(element, event) {
  return new Promise(function (resolve) {
    let handler = () => {
      resolve();
      element.removeEventListener(event, handler);
    };
    element.addEventListener(event, handler);
  });
}

void (async function () {
  for (let standard of standards) {
    iframe.src = standard.url; // 让 Iframe 跳转到每个 standards 中的详情页面
    console.log(standard.name); 
    await happen(iframe, 'load'); // 等待 iframe 中的页面打开完毕
    console.log(iframe.contentDocument.querySelectorAll('.propdef')); // 这里打印出表格的内容
  }
})();

```
## 1.5 选择器语法
- 简单选择器
  - 星号 `* ` 
  - 类型选择器｜type selector --- div svg|a 
  - 类选择器｜class selector --- .cls 
  - ID 选择器｜id selector --- #id
  - 属性选择器｜attribute selector --- [attr=value]
  - 伪类 --- :hover
  - 伪元素选择器 --- ::before

## 1.6 选择器语法
- 复合选择器
  - <简单选择器><简单选择器><简单选择器> 
  -  `*` 或者 div 必须写在最前面
- 复杂选择器
  - <复合选择器><sp><复合选择器> 
  - <复合选择器>">"<复合选择器> 
  - <复合选择器>"~"<复合选择器>
  - <复合选择器>"+"<复合选择器>
  - <复合选择器>"||"<复合选择器>

## 1.7 选择器优先级
例子：#id div.a#id
- 这个里面包含了两个 ID 选择器，一个类型选择器和一个 class 选择器
- 根据一个 specificity 数组的计数 [inline-style个数,ID 选择器个数,class 选择器个数,tagName 选择器个数]
- 我们这个例子就会得出 specificity = [0, 2, 1, 1]
- 在选择器的标准里面，有一个这样的描述，我们会采用一个 N 进制来表示选择器优先级
- 所以 ``` Specificity = 0 ∗ N**3 + 2 ∗ N**2 + 1 ∗ N**1 + 1 ```
- 我们只需要取一个大的 N，算出来就是选择器的优先级了
- 比如说我们用 N = 1000000，那么 S = 2000001000001，这个就是这个例子中选择器的 specificity 优先级了

### 1.8 CSS 伪类
伪类其实是一类非常多的内容的简单选择器。

- 链接/行为
  - :any-link —— 可以匹配任何的超链接
  - :link —— 还没有访问过的超链接
  - :link :visited —— 匹配所有被访问过的超链接
  - :hover —— 用户鼠标放在元素上之后的状态，之前是只能对超链接生效，但是现在是可以在很多元素中使用了
  - :active —— 之前也是只对超链接生效的，点击之后当前的链接就会生效
  - :focus —— 就是焦点在这个元素中的状态，一般用于 input 标签，其实任何可以获得焦点的元素都可以使用
  - :target —— 链接到当前的目标，这个不是给超链接用的，是给锚点的 a 标签使用的，就是当前的 HASH指向了当前的 a 标签的话就会激活 target 伪类
  
- 树结构
  - empty —— 这个元素是否有子元素
  - :nth-child() —— 是父元素的第几个儿子（child）
  - :nth-last-child() —— 于 nth-child 一样，只不过从后往前数
  - :first-child :last-child :only-child
- 逻辑型
  - :not伪类
  - :where :has
> 这里还是像温馨建议一下大家，不建议大家把选择器写的过于复杂，我们很多时候都可以多加一点 class 去解决的。如果我们的选择器写的过于复杂，某种程度上意味着 HTML 结构写的不合理。我们不光是为了给浏览器工程省麻烦，也不光是为了性能，而是为了我们自身的代码结构考虑，所以我们不应该出现过于复杂的选择器。

## 1.9 CSS 伪元素

- ::before
- ::after
> ::before 和 ::after 是在元素的内容的前和后，插入一个伪元素。一旦应用了 before 和 after 的属性，declaration（声明）里面就可以写一个叫做 content 的属性（一般元素是没有办法写 content 的属性的）。content 的属性就像一个真正的 DOM 元素一样，可以去生成盒，可以参与后续的排版和渲染了。所以我们可以给他声明 border、background等这样的属性。
```
<div>
<::before/>
content content content content
content content content content
content content content content
content content content content
content content content content
content content content content
<::after/>
</div>
```
- ::first-line
- ::first-letter
> ::first-line 和 ::first-letter 的机制就不一样了。这两个其实原本就存在 content 之中。他们顾名思义就是 选中“第一行” 和选中 “第一个字母”。它们 不是一个不存在的元素，是把一部分的文本括了起来让我们可以对它进行一些处理。
```
<div>
  <::first-line>content content content content content</::first-line>
  content content content content
  content content content content
  content content content content
</div>

```


- first-line 可用属性
  - font 系列
  - color 系列
  - background 系列
  - word-spacing
  - letter-spacing
  - text-decoration
  - text-transform
  - line-height
- first-letter 可用属性
  - font 系列
  - color 系列
  - background 系列
  - text-decoration
  - text-transform
  - letter-spacing
  - word-spacing
  - line-height
  - float
  - vertical-align
  - 盒模型系列：margin, padding, border
