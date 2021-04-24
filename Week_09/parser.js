let currentToken = null;
let currentAttribute = null;

function emit(token) {
  console.log(token);
}

const EOF = Symbol("EOF"); // End Of File

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
