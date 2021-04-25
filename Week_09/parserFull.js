

const css = require('css');

const EOF = Symbol("EOF"); // End Of File
let currentToken = null;
let currentAttribute = null;
let currentTextNode = null;
let rules = [];
let stack = [{ type: 'document', children: [] }];

function specifity(selector) {
  var p = [0, 0, 0, 0];
  let selectorParts = selector.split(" ");
  for (let part of selectorParts) {
    if (part.charAt(0) == "#") {
      p[1] += 1;
    } else if (part.charAt(0) == ".") {
      p[2] += 1; 
    } else {
      p[3] += 1;
    }
  }
  return p;
}

function compare(sp1, sp2) {
  if (sp1[0] - sp2[0]) {
    return sp1[0] - sp2[0];
  }
  if (sp1[1] - sp2[1]) {
    return sp1[1] - sp2[1];
  }
  if (sp1[2] - sp2[2]) {
    return sp1[2] - sp2[2];
  }
  return sp1[3] - sp2[3];
}

function match(element, selector) {
  if (!selector || !element.attributes) {
    return false;
  }
  if (selector.charAt(0) == "#") {
    let attr = element.attributes.filter(attr => attr.name === "id")[0];
    if (attr && attr.value === selector.replace("#", "")) {
      return true;
    } 
  } else if (selector.charAt(0) == ".") {
    let attr = element.attributes.filter(attr => attr.name === "class")[0];
    if (attr && attr.value === selector.replace(".","")) {
      return true;
    }
  } else {
    if (element.tagName === selector) {
      return true;
    }
  }
  return false;
}

function computeCSS(element) {
  var elements = stack.slice().reverse();
  if (!element.computedStyle) {
    element.computedStyle = {};
  }
  for (let rule of rules) {
    let selectorParts = rule.selectors[0].split(" ").reverse();
    if (!match(element, selectorParts[0])) {
      continue;
    }
    //当前元素匹配中了，就一直往外寻找父级元素找到能匹配上选择器的元素
    let matched = false;
    let j = 1;
    for (let i = 0; i < elements.length; i++) {
      if (match(elements[i], selectorParts[j])) {
        j++;
      }
    }
    // 最后检验匹配中的元素是否等于选择器的总数，是就是全部匹配了，不是就是不匹配
    if (j >= selectorParts.length) {
      matched = true;
    }
    if (matched) {
      if (matched) console.log('Element', element, 'matched rule', rule);
      // let computedStyle = element.computedStyle;
      // for (let declaration of rule.declarations) {
      //   if (!computedStyle[declaration.property]) computedStyle[declaration.property] = {};
      //   computedStyle[declaration.property].value = declaration.value;
      // }
      // console.log(computedStyle);

      let sp = specifity(rule.selectors[0]);// 计算当前组合选择器的优先级四元组
      let computedStyle = element.computedStyle;
      for (let declaration of rule.declarations) {
        if (!computedStyle[declaration.property]) {
          computedStyle[declaration.property] = {};
        }
        if (!computedStyle[declaration.property].specifity) {
          computedStyle[declaration.property].value = declaration.value; // css属性添加属性值
          computedStyle[declaration.property].specifity = sp; // 给css属性添加优先级四元组

        } else if (compare(computedStyle[declaration.property].specifity, sp) < 0) {//如果当前属性在另外一个组合选择器中存在，那就比较优先级，优先级高的覆盖低的属性值
          computedStyle[declaration.property].value = declaration.value;
          computedStyle[declaration.property].specifity = sp;
        }
      }
      console.log('Element', element, 'computedStyle', computedStyle);
    }
  }
  console.log(rules);
  console.log('compute CSS for Element', element);
}

function addCSSRule(text) {
  var ast = css.parse(text);
  console.log(JSON.stringify(ast, null, '    '));
  rules.push(...ast.stylesheet.rules);
}

function emit(token) {
  console.log(token);
  let top = stack[stack.length - 1];
  if (token.type === 'startTag') {
    let element = {
      type: "element",
      children: [],
      attributes: [],
    };

    element.tagName = token.tagName;

    for (let p in token) {
      if (p != "type" && p != "tagName") {
        element.attributes.push({
          name: p,
          value: token[p],
        });
      }
    }

    // 元素构建好之后直接开始 CSS 计算
    computeCSS(element);

    top.children.push(element);
    element.parent = top;
    if (!token.isSelfClosing) {
      stack.push(element);
    }
    currentTextNode = null;
  } else if (token.type === 'endTag') {
    if (top.tagName != token.tagName) {
      throw new Error("Tag start end doesn't match");
    } else {
      // 遇到style标签时，执行添加CSS规则操作
      if (top.tagName === 'style') {
        addCSSRule(top.children[0].content);
      }
      stack.pop();
    }
    currentTextNode = null;
  } else if (token.type === 'text') {
    if (currentTextNode === null) {
      currentTextNode = {
        type: "text",
        content: "",
      };
      top.children.push(currentTextNode);
    }
    currentTextNode.content += token.content;
  }
}


function data(c) {
  if (c === "<") {
    return tagOpen;
  } else if (c === EOF) {
    emit({
      type: "EOF",
    });
    return;
  } else {
    emit({
      type: "text",
      content: c,
    });
    return data;
  }
}

function tagOpen(c) {
  if (c == "/") {
    // 找到 `/` 证明是自关闭标签
    return endTagOpen;
  } else if (c.match(/^[a-zA-Z]$/)) {
    // 如果是字母就是标签名
    currentToken = {
      type: "startTag",
      tagName: "",
    };
    return tagName(c);
  } else {
    return;
  }
}

function endTagOpen(c) {
  if (c.match(/^[a-zA-Z]$/)) {
    // 如果是字母就是标签名
    currentToken = {
      type: "endTag",
      tagName: "",
    };
    return tagName(c);
  } else if (c === ">") {
    // 如果直接是 `>` 就报错
  } else if (c === EOF) {
    // 报错结束标签不合法
  }
}

function tagName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName;
  } else if (c === "/") {
    // 如果遇到 `/` 就是自封闭标签状态
    return selfClosingStartTag;
  } else if (c.match(/^[a-zA-Z]$/)) {
    currentToken.tagName += c;
    return tagName;
  } else if (c === ">") {
    emit(currentToken);
    return data;
  } else {
    return tagName;
  }
}
// <html class='b'
function beforeAttributeName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    // 如果 `\t`(Tab符)、`\n`(空格符)、`\f`(禁止符)或者是空格，这里就是属性的开始
    return beforeAttributeName;
  } else if (c === "/" || c === ">" || c === EOF) {
    // 如果是 `>` 就是开始标签结束
    return afterAttributeName(c);
  } else if (c === "=") {
    return beforeAttributeName;
  } else {
    currentAttribute = {
      name: "",
      value: "",
    };
    return attributeName(c);
  }
}

function afterAttributeName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return afterAttributeName;
  } else if (c == "/") {
    return selfClosingStartTag;
  } else if (c == "=") {
    return beforeAttributeValue;
  } else if (c == ">") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data; 
  } else if (c == EOF) {
    // 
  } else {
    currentToken[currentAttribute.name] = currentAttribute.value;
    currentAttribute = {
      name: "",
      value: ""
    };
    return attributeName(c);
  }
}

function attributeName(c) {
  if (c.match(/^[\t\n\f ]$/) || c === "/" || c === ">" || c === EOF) {
    return afterAttributeName(c);
  } else if (c === "=") {
    return beforeAttributeValue;
  } else if (c === "\u0000") {
    // 错误
  } else if (c === '\"' || c === "'" || c === "<") {
    // 错误
  } else {
    currentAttribute.name += c;
    return attributeName;
  }
}

function beforeAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/) || c == "/" || c == ">" || c == EOF) {
    return beforeAttributeValue;
  } else if (c == "\"") {
    return doubleQuotedAttributeValue;
  } else if (c == "'") {
    return singleQuotedAttributeValue;
  } else if (c == ">") {
   // 
  } else {
    return unquotedAttributeValue(c);
  }
}

function doubleQuotedAttributeValue(c) {
  if (c == "\"") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuotedAttributeValue;
  } else if (c == "\u0000") {
    // 
  } else if (c == EOF) {
    // 
  } else {
    currentAttribute.value += c;
    return doubleQuotedAttributeValue;
  }
}

function singleQuotedAttributeValue(c) {
  if (c === "\'") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuotedAttributeValue;
  } else if (c === "\u0000") {
    // 错误
  } else if (c === EOF) {
    // 错误
  } else {
    currentAttribute.value += c;
    return doubleQuotedAttributeValue;
  }
}

function afterQuotedAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName;
  } else if (c === "/") {
    return selfClosingStartTag;
  } else if (c === ">") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (c == EOF) {
    // 错误
  } else {
    currentAttribute.value += c;
    return doubleQuotedAttributeValue;
  }
}
function unquotedAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return beforeAttributeName;
  } else if (c == "/") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return selfClosingStartTag;
  } else if (c == ">") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (c == "\u0000") {
    // 错误
  } else if (c == "\"" || c == "'" || c == "<" || c == "=" || c == "`") {
    // 错误
  } else if (c == EOF) {
    // 错误
  } else {
    currentAttribute.value += c;
    return unquotedAttributeValue;
  }
}

function selfClosingStartTag(c) {
  if (c === ">") {
    // 自封闭标签结束
    currentToken.isSelfClosing = true;
    emit(currentToken);
    return data;
  } else if (c === "EOF") {
    // 报错
  } else {
    // 报错
  }
}

module.exports.parseHTML = function parseHTML(html) {
  console.log(html);
  let state = data;
  for (let c of html) {
    state = state(c);
  }
  state = state(EOF);
};
