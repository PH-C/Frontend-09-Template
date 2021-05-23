# 学习笔记
## 1 盒 ( Box )

- 标签 ( Tag ) —— 源代码
- 元素 (Element) —— 语义
- 盒 ( Box ) —— 表现



> - HTML 代码中可以书写开始标签，结束标签，和自封闭标签。
> - 一对起止标签，表示一个元素。
> - DOM 树中存储的是元素和其他类型的节点 ( Node )。
> - CSS 选择器中的是元素。
> - CSS 选择器中的元素，在排版时可能产生多个盒。
> - 排版和渲染的基本单位是盒
> - 排版和渲染的基本单位是盒

### 1.1 盒模型是一个多层的结构，从里面到外面分为：

- 最里面就是content，也就是我们的内容
- content 到 border 之间有一个圈空白，这个圈叫做 padding，也就是内边距
- Border 的外面又有一个圈空白叫 margin，也就是外边距
- padding 主要影响的是盒内的空间 —— 主要决定盒内的空间排布，也就是 content 区域的大小
- margin 主要影响的是盒外的空间 —— 决定了盒周围空白区域的大小

### 1.2 盒模型里面的 宽 (width) 是有讲究的，盒子的宽度是有可能被 box-sizing 属性所影响的。最常见的两个值就是：

### content-box

设置的 width 属性只包含 content 的内容的空间。也就是说：

盒子占用的空间 = content 的大小 + padding 的大小 + border 的大小 + margin 的大小

### border-box
使用border-box，我们的 width 就包含了 padding 和 border 的尺寸了

## 2 正常流
CSS 的排版其实是有三代的排版技术的：

- 第一代就是正常流
- 第二代就是基于 Flex 的排版
- 第三代就是基于 Grid 的排版
- 结合最近推出的 CSS Houdini，可能更接近的是 3.5 代，它是一种完全自由的，允许使用 JavaScript 干预的排版

### 2.1 正常流排版

正常流排版的整个过程，与实现 flex 的过程比较类似，有这几个步骤：

- 收集盒进行(hang)
- 计算盒在行中的排布
- 计算行与行之间的排布

> - inline-level-box 在行内插入图片，这种叫做行内盒,文字和 inline level 行内的盒排出来的行，我们就叫做 “行盒 ( line-box ), 行内排布的我们就叫 IFC —— Inline level formatting context (行内级格式化上下文)
> - block-level-box 单独占一行，这种类型的盒叫做块级盒,自然的正常流，整体来看就是一个个的 line-box 和 block-level-box 的从上到下的摆布, 块级排布的我们就叫 BFC —— Block level formatting context (块级格式化上下文)

## 3 正常流的行级排布

- 基线对齐
- 文字字形定义

### 3.1 行模型
- line-top
- text-top
- base-line
- text-bottom
- line-bottom
> - 我们的行内盒是默认与基线对齐的规则。也就是说盒的下边缘会和文字的基线去做对齐
> - 当一个盒子里面有文字的时候，这个盒子的对齐就会基于里面文字的基线做对齐。
> - 行内盒 inline-block 的基线是随着自己里面的文字去变化的。所以说大部分情况下是不建议大家给行内盒使用基线对齐的。

所以我们在使用行内盒的时候就需要给一个 vertical-align，属性值我们可以给 top，bottom或者是middle都是可以的

## 4 正常流的块级排布

### 4.1 Float 和 Clear
Float 和 Clear 也称为 浮动 与 清除浮动
> - float 元素可以先排到页面的某一个特定的位置，同时可以当它是正常流里的元素。然后如果它的属性中有 float 的时候，这个元素就会朝着 float 属性定义的方向去挤。假设元素加入一个 float: left 属性，这个时候，这个元素就会往左边去挤
> - 如果我们有两个 float 元素的时候，还会出现一种float 元素相堆叠的效果

这种堆叠效果不符号设计要求，所以这里我们可以给 float 加一个 clear 属性，这样我们就可以让它们强制换行了。所谓的 clear 有的翻译成 “清除浮动”，但是我觉得它不是清除浮动的意思。理论上来说它是 “找一个干净的空间来执行浮动” 的意思。clear 是有分 left 和 right，指的是向左或者右找干净的空间进行浮动。

### 4.2 Margin 折叠
> - 在 BFC 里我们的元素是顺次从上往下排的，但是顺次从上往下排的时候还是会受它的盒模型影响的。
> - 在一个从上往下排布的 BFC 里面，有一个元素它有 margin，接着还有一个元素，它也有 margin,如果一个是 10px，一个是 15px 的 margin，最后两个元素之间的空间就是 15px（使用了两个 margin 的最大值）。这个现象就是 Margin Collapse (留白折叠/边距折叠)。
> - 我们要注意，这种 Margin Collapse 只会发生在 BFC 里面。它不会发生在 IFC 或者其他的排版方式里面，比如说 flex、grid 等都不会有 Margin Collapse 的。所以只有正常流中的 BFC 会发生边距折叠！

## 5 BFC 合并

Block (块)


- Block Container (里面能装 BFC 的盒
能容纳正常流的盒，里面就有 BFC)
  - block
  - inline-block
  - table-cell —— 里面都是正常流，但是 table-row 就不是 block cotainer 了，因为它里面是 table-cell，所以不可能是正常流
  - flex item —— display: flex 的元素不是 block container，但是 flex 的子元素 flex item 如果它们没有特殊的 display 属性的话它们都是 block container。
  - grid cell —— grid 也是有 cell 的，所有 grid 的 cell 默认也都是 block container
  - table-caption —— table 中有 table-caption (表格标题)，它里面也是正常流

  - 能容纳正常流的盒，里面就有 BFC
- Block-level Box (外面有 BFC 的盒,
也就是说它能够被放入 BFC 的这种盒子里)
我们大多数的元素的 display 的值都是有一对的。一个是 block-level 的，一个是 inline-level 的。

  - display: block, display: inline-block
  - display: flex	, display: inline-flex
  - display: grid	, display: inline-grid
  - display: table, display: inline-table

- Block Box = Block Container + Block-level Box
  - 就是上面两个之和
  - 里外都有 BFC 的盒

设立 BFC

以下情况下会 设立 BFC

- floats —— 浮动的元素里面就是一个正常流，所以会创建 BFC
- Abusolutely positioned elements —— 绝对定位的元素里面也会创建 BFC
- block containers (such as inline-blocks, table-cells, and table-captions) that are not block boxes —— 就是这个 block container 但是不是 block box (也就是不是 block-level ) 会创建 BFC，包括以下：
  - inline-blocks
  - table-cells
  - table-captions
  - Flex items
  - grid cell
  - 等等…
- and block boxes with overflow other than visible —— 就是拥有 overflow 属性，但是不是 visible 的 block box 也会创建 BFC

> 默认这些能容纳正常流的盒，我们都认为它们会创建 BFC，但是只有一种情况例外：就是 block box 里外都是 BFC 并且 overflow 是 visible。用公式来记就是这个：“block box && overflow:visible”

BFC 合并与边距折叠'

BFC 只会发生在同一个 BFC 里面。如果创建了新的 BFC 的话，它就不会发生边距折叠。如果没有创建 BFC 的话，它就存在着一个同向边距折叠。
## 6 Flex 排版
Flex 的排版逻辑分为三步：

- 收集盒进行
- 计算盒在主轴方向的排布
- 计算盒在交叉轴方向的排布

### 6.1 分行
- 根据主轴尺寸，把元素分进行。
- 每加入一个元素到当前行，我们就会让它与行剩余的空间去做比较。
- 如果当前行已经满了，就创建一个新行，把新元素放到下一行。
- 若设置了 no-wrap，则强制分配进入第一行。（到计算主轴的时候，我们再去处理这些溢出的部分）

### 6.2  计算主轴方向

- 找出所有 Flex 元素
- 把主轴方向的剩余尺寸按比例分配给这些元素
- 若剩余空间为负数，所有 flex 元素为 0，等比压缩剩余元素

### 6.3 计算交叉轴方向
- 根据每一个行最大元素尺寸计算行高
- 根据行高 flex-align 和 item-align ，确定元素具体位置

## 7 CSS 动画
CSS 当中控制表现的无非就是三类：
- 控制元素位置和尺寸的信息
- 控制位置和最后实际看到的渲染信息
- 交互与动画的信息

### 7.1 Animation
- 使用 @keyframes 去定义动画的关键帧
```
@keyframes myKf {
  from { background: red; }
  to { background: yellow; }
}
```
> 首先我们可以使用 keyframes 这个 @ rule 来定义一个关键帧。然后使用 from 和 to，它们里面定义的都是 CSS declaration（CSS 属性和值得声明）

- 使用 animation 属性去使用关键帧的部分
```
div {
  animation: mkf 5s infinite;
}
```
### 7.2 Animation 属性
- animation-name —— 时间曲线
- animation-duration —— 动画的时长
- animation-timing-function —— 动画的时间曲线
- animation-delay ——动画开始前的延迟
- animation-iteration-count —— 动画的播放次数
- animation-direction —— 动画的方向

### 7.3 Keyframes 定义
```
@keyframes myKf {
  0% { top: 0; transition: top ease }
  50% {top: 30px; transition: top ease-in }
  75% { top 10px; transition: top ease-out  }
  100% { top: 0; transition: top linear }
}
```
### 7.4 Transition
- transition-property —— 要变换的属性
- transition-duration —— 变换的时长
- transition-timing-function —— 时间曲线
- transition-delay —— 延迟

### 7.5 Cubic-bezier 三次贝塞尔曲线
Timing-function 它其实来自于一个三次贝塞尔曲线，我们所有的 timing-function 都跟三次贝塞尔曲线有相关。

可以通过 cubic-bezier.com 的网站开始了解 cubic bezier。

在 CSS 动画当中，其实里面有几个内置的几个三次贝塞尔曲线的：

- ease —— 是一个标准的缓动曲线，经历过无数前辈摸索出来的，也是一种最自然的曲线形态
- linear —— 是一个直线，相当于退化为一个一次曲线，这个我们是没有必要去使用的
- ease-in —— 缓动启动，往往是用于退出动画
- ease-out —— 缓动停止，用于进入动画
- ease-in-out —— 是 ease-in 和 ease-out 的对称的动画

### 7.6 贝塞尔曲线拟合
贝塞尔曲线理论上，我们可以用控制点可以拟合任何的形状。

> 比如说我们想拟合一个弧形，或者很像一个半圆形。但是我们究竟能否做出一个半圆形呢？其实我们也不是特别的知道。但是贝塞尔曲线有两样东西是一定能够拟合出来的：

- 直线 —— 只要把两个控制点都放在两个点的直线上
- 抛物线 —— 在数学上可以证明是贝塞尔曲线可以完美拟合的

## 8 Color 颜色

这里我们要有一个认识，就是我们大部分看到的光都是混色的混合光。

### 8.1 CMYK 与 RGB
> 我们的眼睛里面有用于感觉颜色和感受强光的视锥细胞，那么视锥细胞我们只有 3 种。这三种视锥细胞分别能感应红、绿、蓝三原色的光。这个也是我们 RGB 颜色的一个来历。
> 其实我们小时候学的红、黄、蓝，它不是红黄蓝”。其实应该是品红、黄和青。而这三个颜色正好是红绿蓝的补色，也就是说我们色谱中的三原色和我们小时候调色的时候使用的三原色，它们是一个补色的三原色。那么为什么我们小时候调的是补色的三原色呢？因为我们小时候调的是颜料，颜料它其实是吸收对应的光的。而光是混合起来增强对应的光的。所以我们想用颜料调出所有对应的颜色，我们就要使用红黄蓝三原色。

> 在印刷行业里面都会使用 品红、青、黄 三原色，也叫 CMY 色系。我们也会发现在印刷行业用的不是 CMY 颜色，而是 CMYK 颜色。那又为什么是 CMYK 颜色呢？因为彩色的颜料相对比较贵，如果我们想调出黑色的话，那就需要把 CMY 颜色都混合到一起才能出这个黑色。不过黑色本来就是一种非常便宜的油墨，而品红、青和黄都是非常昂贵的油墨。这就意味着我们基本上不会用这三种贵的油墨混合起来调出一个特别便宜的黑色油墨。

> 所以说在印刷行业用的基本都是 CMYK 颜色。

### 8.2 HSL 与 HSV
> 这里我们就讲完颜色的基本原理了，但是在编程中我们就会发现 RGB 这个颜色或者是 CMYK 的颜色都并不好用。因为它们是跟我们对颜色的认知的直觉是不一致的。但是跟我们的生理结构是一致的。所以考虑到我们程序员的感受而考虑，又有了一种新的颜色的谱系：HSL 和 HSV。

- H 就是 Hue 的缩写，表示的是 色相
- S 就是 Saturation的缩写，表示的是 纯度。比如颜色里面的杂色的数量，颜色中的 S 越高，这个颜色就越鲜艳越纯。
- L 或者 V, 首先 L 就是 Lightness 的缩写，表示的是 亮度。而 V 就是 Value，可以翻译成色值，但是在理论上它真正表示的是 Brightness 也就是 明度

HSL 和 HSV 在很多的时候实际上几乎是完全等价的。但是唯一不一样的就是：

- Value 到 100% 的时候颜色就会变成一个纯色
- Lightness 就不一样了，它是一个上下对称的，Lightness 到 0% 的时候他是黑色，而到 100% 的时候就是纯白色。所以我们取一个颜色的纯色我们是需要取 Lightness 的中间值的。
- 两者就是一个逻辑的不一样，有些人认为 HSV 更符合人类的认知

## 9 绘制
- 几何图形
  - border
  - box-shadow
  - border-radius
- 文字
  - font。在文字的 font 字体文件里面，规定了每个文字的字形叫 glyph。这个字形其实与我们的矢量图是差不多的，它最后也会被以类似于矢量图的方式画到图片上。
  - text-decoration
- 位图
  - background-image

### 应用技巧 
- data url  svg。这里因为我们可以使用 background-image ，所以我们可以把这个 svg 变成 data uri。
- ```<img src="data:image/svg+xml,<svg with="100%" height="100%" version="1.1" xmlns="http://www.w3.org/2000/svg"><ellipse cx="300" cy="150" rx="200" ry="80" style="fill:rgb(200,100,50); stroke:rgb(0,0,100); stroke-width:2"/> </svg>" />```










