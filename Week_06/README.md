
# 学习笔记
-------------------

[TOC]
## 一、JS语言通识
### 语言按语法分类
- 非形式语言：中文，英文
- 形式语言

   - 乔姆斯基谱系：是计算机科学中刻画形式文法表达能力的一个分类谱系，是由诺姆·乔姆斯基于 1956 年提出的。它包括四个层次：四种文法是上下包含关系
     - 0- 型文法（无限制文法或短语结构文法）包括所有的文法。
     - 1- 型文法（上下文相关文法）生成上下文相关语言。
     - 2- 型文法（上下文无关文法）生成上下文无关语言。
     - 3- 型文法（正规文法）生成正则语言。

### BNF（用来定义形式语言语法的记号法）
BNF范式(巴科斯范式)是一种用递归的思想来表述计算机语言符号集的定义规范。
基本结构为 
`<non-terminal>::=<replacement>`

non-terminal意为非终止符，就是说我们还没有定义完的东西，还可以继续由右边的replacement，也就是代替物来进一步解释、定义。

法则：

- `<>`尖括号里的内容表示语法结构名；
- 语法结构分成基础结构和需要用在其他语法结构定义的复合结构
   - 基础结构称终结符
   - 复合结构称非终结符
- `::=` 表示定义；
- `“ ”` 引号和中间的字符表示终结符；
- `*` 表示重复多次
- `|` 竖线两边的是可选内容，相当于or；
- `+` 表示至少一次

四则运算：
  - `1 + 2 * 3`

终结符：
  - Number
  - `+ - * /`

非终结符
  - MultiplicativeExpression
  - AddtiveExpression

```
BNF
1*8 = 8
1*8 = 2*2*2
<MultiplicativeExpression>::=<Number>|
  <MultiplicativeExpression>"*"<Number>|
  <MultiplicativeExpression>"/"<Number>|
<AddtiveExpression>::=<MultiplicativeExpression>|
  <AddtiveExpression>"+"<MultiplicativeExpression>|
  <AddtiveExpression>"-"<MultiplicativeExpression>|
```

```
带括号的四则运算产生式
<PrimaryExpression>::="("<AddtiveExpression>")"|<Number>
<MultiplicativeExpression>::=<Number>|
  <MultiplicativeExpression>"*"(<Number>)|
  <MultiplicativeExpression>"/"<Number>|
  <PrimaryExpression>|
  <PrimaryExpression>"*"<Number>|
  <PrimaryExpression>"*"<PrimaryExpression>|
  <PrimaryExpression>"/"<Number>|
  <PrimaryExpression>"/"<PrimaryExpression>|
<AddtiveExpression>::=<MultiplicativeExpression>|
  <AddtiveExpression>"+"<MultiplicativeExpression>|
  <AddtiveExpression>"-"<MultiplicativeExpression>|
  <PrimaryExpression>|
  <AddtiveExpression>"+"<PrimaryExpression>|
  <AddtiveExpression>"-"<PrimaryExpression>|
```
### 通过产生式理解乔姆斯基谱系
- 0型无限制文法
  - `？:: =? <a> <b> ::= "c" <d>`

- 1型上下文相关文法
  - `?<A> ?::=? <B> ? `
  - `<a> <b> <c> ::= <a> "c" <b> `只有中间那个可以变

- 2型上下文无关法
  - `<A>::=?`

- 3型正则文法（表达式）
  - `<A>::=<A>?`
  - `<A>::=?<A>` 不正确

  JavaScript 总体上属于上下文无关文法 表达式大部分属于正则文法，有两个特例 **（乘方） 是右结合 不属于正则  属于2型

### 现代语言的分类
#### 现代语言的特例
- C++中，*可能表示乘号或者指针，具体是哪个，取决星号前面的标示符是否被声明为类型
- VB中，<可能是小于号,也可能是XML直接量的开始，取决于当前位置是否可以接受XML直接量
- Python中，行首的Tab符和空格会根据上一行的行首空白以一定的规则被处理成虚拟终结符indent或者dedent
- JavaScript中，/可能是除号，也可能是正则表达式的开头，除理方式类似于VB，字符串模板中也需要特殊处理}，还有自动插入分号

#### 编程语言的分类
- 形式语言-用途 
  - 数据描述语言 JSON 、HTML、XAML、SQL、CSS 、SGML、XML、DDL
  - 编程语言： C++、C、Java、C#、Python、Ruby、Perl、Lisp、T-SQL、Clojure、Haskel、JavaScript、VB\SQL、PHP、Groovy、Swift、MATLAB、GO、R     
- 形式语言-表达方式 
  - 声明式语言 JSON 、HTML、XAML、SQL、CSS 、Lisp、Clojure、Scheme、Haskell、OCaml、Standard ML和Unlambda、MXML、XAML、XSLT、DSL、
  - 命令型语言：Fortran、BASIC、 C++、C、Java、C#、Python、Ruby、Perl、Lisp、T-SQL、JavaScript、GO

### 编程语言的性质
> - 图灵完备性：在可计算性理论里，如果一系列操作数据的规则（如指令集、编程语言、细胞自动机）可以用来模拟单带图灵机，那么它是图灵完全的。这个词源于引入图灵机概念的数学家艾伦·图灵。虽然图灵机会受到储存能力的物理限制，图灵完全性通常指“具有无限存储能力的通用物理机器或编程语言”。
> - 图灵机（Turing machine）：又称确定型图灵机，是英国数学家艾伦·图灵于 1936 年提出的一种将人的计算行为抽象掉的数学逻辑机，其更抽象的意义为一种计算模型，可以看作等价于任何有限逻辑数学过程的终极强大逻辑机器。

- 图灵完备性
  - 命令式 -图灵机
    - goto
    - if和while
  - 声明式 -lambda
    - 递归
- 动态与静态
  - 动态：
      - 在用户的设备/在线上服务器上
      - 产品运行时
      - Runtime(运行时)
  - 静态
      - 在程序员的设备上
      - 产品开发时
      - Compiletime(编译时)


> JavaScript 这种解释执行的语言，它是没有 Compiletime 的。我们现在也会用到 Webpack 去 build 一下我们的代码，但是实际上还是没有 Compiletime 的。所以说，今天的 Runtime 和 Compiletime 的对应已经不准确了，但是我们依然会愿意沿用 Compiletime 的习惯，因为 JavaScript 它也是 “Compiletime（开发时）” 的一个时间，所以也会用 Compiletime 这个词来讲 JavaScript 里面的一些特性。


### 类型系统
- 动态类型系统与静态类型系统
  - 动态类型系统（JavaScript）
  - 静态类型系统 C++
- 强类型与弱类型
  - String + Number
  - String == Boolean
- 复合类型
  - 结构体 `{ a:T1, b:T2}`
  - 函数签名 
  参数类型（列表）和返回值类型 `(T1,T2)=>T3`
- 子类型
- 泛型 
  - 逆变与协变 

凡是能用`Array<Parent>` 的地方都能用`Array<Child>` （协变）

凡是能用`Funtion<Child>` 的地方都能用`Funtion<Parent>` （逆变）

### 一般命令式编程语言的设计方式
#### Atom(原子级) 最小的组成单位 通常包含关键字 直接量 变量名一些基本的单位称为原子
- Indetifier 变量名
- Literal 直接量 数字直接量和字符串直接量

#### Expression（表达式） 原子级的结构通过运算符相连接，加上一些辅助的符号，构成表达式，通常是一个可以级联的结构

- Atom 原子
- Operator 运算符 （javascript为例）
  - 算数运算符 + - * / % ++ --
  - 赋值运算符 = += -+ *= /= %=
  - 比较运算符 == === != !== > < >= <= ?
  - 逻辑运算符 && || !
  - 类型运算符 typeof(返回变量的类型) instanceof(返回 true，如果对象是对象类型的实例。)
  - 位运算符 & | ~(非) ^(异或) <<(零填充左位移) >>(有符号右位移) >>> (零填充右位移)
- Punctuator 特定的符号

#### Statement语句 if while for 语句
- Expression
- Keyworld
- Punctuator

#### Structure结构化
- Function 函数
- Class 类
- Process 线程
- Namespace 命名空间

#### Program工程 npm
- Promgram (实际执行的代码)
- Module (准备好被复用的模块)
- Package （java）
- Library

## JS类型
> Atom(原子级) 最小的组成单位 通常包含关键字 直接量 变量名一些基本的单位称为原子
> - Grammar
>   - Literal 直接量 数字直接量和字符串直接量
>   - Variable
>   - Keywords
>   - Whitespace
>   - Line Terminator
> - Runtime
>   - Types
>   - Execution Context

> Types 
> - Number
> - String
> - Boolean
> - Object
> - Null (type of null === 'object')
> - Undefined
> - Symbol
### Number
- IEEE 754 Double Float(意思是小数点可以来回浮动的)
  - Sign (1) 1个符号位如+-
  - Exponent (11) 11个指数位
  - Fraction (52) 52个精度位
> 0.1+0.2 === 0.3 为false的原型在于十进制转换为二进制出现精度损失，以及加法运算的精度损失造成的、损失最大为3e。

- Number - Grammar语法
  - 十进制（Decimal Literal）
    - 0、0.、.2、1e3
  - 二进制（Binary Integeral Literal）
    - 0b111 —— 以 0b 开头，可以用 0 或者 1
  - 八进制（Octal Integral Literal）
    - 0o10 —— 以 0o 开头，可以用 0-7
  - 十六进制（Hex Integer Literal）
    - 0xFF —— 0x 开头，可以用 0-9，然后 A-F

### String 
> - Character(字符) 那字符在英文里面就是 Character ，但是字符在计算机里面是没有办法表示的。比如我们看到的字母 A、中文的 中等这些字符都是一个形状，其实这些都是字形，我们认为字符其实是一个抽象的表达。然后结合字体才会变成一个可见的形象。

> - Cold Point（码点） 用于表示 Character 比如说我们规定 97 就代表 A，就可以用97将A找出来

> - Encoding (编码) 怎么存储这个 97 这个数字

#### 字符集（String）
- ASCII
- Unicode
Unicode 是后来建立的标准，把全世界的各种字符都给方在一起了，形成一个大合集
所以也叫 “联合的编码集”
- UCS
Unicode 和另外一个标准化组织发生结合的时候产生了 UCS
UCS也是只有 0000 到 FFFF 一个范围的字符集
- GB（国标）—— 国标经历了几个年代
国标有几个版本 GB2312、GBK(GB3000)、GB18030

- ISO-8859

- BIG5
BIG5 与国标类似，是台湾一般用的就是 BIG5，俗称大五码

#### 字符编码（Encoding）
- UTF-8
- UTF-16
#### 字符串语法（Grammer）

- 双引号字符串 —— `"abc" \n (回车)  \t(Tab) \(反斜杠)`
- 单引号字符串 —— `'abc' \n (回车)  \t(Tab) \(反斜杠)`
- 反引号字符串 —— `abc`  `ab${x}abc${y}abc`
```
尝试使用正则表达式，来匹配一个单引号/双引号的字符串：
// 双引号字符正则表达式
"(?:[^"\n\\\r\u2028\u2029]|\\(?:[''\\bfnrtv\n\r\u2029\u2029]|\r\n)|\\x[0-9a-fA-F]{2}|\\u[0-9a-fA-F]{4}|\\[^0-9ux'"\\bfnrtv\n\\\r\u2028\u2029])*"

// 单引号字符正则表达式
'(?:[^'\n\\\r\u2028\u2029]|\\(?:[''\\bfnrtv\n\r\u2029\u2029]|\r\n)|\\x[0-9a-fA-F]{2}|\\u[0-9a-fA-F]{4}|\\[^0-9ux'"\\bfnrtv\n\\\r\u2028\u2029])*'

```
> - 看首先是空白定义，包含回车、斜杠、\n\r
> - 2028 和 2029 就是对应的分段和分页
> - \x 和 \u 两种转义方法
> - 只要知道 bfnrtv 这几种特殊的字符，还有上面考虑到的因素即可

练习
```
写一段 JS 的函数，把一个 string 它代表的字节给它转换出来，用 UTF8 对 string 进行遍码
  function UTF8_Encoding(str){
    return new TextEncoder('utf8').encode(str)
  }
  UTF8_Encoding('中')
```

#### Boolean 布尔类型
其实就是 true 和 false， 这个类型真的是非常简单的类型，如果没有和计算联合起来用，就真的是一个很简单的类型。

#### Null 和 Undefined
- Null 表示有值，但是是空
- Undefined 语义上就表示根本没有人去设置过这个值，所以就是没有定义
- 我们要注意 Null 其实是关键字 ，但是 Undefined 其实并不是关键字、 Undefined 是一个全局变量，在早期的 JavaScript 版本里全局的变量我们还可以给他重新赋值的，比如我们把 Undefined 赋值成 true。
> 虽然说新版本的 JavaScript 无法改变全局的 Undefined 的值，但是在局部函数领域中，我们还是可以改变 Undefined 的值的。例如一下例子：
```
function foo() {
  var undefined = 1;
  console.log(undefined);
}
```
```
function foo() {
  var null = 0;
  console.log(null);
}

```
> 这里就说一下，我们怎么去表示 Undefined 是最安全的呢？在开发的过程中我们一般不用全局变量，我们会用 void 0 来产生 Undefined ，因为 void 运算符是一个关键字，void 后面不管跟着什么，他都会把后面的表达式的值变成 Undefined 这个值。那么 void 0、void 1、void 的一切都是可以的，一般我们都会写 void 0，因为大家都这么写，大家说一样的话比较能够接受。

#### Object 的基础知识
> 所以我们对对象的认知是？
> 任何一个对象都是唯一的，这与它本身的状态无关，状态是由对象决定的。即使状态完全一致的两个对象，也并不相等。

##### Object 三要素
- Identifier —— 唯一标识

  > 变量它是有一个唯一标识性，这个也是对象的一个核心要素具备了```

- State —— 状态
- Behavior —— 行为

##### Object —— Class（类）
> 首先 Class 类 和 Type 类型是两个不一样的概念。

分类有两个流派，一种是归类，一种是分类。

- 归类 —— 就是我们去研究单个对象，然后我们从里面提取共性变成类，之后我们又在类之间去提取共性，把它们变成更高的抽象类。比如我们在 “羊” 和 “鱼” 中提取共性，然后把它们之间的共享再提取出来变成 “动物” 的类。对于 “归类” 方法而言，多继承是非常自然的事情，如 C++ 中的菱形继承，三角形继承等。
- 分类 —— 则是把世界万物都抽象为一个基类 Object，然后定义这个 Object 中有什么。采用分类思想的计算机语言，则是单继承结构。并且会有一个基类 Object。

>JavaScript 这个语言比较接近 “分类” 这个思想，但是它也不完全是分类的思想，因为它是一个多范式的面向对象语言。

##### Object —— Prototype（原型）
- 其实分类 Class Based 的 Object 并不是一个唯一的认识对象的方法，我们还有一个更接近人类自然认知的。分类的能力可能至少要到小学才有的。但是我们认识对象之后，几乎是马上就可以得到另外一种描述对象的方式。那就是 “原型”。
- 原型其实用 “照猫画虎” 来理解 ，其实照猫画虎就是用的一种原型方法。因为猫和虎很像，所以我们只需要把它们直接的有区别的地方分出来就可以了。

我们这种原型是更接近人类原始认知的描述对象的方法
所以面向对象的各种方法其实并没有绝对的对错，只存在在不同场景下不同的代价
原型的认知成本低，选错的成本也比较低，所以原型适合一些不是那么清晰和描述上比较自由的场景
而分类（Class）更适合用在一些比较严谨的场景，而 Class 有一个优点，它天然的跟类型系统有一定的整合的，所以很多的语言就会选择把 Class 的继承关系整合进类型系统的继承关系当中

##### 我们如果需要编写一个 “狗 咬 人” 的 Class，我们需要怎么去设计呢？

如果我们按照一个比较朴素的方法，我们就会去定义一个 Dog Class，然后里面给予这个 Class 一个 bite 的方法。
```
class Dog {
  bite(Human) {
    // ......
  }
}
```
>这样的一段代码是跟我们的题目是一模一样的，但是这个抽象是一个错误的抽象。因为这个违背了面向对象的基本特征，不管我们是怎么设计，只要这个 bite 发生在狗身上就是错误的。
>因为我们前面讲到了面向对象的三要素，对象的状态必须是对象本身的行为才能改变的。那么如果我们在狗的 Class 中写 bite 这个动作，但是改变的状态是 “人”，最后狗咬了人之后，只会对人造成伤害。所以在这个行为中 “人” 的状态是发生变化的，那么如果行为是在狗的 Class 中就违反了面向对象的特征了。
> 所以我们应该在 “人” 的 Class 中设计一个行为。这里更加合理的行为应该是 hurt 表示被伤害了，然后传入这个行为的参数就是受到的伤害程度 damage。因为这里人只关心它受到的伤害有多少就可以了，他是不需要关心是狗咬的还是什么咬的.
```
class Human {
  hurt(damage){

  }
}
```
> 设计对象的原则：
> - 我们不应该受到语言描述的干扰（特别是业务需求的干扰）
> - 在设计对象的状态和行为时，我们总是遵循 “行为改变状态” 的原则
> - 违背了这个原则，整个对象的内聚性就没有了，这个对架构上会造成巨大的破坏

##### JS中的对象 Object in Javascript
Object
- Property 属性

- [[Prototype]] 原型

key-value对形式 
- 属性可以是Symbol或String
- 属性值可以是
  - Data Property （[[value]]、writable、enumerable、configurable）数据属性 用于描述状态 如果存储函数也可以用于描述行为
  - Accessor Property （get、set、enumerable、configurable）访问器属性 用于描述行为

原型机制

当我们访问属性时，如果当前对象没有就会沿着原型往上找

Object API/Grammar
- {}.[] Object.defineProperty
- Object.create / Object.setPrototypeOf/Object.getPrototypeOf
- new / class / extends
- new / function / prototype

javascript中的特殊对象
- 前面讲述了js中的一般对象。但js中还有一些特殊的对象，比如函数对象。除了一般对象的属性和原型，函数对象还有要给行为[[call]]。
- 我们用js中的function关键字、箭头运算符或者Function构造器创建的对象，会有[[call]]这个行为
- 我们用类似f{}这样的语法把对象当做函数调用时，会访问到[[call]]这个行为。
如果对应的对象没有[[call]]行为，则会报错。
- 其他特殊对象
  - Array：Array 的 length 属性根据最大的下标自动发生变化。

  - Object.prototype：作为所有正常对象的默认原型，不能再给它设置原型了。

  - String：为了支持下标运算，String 的正整数属性访问会去字符串里查找。

  - Arguments：arguments 的非负整数型下标属性跟对应的变量联动。

  - 模块的 namespace 对象：特殊的地方非常多，跟一般对象完全不一样，尽量只用于 import 吧。
> 带有[[]]的属性是无法在js中无法调用的但是在js引擎和c++代码中可以随时调用的


