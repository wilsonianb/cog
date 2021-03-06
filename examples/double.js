const Koa = require('koa')
const ILP = require('ilp')
const Router = require('koa-router')
const Parser = require('koa-bodyparser')
const Cog = require('..')

const router = Router()
const parser = Parser()
const app = new Koa()
const cog = new Cog.KoaCog()

const router2 = Router()
const parser2 = Parser()
const app2 = new Koa()
const cog2 = new Cog.KoaCog()

router2.options('/', cog.options())
router2.get('/', cog.paid(), async ctx => {
  await ctx.accountant.awaitBalance(1000)

  ctx.body = { foo: 'bar' }
})

router.options('/', cog.options())
router.get('/', cog.paid(), async ctx => {
  await ctx.accountant.awaitBalance(1000)
  const response = await Cog.Client.call({
    plugin: ctx.accountant,
    url: 'localhost:8091/',
    method: 'get',
    body: {}
  })

  ctx.body = response.body
})

app2
  .use(parser2)
  .use(router2.routes())
  .use(router2.allowedMethods())
  .listen(8091)

app
  .use(parser)
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(8090)
