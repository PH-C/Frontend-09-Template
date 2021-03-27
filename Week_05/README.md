学习笔记
## Proxy与双向绑定
#### 基本用法
```
    let object = {
      a: 1,
      b: 2
    }

    let po = new Proxy(object, {
      set(obj, prop, val){
        console.log(obj, prop, val)
      }
    })
```
Proxy可以改变对象行为，经过Proxy代理的对象可以理解为一个特殊的对象，这个对象上的所有的行为都是可以被重新再去指定的， Object在使用了Proxy后对象的这种可预测性会降低。proxy详细介绍请参考：
https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy

## Proxy的应用
#### 模仿reactive实现原理
在vue3.0中我们把vue原来的能力拆了一下包、产生了一个叫reactive这样的一个包，这个reactive是适用Proxy实现的，这里来模仿reactive的实现。
通过effect传入一个函数，就可以监听事件