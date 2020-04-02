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
