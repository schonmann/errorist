import Errorist from '.';
import { EmptySearchError, WrapFalseyValueError } from '../errors';
import { ErroristParams } from '../types';

describe('Errorist', () => {
  describe('constructor()', () => {
    test('should create `SampleError`, extending both `Errorist` and `Error`', () => {
      const SampleError = Errorist.extend({
        defaultParams: {
          code: 'sample-error-code',
          message: 'some human readable message',
        },
      });

      const sampleError = new SampleError();

      expect(sampleError).toBeInstanceOf(Error);
      expect(sampleError).toBeInstanceOf(Errorist);
      expect(sampleError).toBeInstanceOf(SampleError);
    });

    test('should be `Error`, `Errorist`, `SampleError` and include the specified `data`', () => {
      const SampleError = Errorist.extend({
        defaultParams: {
          code: 'sample-error-code',
          message: 'some human readable message',
        },
      });

      const data = {
        someField: 'some value',
        someOtherField: 'some other value',
      };

      try {
        throw SampleError.create({ data } as ErroristParams);
      } catch (e: any) {
        expect(e.data).toStrictEqual(data);
      }
    });
  });

  describe('extend()', () => {
    test('should create `SampleError`, extending both `Errorist` and `Error`', () => {
      const SampleError = Errorist.extend({
        defaultParams: {
          code: 'sample-error-code',
          message: 'some human readable message',
        },
      });

      const sampleError = new SampleError();

      expect(sampleError).toBeInstanceOf(SampleError);
      expect(sampleError).toBeInstanceOf(Errorist);
      expect(sampleError).toBeInstanceOf(Error);
    });
  });

  describe('wrap()', () => {
    test('should wrap the `Error` instance to an `Errorist`', () => {
      const someNativeError = new Error('im a native error');

      const wrappedError = Errorist.wrap(someNativeError);

      expect(wrappedError).toBeInstanceOf(Errorist);
    });

    test('should throw an error when `error` parameter is a falsey value', () => {
      expect(() => Errorist.wrap(null)).toThrow(WrapFalseyValueError);
    });
  });

  describe('is()', () => {
    test('should be `Error`, `Errorist`, `SampleError`', () => {
      const SampleError = Errorist.extend({
        parent: Errorist,
        defaultParams: {
          code: 'sample-error-code',
          message: 'some human readable message',
        },
      });

      const sampleError = new SampleError();

      expect(sampleError.is(Error)).toBeTruthy();
      expect(sampleError.is(Errorist)).toBeTruthy();
      expect(sampleError.is(SampleError)).toBeTruthy();
    });

    test('should throw if parameter is empty', () => {
      const SampleError = Errorist.extend({
        defaultParams: {
          code: 'sample-error-code',
          message: 'some human readable message',
        },
      });

      const sampleError = new SampleError();

      expect(() => sampleError.is(null)).toThrow(EmptySearchError);
    });

    test('should throw if parameter is empty', () => {
      const SomeError = Errorist.extend({
        defaultParams: {
          name: 'SomeError',
          code: 'some-error-code',
          message: 'some human readable message',
        },
      });

      const AnotherError = Errorist.extend({
        parent: SomeError,
        defaultParams: {
          name: 'AnotherError',
          code: 'another-error-code',
          message: 'another human readable message',
        },
      });

      const anotherError = new AnotherError().withCauses(new SomeError());

      expect(anotherError.is(SomeError)).toBeTruthy();
    });
  });

  describe('extend() + is()', () => {
    test('should create `FooError` and `BarError` both being neiher instance of each other nor `is` comparisons being truthy', () => {
      const FooError = Errorist.extend({
        defaultParams: {
          code: 'sample-error-code',
          message: 'some human readable message',
        },
      });

      const BarError = Errorist.extend({
        defaultParams: {
          code: 'sample-error-code',
          message: 'some human readable message',
        },
      });

      expect(FooError).not.toBeInstanceOf(BarError);
      expect(BarError).not.toBeInstanceOf(FooError);

      expect(new FooError().is(BarError)).not.toBeTruthy();
      expect(new BarError().is(FooError)).not.toBeTruthy();
    });
  });

  describe('with()', () => {
    test('should include the keys specified in `data` on the error', () => {
      const SampleError = Errorist.extend({
        defaultParams: {
          code: 'sample-error-code',
          message: 'some human readable message',
        },
      });

      const data = {
        someField: 'some value',
        someOtherField: 'some other value',
      };

      try {
        throw new SampleError().with(data);
      } catch (e) {
        expect((e as Errorist).data).toStrictEqual(data);
      }
    });

    test('subsequent calls should be idempotent', () => {
      const SampleError = Errorist.extend({
        defaultParams: {
          code: 'sample-error-code',
          message: 'some human readable message',
        },
      });

      const data = {
        someField: 'some value',
        someOtherField: 'some other value',
      };

      try {
        throw new SampleError().with(data).with(data);
      } catch (e: any) {
        expect(e.data).toStrictEqual(data);
      }
    });
  });
});
