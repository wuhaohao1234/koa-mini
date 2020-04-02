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