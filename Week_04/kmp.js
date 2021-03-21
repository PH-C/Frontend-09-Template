function kmp(source, pattern) {
  let nextArr = new Array(pattern.length).fill(0); //初始化next数组、或者叫做前缀表、跳转表
  {
    let i = 1; //初始化后缀末尾
    let j = 0; //初始化前缀末尾，也是最长相等前后缀的值，即跳转位置下标
    while (i < pattern.length) {
      // 分支，处理前后缀不相同和前后缀相同这两个情况
      if (pattern[i] === pattern[j]) {
        ++j, ++i;
        nextArr[i - 1] = j; //这里和老师不一样，包括了当前位置，但是都可以
      } else {
        if (j > 0) {
          j = nextArr[j - 1];
        } else {
          ++i;
        }
      }
    }
    console.log(nextArr);
  }
  {
    let i = 1;
    let j = 0;
    while (i < source.length) {
      if (j === pattern.length - 1) {
        return true;
      }
      // 分支，处理前后缀不相同和前后缀相同这两个情况
      if (source[i] === pattern[j]) {
        ++j, ++i;
        nextArr[i - 1] = j;
      } else {
        if (j > 0) {
          j = nextArr[j - 1]; //跳转到pattern位置
        } else {
          ++i;
        }
      }
    }
    return false;
  }
}
console.log(kmp("aabaabaaf", "aabaafa"));

//计算模式串最长相等前后缀
