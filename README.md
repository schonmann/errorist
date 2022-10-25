# errorist ![Test Status](https://github.com/schonmann/errorist/actions/workflows/node.js.yml/badge.svg)
A JavaScript library that provides an error implementation with context ✨🕵️ 

## Purpose

The library is designed to be compatible with the standard JavaScript ways, while also enforcing a better context to an error by:
* Forcing the usage of error codes;
* Patching errors with data;
* Keeping track of its causes;
* Improving error stack readability.

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

## Basic Usage

Consist on creating error types with the `create` function, which will dynamically create subclasses of `Errorist` for each of your custom errors.

An `Errorist` instance can be defined with the following parameters:

* `code` (String): the error code on your application.
* `message` (String): a human readable message.
* `name` (String | optional): the error name.
* `causes` (Array | optional): the causes for this error.

## Use cases

### Handling errors

```
--- someError.js 

const SomeError = Errorist.create({
    code: "some-error-code",
    message: "some human readable message",
})

--- index.js

try {
    throw new SomeError({
        causes: [new CauseOneError(), new CauseTwoError()]
    });
} catch (e) {
    const errorist = Errorist.wrap(e);
    
    errorist.is(SomeError) // true
    errorist.isCausedBy(SomeError) // false
    errorist.isCausedBy(CauseOneError) // true
    errorist.is(CauseOneError) // true
    errorist.is(CauseTwoError) // true
}

```
### Patching errors with context data

```
const data = { ... }; /* some useful data that would help debugging */;
try {
    // some error is thrown!
} catch (e) {
    throw Errorist.wrap(e).with(data);
}

```
