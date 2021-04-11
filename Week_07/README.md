# 学习笔记
## 1、JS表达式 Expression
> 这节课主要学习有关语法的有语法树跟运算符优先级的关系以及运算符左值和右值的区别，关于运行时的有类型转换和引用类型方面的知识
### 1.1 Grammar (语法)
#### 1.1.1Grammar Tree vs Priority (语法树跟运算符优先级的关系)
- +-
- */
>  我们从小学就直到乘除的优先级比加减要高，如果实在要改变优先级的话需要加括号，所以括号的优先级要比乘除要高，所以当我们要构建语法树的时候，要考虑到这些因素，乘除会优先形成更小一级语法结构（子树），加减就会形成更高一级的语法结构，如：1 + 2*3，这里2*3为右子树，加号为根节点，1为左叶子节点构成语法树结构。运算符的优先级由表达式生成树来实现的，JS中运算符按照优先级高低分以下几类：
##### 1) Member及同级运算
> 属性、成员访问，返回Reference类型

- a.b
- a[b]
- foo`string` : 函数后跟templete的用法，模板按分变量与字符串分解后传入函数foo中
  ```
  function foo(str){ 
    console.log(str)
  }
  foo`foo` // 打印出['foo']
  ```
- super.b ：调用父类属性
- super['b']
- new.target：判断函数是否由new调用
  > new.target属性允许你检测函数或构造方法是否是通过new运算符被调用的。在通过new运算符被初始化的函数或构造方法中，new.target返回一个指向构造方法或函数的引用。在普通的函数调用中，new.target 的值是undefined。详情参考：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new.target
- new Foo() ： 带() 的优先级更高，不带括号的new 被单独设置为一个优先级，下文将详细讲诉

##### 2) New Expression 及同级运算
> new Foo
```
new a()()
new new a() // new [new a()],大括号内new a()优先级更高
```
> 这是js设计中由于括号可以省略带来了不少麻烦
##### 3) Call 函数调用 
> 优先级低于前面的Member和 new 
- foo()
- super() ：执行父类构造函数
- foo()['b'] ： 为了保证new运算的正确性，降低了优先级
- foo().b
- foo()`abc`
```
new a()['b'] 
由于a()这种Call表达式低于new a()这种带括号的new表达式所以
先运算new a() 然后再new a()['b'] 
```
#### 1.1.2 Left hand side & Right hand side (运算符左值和右值的区别)
> Member、New、Call又被称作Left Handside Expression，其他则成为Right Handside Expression，按照等号（=）左右进行划分。Left hand side在运行时上应为reference类型，下面几类为Right Handside Expression
- Update 自增运算符 -注意中间不允许有LineTerminator
  - a++
  - a--
  - --a
  - ++a
- Unary 单目运算符
  - delete a.b
  - void foo() ：后面无论是任何值均返回undefined，void 0是返回undefined的最佳实践
  - typeof a : 注意typeof与js运行时对类型的规定不一致 typeof null --> object、typeof function(){} -->function
  - +a
  - -a
  - ~a：按位取反
  - !a ：取非
  - await a
- Exponental 乘方运算符
  - ** ：唯一右结合运算符
- Multiplicative 乘除法运算符
  - * / %
- Additive 加减法运算符
  - `+` `-`
- Shift 移位运算符
  - << >> >>>
- Relationship 关系比较运算符
  - <> <= >= instanceof in
- Equality 相等运算符
  - ==
  - !=
  - ===
  - !==
- Bitwise 位运算 -按位与和按位或
  - & ^ |
- Logical 逻辑运算符 -具有短路特性
  - &&
  - ||
- Conditional 条件运算符
  - ? : JS中的三目运算同样具有短路逻辑，true?foo1:foo2 时foo1不调用，false?foo1:foo2 时foo2不调用，是完全合法的if else表达式版本，且可以无限嵌套
  - Comma
, : , 类似于表达式版本的分号，永远返回最后一项的值，例如 1,2,3返回3 、1，function(){}返回后面的函数表达式

### 1.2 Runtime (运行时)
#### 1.2.1 Type Convertion (类型转换)
- a + b
- "false"==false
- a[o]=1
  
| -----    | Number         | String           | Boolean | Undefined | Null | Object | Symbol |
| -----    | -----          |  -----           |   ----- |-----      |----- |-----   | -----  |
| Number   | -----          |  #NumberToString | 0 false |-----      |----- |Boxing  | -----  |
| String   | #StringToString|  -----           | "" false|-----      |----- |Boxing  | -----  |
| Boolean  | true 1 false 0 |  'true' 'false'  |   ----- |-----      |----- |Boxing  | -----  |
| Undefined| NaN            |  'Undefined'     |   false |-----      |----- |-----   | -----  |
| Null     | 0              |  'null'          |   false |-----      |----- |-----   | -----  |
| Object   | valueOf        |  valueOf toString|   true  |-----      |----- |-----   | -----  |
| Symbol   | -----          |  -----           |   ----- |-----      |----- |Boxing   | -----  |
> 一、对象转化成字符串：
> 规则：
> - 1、如果对象有toString方法，则调用该方法，并返回相应的结果；（代码通常会执行到这，因为在所有对象中都有toString方法）
> - 2、如果对象有valueOf方法，则调用该方法，并返回相应的结果；
> - 3、否则抛出异常。
> - 4、可以自定义toString()
> 
```
var obj = {
    age:23,
    toString:function(){
        return this.age;
    }
}
obj.toString();//23
```
> 二、对象转化成数字
> 转化成数字的规则：
> - 1、如果对象有valueOf方法，则调用该方法，并返回相应的结果；
> - 2、当调用valueOf返回的依然不是数字，则会调用对象的toString方法，并返回相应的结果；
> - 3、否则抛出异常。
> - 4、可以重写对象的valueOf()方法(百度一道面试题，定义一个对象，使obj == '1' ,结果为true)：
> 
```
var obj = {
    valueOf: function(){
        return 1;
    }
};
console.log(obj == '1');//true
```
> 
> 参考文档：js中对象可以转化成 字符串、数字、布尔值
:https://www.cnblogs.com/lihuijuan/p/9643570.html
##### Unboxing 拆箱转换
> 是指将对象类型转成普通的基本类型,最主要的过程是toPrimitive，如加法或者Object参与运算的情况下，它都会调用toPrimitive过程
> 
```
var o = {
  toString() { return "2"},
  valueOf() { return 1},
  [Symbol.toPrimitive] { return 3 }
}
var x = {}
x[o] = 1
// 将o对象作为key会发生类型转换 则会优先调用toString方法
console.log("x" + o)
// 一个字符串和一个对象相加也会对o对象进行转换类型 只要有[Symbol.toPrimitive]就会先调用所以这里打印的结果是x3, 然后o对象会优先调用valueOf,最后才是toString,也就是说调用顺序优先级是`[Symbol.toPrimitive]>valueOf>toString`
```
- toPrimitive 
- valueOf、toString
- Symbol.toPrimitive

##### Unboxing 装箱转换
> 一下四种类型都有一个对应的包装类,他们的对象和值之间存在着一个装箱关系如new Number(1)对象和值1
| 类型     | 对象                     | 值           | 
| -----    | -----                   |  -----       | 
| Number   | new Number(1)           |  1           |
| String   | new String("a")         | "a"          |
| Boolean  | new Boolean(true)       |  true        |
| Symbol   | new Object(Symbol("a")) |  Symbol("a") |
#### 1.2.2 Reference (引用类型)
```
var obj = {
  a: 1,
  b: {}
}
delete delete obj.a
Object.assign({}, obj)
```
- Object
- Key 
- delete
- assign
> Object.assign() 方法用于将所有可枚举属性的值从一个或多个源对象分配到目标对象。它将返回目标对象。Object.assign(target, ...sources) 详情参考：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
> js中用引用类型在运行时来进行删除或者赋值这样的写相关的操作的
## 2、JS语句 - Statement
### 2.1 简单语句和复合语句
Completion Record内部类型是一条记录，用以描述语句执行的结果，包含以下三个字段。

- [[type]] : normal, break, continue, return, or throw
- [[value]] : Types
- [[target]] : label

#### 2.1.1简单语句
- ExpressionStatement -> a =1 +2;
- EmptyStatement -> ;
- DebuggerStatement debugger;
- ThrowStatement throw a;
- ContinueStatement continue label1;
- BreakStatement break label;
- ReturnStatement return 1+2;
#### 2.1.2组合语句
1) BlockStatement

结构为{ ...; ...; ...; }，基本逻辑为statement list中的statement顺次执行

- [[type]] : 一般是normal，但其中的statement list执行到非normal语句时则中断后续执行
- [[value]] : --
- [[target]] : --
```
{
  a:1
}
//这段代码将被解释为block语句，而不是一个对象，所以 a会被理解为label，而不是一个对象属性，所以对象不能放左侧
```
2) Iteration

- while( ... ) ...
如果语句中有throw、return与block语句行为一致，但可以消费continue、break，如果匹配正确的label也可以消费
- do ... while( ... )
- for( ...此处可以是声明语句... ; ... ; ... ) ...
for语句可以在block之外产生一个独立的父级作用域，相当于产生两层块级作用域
- for( ... in ... )
用以循环对象属性
- for( ... of ... )
对应iterator机制，一般与Generator搭配使用, for of => Iterator => Generator/Array,可以实现无穷迭代
- for await( of )
3) 标签、循环、break、continue语句体系
- LabelledStatement
- IterationStatement
- ContinueStatement
- BreakStatement
- SwitchStatement
4) try语句
结构为，{}不能省略，try{ ... }catch( ...此处作用域在后面的block语句中... ){ ... }finally{ ... }，任何运行时逻辑错误都会产生throw行为
```
try {

} catch(e){
...此处作用域在后面的block语句中...
} finally {

}
```
### 2.2 声明
- FunctionDeclaration
函数声明，与之类似的函数表达式

- GeneratorDeclaration
语法为 function* foo(){ yield 1;}，功能主要表现为分布返回多个值的函数

- AsyncFunctionDeclaration
 异步函数声明
- AsyncGeneratorDeclaration
异步产生器
- VariableStatement
 变量声明 var 变量提升 在声明前使用不会报错
- ClassDeclaration
类声明 在声明前使用会报错
- LexicalDeclaration
let const 在声明前使用会报错

预处理机制
```
var a = 2;
void function (){
  a = 1;//由于函数作用域内声明了var a;由于var的预处理机制，此处不能修改函数外部变量a的值
  return;
  var a;
}()
console.log(a) // 2
```
```
var a = 2;
void function (){
  a = 1;//由于函数作用域内声明了const a;const和let也有预处理机制，这里的a变成了局部变量，但是由于const声明的变量 不能在声明前使用，这里会抛出错误，所以函数外面的a依旧为2
  return;
  const a;
}()
console.log(a) // 2
```
## 3、JS结构化 - Structure - 结构化程序设计和执行过程

### 3.1 宏任务与微任务
#### 3.1.1 JS执行粒度（运行时）
- 宏任务
  由宿主环境（浏览器，nodejs）发起的
- 微任务 （Promise）
  由js引擎发起的
- 函数调用 （Execution Context）
- 语句/声明 （Completion Record）
- 表达式 （Reference）
- 直接量/变量/this……
```
var x = 1;
var p = new Promise(resolve => resolve());
p.then(() => x = 3);
x = 2;
将上面的代码塞给js引擎时产生了两个异步任务一个是整个4行代码除了p.then内部的() => x = 3外的代码，另外一个是p.then异步执行的() => x = 3这行代码，这两个异步任务我们把他称作一个微任务MicroTask(Job) 

把这个代码塞给js引擎并执行的整个过程我们叫做宏任务（MacroTask）
```
#### 3.1.2 事件循环
wait -> get code -> execute

### 3.2 JS函数调用 
#### 3.2.1执行栈
```
//foo.js
function foo(){
  console.log(i);
}
export foo;
```
```
// index.js
import {foo} from "foo.js"
var i = 0;
console.log(i);
foo()
console.log(i)
i++
```

展开来看
```
var i = 0;
console.log(i);
[console.log(i);] //来自foo.js 访问不到 var i = 0 的i
console.log(i);
i++
```
> 以上代码中五个i是同一个i吗？
> 在foo.js中的i是独立定义的，只在foo内使用
> 
> 下面有个更复杂的例子



```
// index.js
import {foo} from "foo1.js"
var i = 0;
console.log(i);
foo()
console.log(i)
i++
```

```
// foo1.js
import {foo2} from "foo2.js"
var x = 1;
function foo(){
  console.log(x);
  foo2();
  console.log(x);
}
export foo;
```

```
// foo2.js
var y = 2;
function foo2(){
  console.log(y);
}
export foo2;
```

展开来看
```
var i = 0;
console.log(i); //来自index.js 可以访问i变量
[console.log(x);] //来自foo1.js 可以访问x变量
(console.log(y);) //来自foo2.js 可以访问y变量
[console.log(x);] //来自foo1.js 可以访问x变量
console.log(i); //来自index.js 可以访问i变量
i++ //来自index.js 可以访问i变量
```


- 执行内容[i:0]
- 执行内容[x:1]
- 执行内容[y:2]

正在执行的内容

Execution Context（执行内容）
- i:0
  - code evaluation state 用于async和generator函数的，保存代码执行到哪的信息
  - Function 由函数初始化的一个执行内容有
  - Script or Module 我们只有这样两种这样的上下文
  - Cenerator
  - Realm 保存所有内置对象的一个王国
  - LexicalEnvironment 执行代码需要执行的环境也就是保存变量的
    - this
    - new.target
    - super
    - 变量 
  - VariableEnvironment 仅仅用于处理var声明，用var去声明变量会声明到哪的一个环境
#### 3.2.2 Environment Record
Environment Record
- Declarative
  - Function
  - module 
- Global
- Object

#### 3.2.3 Function-Closure (闭包)
> 每个函数都会生成一个闭包
```
var y = 2;
function foo2(){
  console.log(y);
}
export foo2;
```
Function : foo2
- Environment Record: y:2
- Code : console.log(y);

> 函数中返回一个函数
```
var y = 2;
function foo2(){
  var z = 3;
  return () => {
    console.log(y, z) // 可以同时访问y,z以及foo2中的this
  }
}
var foo3 = foo2();
export foo3
```
Function : foo3
- Environment Record: y:2
  - Environment Record: z:3  this:global
-  Code : console.log(y, z);

#### 3.2.4 Realm
> 在js中，函数表达式和对象直接量均会创建对象。使用隐式转换也会创建对象。
> 这些对象也是有原型的，如果我们没有Realm,就不知道他们的原型是什么。
```
var x = {}//创建了一个Object对象
1 .toString()//装箱产生Number对象
```