# @kirrus/compose

![GitHub Workflow Status](https://img.shields.io/github/workflow/status/kirruss/compose/Continuous%20Integration?logo=github-actions&logoColor=white&style=for-the-badge)  ![Code Climate coverage](https://img.shields.io/codeclimate/coverage/kirruss/compose?logo=code-climate&style=for-the-badge) ![Code Climate maintainability](https://img.shields.io/codeclimate/maintainability/kirruss/compose?logo=code-climate&style=for-the-badge) ![Code Climate technical debt](https://img.shields.io/codeclimate/tech-debt/kirruss/compose?logo=code-climate&style=for-the-badge)

## Type-safe middleware composition utility for the Kirrus framework

### `@kirrus/compose` is a module part of the kirrus namespace, used for composing middleware in a typesafe and lazy manner

This package exposes a type(`Middleware`) and a class(`MiddlewareComposer`).

The type `Middleware` is used for defining what a middleware and it looks as follows:

```typescript
interface IMiddleware<T, R extends T> {
    getMiddleware(): Middleware<T, R>
}

type FunctionMiddleware<T, R extends T> = (
    ctx: T,
    next: () => Promise<void>
) => Awaitable<DeepPartial<R> | void>

type Middleware<T, R extends T = T> =
    | IMiddleware<T, R>
    | FunctionMiddleware<T, R>
```

In most usecases, you'll find yourself writing middleware that fit `FunctionMiddleware` type, but just in case you want to do something fancy like a custom router, the `IMiddleware` type has been exposed too 🙂

For usage of `MiddlewareComposer`, see [Using `@kirrus/compose`](#using-this-module)

### Installation

To install the `compose` module, simply type:

```bash
npm i @kirrus/compose
```

### Using this module

```ts
import { Middleware, MiddlewareComposer } from "@kirrus/compose"

// This is the type of the context
// we'll be using for type safety
type Context = { count: number }

// This is the initial context
// adding a basic count property
// and giving it an initial value of 0
const context: Context = { count: 0 }

// This is the first middleware
// that increases the count property
// of the context
const increaseCount: Middleware<Context> = async (ctx, next) => {
    ctx.count++

    await next()
}

// This is the second middleware
// that doubles the count property
// of the context
const doubleCount: Middleware<Context> = async (ctx, next) => {
    ctx.count *= 2

    await next()
}

// And finally this is our middleware composer instance
// that we provide with a chain of middleware
// in the order we want the middleware to be executed
// using the .use(middleware) method
// and finally get the resulting composed middleware
// using the .getMiddleware() method
const composedMiddleware = new MiddlewareComposer<Context>()
    .use(increaseCount)
    .use(doubleCount)
    .getMiddleware()

// The initial context
console.log(context) // { count: 0 }

// We apply the composed middleware
// on our context
// providing an empty next function
// Note: this assumes top-level await
await composedMiddleware(context, async () => {})

// The resulting context
console.log(context) // { count: 2 }
```

#### Documentation

You can find the automatically generated changelog [here](CHANGELOG.md)

So far there is no documentation for this module.

#### Contributing

To contribute, check the contribution guide [here](CONTRIBUTING.md)

#### Licence

`@kirrus/compose` and all other repos under the kirrus organisation use the [Unlicense](UNLICENSE).