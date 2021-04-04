
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

