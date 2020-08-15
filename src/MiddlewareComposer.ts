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
): FunctionMiddleware<any, any> => async (context, next) => {
    const run = async (i: number): Promise<any> => {
        if (middleware.length === i) {
            return await next()
        }

        const newContext = await middleware[i](context, () => run(i + 1))

        if (newContext) {
            Object.assign(context, newContext)
            await run(i + 1)
        }
    }

    return run(0)
}

export class MiddlewareComposer<T, R extends T = T>
    implements IMiddleware<T, R> {
    private middleware: Middleware<any, any>[] = []

    public use<R2 extends R>(
        newMiddleware: Middleware<T, R2>
    ): MiddlewareComposer<T, R & R2> {
        this.middleware.push(newMiddleware)

        return (this as any) as MiddlewareComposer<T, R & R2>
    }

    public getMiddleware(): FunctionMiddleware<T, R> {
        return unsafeCompose(this.middleware.map(normaliseMiddleware))
    }
}
