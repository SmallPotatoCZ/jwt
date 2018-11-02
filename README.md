# JWT　例子

## 简介

学习 JWT 验证的例子。里面的例子都来源网络中开源的例子。

## 目录结构

./server - 服务端代码
├── main.js - 主入口
├── jwt - jwt.io 的例子
│   ├── index.js - 主入口
│   ├── db - 本地数据库存储目录
│   └── end
./html - 前端 HTML 文件
├── /jwt - jwt.io 例子中所用到的 HTML 文件
│   └── end
└── end

## 常见问题与答案

+ 把 JWT 放在 URL 或者 Header 中能保证安全吗？

不能的。明文传出 Token 总是不安全的，除非我们使用了 SSl/TLS 去加密我们的连接。不过可以首先做一些简单的安全防护，像：检测请求是否来自相同的 user-agent 或者 IP 地址。[连接地址1](https://softwareengineering.stackexchange.com/questions/122372/is-browser-fingerprinting-a-viable-technique-for-identifying-anonymous-users) [链接店址2](https://stackoverflow.com/questions/216542/how-do-i-uniquely-identify-computers-visiting-my-web-site/3287761#3287761)

解决方法：

  + 使用单次的 token（链接点击后，token 过期）。
  + 在较高安全要求时，不在 url 携带 token 去验证。（在进行交易时，不使用通过链接完成支付）

使用案例：
  
  +  [账号验证——邮件验证账号注册]()
  +  [重置密码——向邮件发送修改密码的链接]()

+ 如何使会话失效？

对于 JWT，它是无状态的，它可以通过任何集群中的节点和不向数据库发请求的方式进行验证。

将 token 存储在数据库中
  
  + level DB

  适用于小型的应用——[LevelDB](http://leveldb.org/)。

  将有效和无效的 Token 存储在数据库中。往返的请求都需要查询 token 是否有效，所以需要存储 token 和更新 token 的有效性属性的值。

  + Redis

  可扩展的存储。

  学习 Redis 的链接：

    + [介绍](http://redis.io/topics/introduction) 
    + [快速入门](http://openmymind.net/2011/11/8/Redis-Zero-To-Master-In-30-Minutes-Part-1/) 
    + [什么是 Redis](http://www.slideshare.net/dvirsky/introduction-to-redis) 
    + [demo](https://github.com/dwyl/learn-redis)

  + 内存缓存

  [链接](http://stackoverflow.com/questions/10558465/memcache-vs-redis)

+ 如何保持会话？

Cookie 是存储在客户端中，并在向服务器中发请求都会携带。然而每一个请求都会携带 cookie，这包括图片请求和 CSS 请求。

localStorage 是一种更好的机制为了存储浏览器会话的 Token。

## 参考链接

[jwt.io](https://github.com/dwyl/learn-json-web-tokens)
[https://blog.bitsrc.io/understanding-json-web-token-authentication-a1febf0e15](https://blog.bitsrc.io/understanding-json-web-token-authentication-a1febf0e15)