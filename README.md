# errorist
A JavaScript library that provides traceable errors ✨🕵️

> The one who encourages and propagates error.
> 
> [— Collins Dictionary](https://www.collinsdictionary.com/dictionary/english/errorist)

[TL;DR: check use cases!](#Usage)

## Install
The package for `errorist` is available on the public *npm registry*.

* With `yarn`:
```
yarn add errorist
```
* With `npm`:
```
npm install --save errorist
```

## Purpose

The library is designed to enforce a better context to an error by:
* Keeping track of an error root causes and detect them at ease;
* Forcing the usage of error codes;
* Encouraging succint, precise error messages;
* Patching errors with related data.

## Usage
### #1: Custom error class definition

```javascript
class SomeError extends Errorist {
  constructor(message) {
    super(message || "some human readable message");
    this.code = "some-error-code";
    this.name = "SomeError";
  }
}

// Alternatively:

const SomeError = Errorist.extend({
  message: "some human readable message",
  code: "some-error-code",
  name: "SomeError"
})
```
### #2: Throwing a custom error

```javascript
try {
  // ...
} catch(e) {
  throw SomeCustomError.create({
    causes: e,
    data: {
      foo: "some data",
      bar: "some other data"
    }
  })
}
```
### #3: Checking for causes

```javascript
const doSomething = () => {
  throw SomeError.create({
    causes: [new CauseOneError(), new CauseTwoError()]
  });
};

try {
  doSomething();
} catch (e) {
  const err = Errorist.wrap(e); 
  
  err.is(SomeError)             // => SomeError [Errorist]
  err.isCausedBy(SomeError)     // => null
  err.isCausedBy(CauseOneError) // => CauseOneError [Errorist]
  err.is(CauseOneError)         // => CauseOneError [Errorist]
}
```
### #4: Out of the box, Golang style error handling
```javascript
const [err, thing] = await errorist.try(createThing);
if (err?.is(ThingAlreadyCreatedError)) {
  // ...
}
```

## Maintainers ✨

- Antonio Schönmann ([@schonmann](https://github.com/schonmann))
