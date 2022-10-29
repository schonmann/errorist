# errorist
A JavaScript library that provides traceable errors ✨🕵️

> The one who encourages and propagates error.
> 
> [— Collins Dictionary](https://www.collinsdictionary.com/dictionary/english/errorist)

[TL;DR: Check use cases!](#use-cases)

## Purpose

The library is designed to be compatible with the standard JavaScript ways, while also enforcing a better context to an error by:
* Keeping track of an error root causes and detect them at ease;
* Forcing the usage of error codes;
* Encouraging error messages;
* Patching error with related data;

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
## Use cases

### Out of the box, Golang-style exception handling:


```javascript
const VikingNotFoundError = Errorist.extend({
    code: 'viking-not-found-error',
    message: 'viking not found!'
});

const ValhallaJoiningError = Errorist.extend({
    code: 'valhalla-error',
    message: 'cant join valhalla!'
});

const AlreadyJoinedValhallaError = ValhallaError.extend({
    code: 'already-joined-valhalla-error',
    message: 'already joined valhalla!'
});

async function sendVikingToValhalla({ name }) {
    const [viking, fetchErr] = await errorist.try(() => fetchViking({ name }));
    if (fetchErr?.is()) {
       throw fetchErr;
    }

    const [valhallaViking, sendErr] = await errorist.try(() => sendToValhalla(viking));
    if (sendErr?.is(AlreadyInValhallaError)) {
        logger.warning('Viking was already in valhalla!');
    }

    return valhallaViking;
};

async function main() {
    const vikings = [
        'Lagertha Lodbrok',
        'Ragnar Lodbrok',
        'Bjørn Jernside',
    ];

    const promises = vikings.map((name) => sendVikingToValhalla({ name }));

    const [result, err] = await errorist.try(() => Promise.all(promises));
}
```

### But you can also go the standard way:

```javascript
--- someError.js 

const SomeError = Errorist.extend({
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

```javascript
const data = { ... }; /* some useful data that would help debugging */;
try {
    // some error is thrown!
} catch (e) {
    throw Errorist.wrap(e).with(data);
}

```
