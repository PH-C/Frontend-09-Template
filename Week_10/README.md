# 学习笔记

排版布局
## 第一步 预处理
处理 flexDirection 和 wrap相关的属性 将其抽象成main/cross轴(主轴/交叉轴)的一些属性。
把具体的width、height、right、left、top、bottom等抽象成main、cross等相关属性
## 第二步 收集元素
分行算法

根据主轴尺寸，把元素进行分进行（剩余空间不足以显示当前项则换行）
如果设置了no-wrap(默认的)，所有元素则强制分配进第一行
## 第三步 计算主轴
找出所有flex元素
把主轴方向的剩余尺寸按比例分配给这些元素（覆盖设置尺寸）
若剩余空间为负数，将所有flex元素主轴尺寸设置为0，等比压缩剩余元素
如果没有flex元素，根据justify-content来计算主轴方向上每个元素的位置
## 第四步 计算交叉轴
根据每一行中最大元素尺寸计算行高
根据行高flex-align和item-align，确定元素具体位置
## 第五步 绘制单个元素
绘制需要依赖一个图形环境
这里采用了npm包images
绘制在一个viewport上进行
与绘制相关的属性：background-color、border、background-image等
## 第六步 绘制DOM树
递归调用子元素的绘制方法完成DOM树的绘制
忽略一些不需要绘制的节点
实际浏览器中，文字绘制是难点，需要依赖字体库，我们这里忽略
实际浏览器中，还会对一些图层做compositing（合成），我们这里也忽略了