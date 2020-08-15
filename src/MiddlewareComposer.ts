type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>
}

type Awaitable<T> = Promise<T> | T

interface IMiddleware<T, R extends T> {
    getMiddleware(): Middleware<T, R>
}

export type FunctionMiddleware<T, R extends T> = (
    ctx: T,
    next: () => Promise<void>
) => Awaitable<DeepPartial<R> | void>

type Middleware<T, R extends T = T> =
    | IMiddleware<T, R>
    | FunctionMiddleware<T, R>

const isIMiddleware = <T, R extends T>(
    middleware: Middleware<T, R>
): middleware is IMiddleware<T, R> => {
    return (middleware as IMiddleware<T, R>).getMiddleware !== undefined
}

export class MiddlewareComposer<T, R extends T = T>
    implements IMiddleware<T, R> {
    private middleware: Middleware<any, any>[] = []

    public use<R2 extends R>(
        newMiddleware: Middleware<T, R2>
    ): MiddlewareComposer<T, R & R2> {
        this.middleware.push(newMiddleware)

        return this
    }

    public getMiddleware() {
        // TODO: compose the middleware from this.middleware
        return null as any
    }
}
