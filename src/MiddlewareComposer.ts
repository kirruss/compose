type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>
}

type Awaitable<T> = Promise<T> | T

interface IMiddleware<T, R extends T> {
    getMiddleware(): Middleware<T, R>
}

type FunctionMiddleware<T, R extends T> = (
    ctx: T,
    next: () => Promise<void>
) => Awaitable<DeepPartial<R> | void>

/**
 * Type that describes either a middleware interface that
 * has a method for returning the middleware
 * or a middleware function that takes a context and
 * either doesn't call or calls a next function once
 */
export type Middleware<T, R extends T = T> =
    | IMiddleware<T, R>
    | FunctionMiddleware<T, R>

const isIMiddleware = <T, R extends T>(
    middleware: Middleware<T, R>
): middleware is IMiddleware<T, R> => {
    return (middleware as IMiddleware<T, R>).getMiddleware !== undefined
}

const normaliseMiddleware = <T, R extends T>(
    middleware: Middleware<T, R>
): FunctionMiddleware<T, R> => {
    if (isIMiddleware(middleware)) {
        return normaliseMiddleware(middleware)
    }

    return middleware
}

const unsafeCompose = (
    middleware: FunctionMiddleware<any, any>[]
): FunctionMiddleware<any, any> => {
    const [head, ...tail] = middleware
    const continuation = unsafeCompose(tail)

    return async (context, nextRaw) => {
        let nextCalled = false

        const next = async () => {
            nextCalled = true
            await continuation(context, nextRaw)
        }

        const partial = await head(context, next)

        if (partial) {
            Object.assign(context, partial)
        }

        if (!nextCalled) await next()
    }
}

/**
 * Utility for lazily composing middleware chains
 */
export class MiddlewareComposer<T, R extends T = T>
    implements IMiddleware<T, R> {
    private middleware: Middleware<any, any>[] = []

    /**
     * Appends a middleware to the end of the chain
     *
     * @example
     * type Context = { state: { count: number } }
     *
     * const increaseStateCount: Middleware<Context> = async (ctx, next) => {
     *     ctx.state.count++
     *
     *     await next()
     * }
     *
     * const composer: MiddlewareComposer<Context, Context> = new MiddlewareComposer<
     *     Context
     * >().use(increaseStateCount)
     *
     * @param middleware A middleware function or middleware interface
     * (such as a router) to be normalised
     * @returns A new lazy composing instance
     * with the new middleware appended
     */
    public use<R2 extends R>(
        newMiddleware: Middleware<T, R2>
    ): MiddlewareComposer<T, R & R2> {
        this.middleware.push(newMiddleware)

        return (this as any) as MiddlewareComposer<T, R & R2>
    }

    /**
     * Normalises all middleware in the chain
     * then composes them and returns a function
     * that takes a context and a next function
     *
     * @example
     * type Context = { state: { count: number } }
     *
     * const increaseStateCount: Middleware<Context> = async (ctx, next) => {
     *     ctx.state.count++
     *
     *     await next()
     * }
     *
     * const composer: Middleware<Context> = new MiddlewareComposer<Context>()
     *     .use(increaseStateCount)
     *     .use(increaseStateCount)
     *     .getMiddleware()
     *
     * @returns A new middleware that when called executes all middleware in order, mutating the original context reference
     */
    public getMiddleware(): FunctionMiddleware<T, R> {
        return unsafeCompose(this.middleware.map(normaliseMiddleware))
    }
}
