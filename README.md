# react-simple

achieve a simple react

# react 实现总结

1、JSX 是 react.createElement 的语法糖,用于 js 中写 html;
2、ReactDOM.render 方法将虚拟 DOM 转化为真实 DOM;

# virtual DOM 算法

1、用 JS 对象表示 DOM 树结构,将该对象构建为真实 DOM,插入到文档中;
2、状态变更时重新构造新的对象树,然后新的对象树与真实 DOM 树比较,记录差异(diff);
3、将差异应用到真实 DOM 中;

参考连接: https://github.com/hujiulong/blog/issues/4
https://github.com/livoras/blog/issues/13
