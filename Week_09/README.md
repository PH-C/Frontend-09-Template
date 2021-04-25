# 浏览器工作原理 — HTML 解析与 CSS 计算 学习笔记 
> 上一课我们完成了从 HTTP 发送 Request，到接收到 Response，并且把 Response 中的文本都解析出来。这节课来实现html的解析和css计算部分


## 1. HTML 解析
### 1.1 拆分文件

> 第一步做一些文件的拆分和接口的设计
> 我们在得到Response后把body传给parseHTML解析，在真正的浏览器当中，我们应该是逐段的返回Response的body的，在这里我们直接收回全部body，这个api主要是将body传给parseHTML然后解析成dom树结构
- 为了方便文件管理，我们把 parser 单独拆分到文件中
- parser 接收 HTML 文本作为参数，返回一棵 DOM 树

### 1.2 用有效状态机 (FSM) 实现 HTML的分析
> HTML 标准里面已经把整个状态机中的状态都设计好了，我们直接就看HTML标准中给我们设计好的状态：https://html.spec.whatwg.org/multipage/，我们直接翻到 “Tokenization” 查看列出的状态，这里就是所有 HTML 的词法
- 我们用 FSM 来实现 HTML 的分析
- 在 HTML 标准中，已经规定了 HTML 的状态
- 我们的浏览器只挑选其中一部分状态，完成一个最简版本

### 1.3 解析标签
> HTML中有三种标签：开始标签、结束标签、自封闭标签
- 主要的标签有：开始标签，结束标签和自封闭标签
- 在这一步我们暂时忽略属性

### 1.4 创建元素
> 首先我们需要建立一个 currentToken 来暂存当前的 Token（这里我们是用于存放开始和结束标签 token 的）
然后建立一个 emit() 方法来接收最后创建完毕的 Token（这里后面会用逐个 Token 来创建 DOM 树）
- 在状态机中，除了状态迁移，我们还会加入业务逻辑
- 我们在标签结束状态提交标签 token

### 1.5 处理属性
- 属性值分为单引号、双引号、无引号三种写法，因此需要较多状态处理
- 处理属性的方式跟标签类似
- 属性结束时，我们把属性加到标签 Token 上

### 1.6 用 token 构建 DOM 树
- 从标签构建 DOM 树的基本技巧是使用栈
- 遇到开始标签时创建元素并入栈，遇到结束标签时出栈
- 自封闭节点可视为入栈后立刻出栈
- 任何元素的父元素是它入栈前的栈顶

### 1.7 将文本节点加到 DOM 树
- 文本节点与自封闭标签处理类似
- 多个文本节点需要合并

## 2. CSS 计算
> 在编写这个代码之前，我们需要准备一个环境。如果我们需要做 CSS 计算，我们就需要对 CSS 的语法与词法进行分析。然后这个过程如果是手动来实现的话，是需要较多的编译原理基础知识的，但是这些编译基础知识的深度对我们知识想了解浏览器工作原理并不是重点。所以这里我们就偷个懒，直接用 npm 上的一个css现成包即可。
> 其实这个 css 包，就是一个 CSS parser，可以帮助我们完成 CSS 代码转译成 AST 抽象语法树。 我们所要做的就是根据这棵抽象语法树抽出各种 CSS 规则，并且把他们运用到我们的 HTML 元素上。

### 2.1 收集 CSS 规则
- 遇到 style 标签时，我们把 CSS 规则保存起来
```
{
    "type": "stylesheet",
    "stylesheet": {
        "rules": [
            {
                "type": "rule",
                "selectors": [
                    "body div #myid"
                ],
                "declarations": [
                    {
                        "type": "declaration",
                        "property": "width",
                        "value": "100px",
                        "position": {
                            "start": {
                                "line": 3,
                                "column": 15
                            },
                            "end": {
                                "line": 3,
                                "column": 27
                            }
                        }
                    },
                    {
                        "type": "declaration",
                        "property": "background-color",
                        "value": "#ff5000",
                        "position": {
                            "start": {
                                "line": 4,
                                "column": 15
                            },
                            "end": {
                                "line": 4,
                                "column": 40
                            }
                        }
                    }
                ],
                "position": {
                    "start": {
                        "line": 2,
                        "column": 13
                    },
                    "end": {
                        "line": 5,
                        "column": 14
                    }
                }
            },
            {
                "type": "rule",
                "selectors": [
                    "body div img"
                ],
                "declarations": [
                    {
                        "type": "declaration",
                        "property": "width",
                        "value": "30px",
                        "position": {
                            "start": {
                                "line": 7,
                                "column": 15
                            },
                            "end": {
                                "line": 7,
                                "column": 26
                            }
                        }
                    },
                    {
                        "type": "declaration",
                        "property": "background-color",
                        "value": "#ff1111",
                        "position": {
                            "start": {
                                "line": 8,
                                "column": 15
                            },
                            "end": {
                                "line": 8,
                                "column": 40
                            }
                        }
                    }
                ],
                "position": {
                    "start": {
                        "line": 6,
                        "column": 13
                    },
                    "end": {
                        "line": 9,
                        "column": 14
                    }
                }
            }
        ],
        "parsingErrors": []
    }
}
```
> 这里还有一个问题需要我们注意的，像 body div #myId 这种带有空格的标签选择器，是不会逐个给我们单独分析出来的，所以这种我们是需要在后面自己逐个分解分析。除非是 , 逗号分隔的选择器才会被拆解成多个 delarations。

### 2.2 添加调用
- 当我们创建一个元素后，立即计算CSS
- 我们假设：理论上，当我们分析一个元素时，所有的 CSS 规则已经被收集完毕
- 在真实浏览器中，可能遇到写在 body 的 style 标签，需要重新 CSS 计算的情况，这里我们忽略

### 2.3 获取父元素序列
> 为什么需要获取父元素序列呢？因为我们今天的选择器大多数都是跟元素的父元素相关的。

- 在 computeCSS 函数中，我们必须知道元素的所有父级元素才能判断元素与规则是否匹配
- 我们从上一步骤的 stack，可以获取本元素的父元素
- 因为我们首先获取的是 “当前元素”，所以我们获得和计算父元素匹配的顺序是从内向外

### 2.4 选择器与元素的匹配
> 首先我们来了解一下选择器的结构，其实选择器其实是有一个层级结构的：最外层叫选择器列表，这个我们的 CSS parser 已经帮我们做了拆分,选择器列表里面的，叫做复杂选择器，这个是由空格分隔了我们的复合选择器,复杂选择器是根据亲代关系，去选择元素的,复合选择器，是针对一个元素的本身的属性和特征的判断,而复合原则性选择器，它又是由紧连着的一对选择器而构成的,在我们的模拟浏览器中，我们可以假设一个复杂选择器中只包含简单选择器。

- 选择器也要从当前元素向外排列
- 复杂选择器拆成对单个元素的选择器，用循环匹配父级元素队列

### 2.5 计算选择器与元素
> 根据选择器的类型和元素属性，计算是否与当前元素匹配,这里仅仅实现了三种基本选择器，实际的浏览器中要处理复合选择器,同学们可以自己尝试一下实现复合选择器，实现支持空格的 Class 选择器

### 2.6 生成 computed 属性
> 这一部分我们生成 computed 属性，这里我们只需要把 delarations 里面声明的属性给他加到我们的元素的 computed 上就可以了。

- 一旦选择器匹配中了，就把选择器中的属性应用到元素上
- 然后形成 computedStyle

> 这里我们应该会发现这个代码中有一个问题。如果我们回去看看我们的 HTML 代码中的 style 样式表，我们发现 HTML 中的 img 标签会被两个 CSS 选择器匹配中，分别是 body div #myId 和 body div img。这样就会导致前面匹配中后加入 computedStyle 的属性值会被后面匹配中的属性值所覆盖。但是根据 CSS 中的权重规则，ID选择器是高于标签选择器的。这个问题将在下一部分解决掉。

### 2.7 Specificity（优先级） 的计算逻辑

specification 是什么？

- 首先 specifity 会有四个元素
- 按照 CSS 中优先级的顺序来说就是 inline style > id > class > tag
- 所以把这个生成为 specificity 就是 [0, 0, 0, 0]， 抽象一下就是specification ：[inline style,  id, class, tag]
- 数组里面每一个数字都是代表在样式表中出现的次数

A组选择器

A 选择器：div div #id

A 的 specification ：[0, 1, 0, 2]

  - id 出现了一次，所以第二位数字是 1
  - div tag 出现了两次，所以第四位数是 2

B组选择器

  - B 选择器：div #my #id
  - B 的 specification：[0, 2, 0, 1]

id 出现了两次，所以第二位数字是 2

div tag 出现了一次，所以第四位数是 1

怎么去比较上面的两种选择器，那个更大呢？

- 我们需要从左到右开始比对；

- 遇到同位置的数值一样的，就可以直接跳过；

- 直到我们找到一对数值是有不一样的，这个时候就看是哪个选择器中的数值更大，那个选择器的优先级就更高；

- 只要有一对比对出大小后，后面的就不需要再比对了。

用上面 A 和 B 两种选择器来做对比的话，第一对两个都是 0，所以可以直接跳过。

然后第二位数值对，A选择器是 1，B选择器是 2，很明显 B 要比 A 大，所以 B 选择器中的属性就要覆盖 A 的。

代码思路：

- CSS 规则根据 specificity 和后来优先规则覆盖
- specificity 是个四元组，越左边权重越高
- 一个 CSS 规则的 specificity 根据包含的简单选择器相加而成

