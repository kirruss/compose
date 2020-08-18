# [1.1.0](https://github.com/kirusuu/compose/compare/v1.0.0...v1.1.0) (2020-08-18)


### Bug Fixes

* added a check for calling next multiple times when composing ([aa9a76b](https://github.com/kirusuu/compose/commit/aa9a76ba322387e4636e19f97e2746fcfb9c0430))
* added a check for empty middleware chains when composing ([c52d778](https://github.com/kirusuu/compose/commit/c52d7788d8ae47e42b811557e56bc15afd16d419))


### Features

* refactored middleware composition to call next automatically ([28e8e1e](https://github.com/kirusuu/compose/commit/28e8e1e31ac420b480f1ca3319c5f79a2afde933))

# 1.0.0 (2020-08-17)


### Bug Fixes

* awaited execution of middleware when composing chain ([a4aee28](https://github.com/kirusuu/compose/commit/a4aee28767a26a3407a77603e26b5eb26e4f5dd1))
* changed middleware type that gets exported ([27f815d](https://github.com/kirusuu/compose/commit/27f815dafaa7eea2875bd0711430c479f34bbb28))
* made middleware composition function call right context object ([f92d777](https://github.com/kirusuu/compose/commit/f92d77759b21b30ca74bc1f628f05de788d89d19))
* made middlewarecomposer getmiddleware method return a middleware function ([c7dae51](https://github.com/kirusuu/compose/commit/c7dae51e1dc0dc94f16f77f7ea7f690091cc430b))
* refactored middleware composition to mutate the initial context reference ([2343e4e](https://github.com/kirusuu/compose/commit/2343e4eb88b10d4840690812f6ddba1f4a53ece3))


### Features

* added a basic middlewarecomposer class ([2a09c1a](https://github.com/kirusuu/compose/commit/2a09c1a82bb67c0b4218162cfa9e0607b2462eab))
* added a function for unsafely composing middleware ([d445d8c](https://github.com/kirusuu/compose/commit/d445d8c9ecc1c086e182f7a8976ba025c5a35ef8))
* added a helper for normalising middleware ([583bf2c](https://github.com/kirusuu/compose/commit/583bf2c2bf588f480ed8105124edd32040a42ae1))
* added a type guard for imiddleware ([6fbbc73](https://github.com/kirusuu/compose/commit/6fbbc733023fb40fa5736e6736b1c58eb08dd869))
* added additional type definitions and castings for type safe middleware composition ([ac8822a](https://github.com/kirusuu/compose/commit/ac8822a68421f8f5cb20722a07289d9931308421))
* added context merging to middleware composition ([fbc61f0](https://github.com/kirusuu/compose/commit/fbc61f08c75f3d83492dfc3da4b9425bb79a96a0))
* added helper types and the base middleware types ([647e078](https://github.com/kirusuu/compose/commit/647e078e36abf4bd6cdec5c616a8aefd70474b8a))
* implemented getmiddleware method for middlewarecomposer ([314b725](https://github.com/kirusuu/compose/commit/314b725a561c1c31edd0d666b943107c5ab6d744))
