import { expect } from "chai"
import { MiddlewareComposer, Middleware } from "./"

describe("Middleware Composer class", () => {
    it("composes middleware that mutate and call next", async () => {
        type Context = { count: number }

        const initialContext: Context = { count: 0 }
        const context: Context = { ...initialContext }
        const resultingContext: Context = { count: 2 }

        const middleware: Middleware<Context> = async (ctx, next) => {
            ctx.count++

            await next()
        }

        const composedMiddleware = new MiddlewareComposer<Context>()
            .use(middleware)
            .use(middleware)
            .getMiddleware()

        await composedMiddleware(context, async () => {})

        expect(context).to.deep.equal(resultingContext)
    })
})
