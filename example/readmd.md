# koa API 实现

## example

```
const Koa = require('koa-mini')
const app = new Koa()

app.use(async (ctx, next) => {
  console.log('Middleware 1 Start')
  await next()
  console.log('Middleware 1 End')
})

app.use(async (ctx, next) => {
  console.log('Middleware 2 Start')
  await next()
  console.log('Middleware 2 End')

  ctx.body = 'hello, world'
})

app.listen(3000)
```

## 第一版 封装use与listen

```

const {Application} = require('./index')  
const app = new Application()

app.use((req,res) => {
    res.end('hello world')
})
app.listen(3000,() => {
    console.log('the server listen 3000')
})

```

code

```

const http = require('http')

class Application {
    constructor() {
        this.midleware = null
    }
    listen(...args) {
        const server = http.createServer(this.midleware)
        server.listen(...args)
    }
    use(midleware) {
        this.midleware = midleware
    }
}

exports.Application = Application
```

## 第二版:构建context

API
```
const {Application} = require('./index')  
const app = new Application()

app.use(ctx => {
    ctx.body = 'hello world'
})
app.listen(3000,() => {
    console.log('the server listen 3000')
})
```

code

```

const http = require('http')

class Application {
    constructor() { }
    use(middleware) {
        this.middleware = middleware
    }
    listen(...args) {
        const server = http.createServer((req,res) => {
            // 构造 Context 对象
            const ctx = new Context(req,res)
            // 此时处理为与 koa 兼容 Context 的 app.use 函数
            this.middleware(ctx)

            // ctx.body 为响应内容
            ctx.res.end(ctx.body)
        })
        server.listen(...args)
    }
}

// 构造一个 Context 的类
class Context {
    constructor(req,res) {
        this.req = req
        this.res = res
    }
}
exports.Application = Application
```

## 第三版:构建compose

```
const { Application } = require('./index')

const app = new Application()

app.use(async (ctx,next) => {
    console.log(1)
    ctx.body = 'hello, one'
    await next()
})

app.use(async (ctx,next) => {
    console.log(2)
    ctx.body = 'hello, two'
    await next()
})

app.listen(7000)

```

code 

```
const http = require('http')


function compose (middlewares) {
  return ctx => {
    const dispatch = (i) => {
      const middleware = middlewares[i]
      if (i === middlewares.length) {
        return
      }
      return middleware(ctx, () => dispatch(i+1))
    }
    return dispatch(0)
  }
}

class Context {
  constructor (req, res) {
    this.req = req
    this.res = res
  }
}
class Application {
  constructor () {
    this.middlewares = []
  }

  listen (...args) {
    const server = http.createServer(async (req, res) => {
      const ctx = new Context(req, res)

      // 对中间件回调函数串联，形成洋葱模型
      const fn = compose(this.middlewares)
      await fn(ctx)

      ctx.res.end(ctx.body)
    })
    server.listen(...args)
  }

  use (middleware) {
    // 中间件回调函数变为了数组
    this.middlewares.push(middleware)
  }
}
exports.Application = Application
```