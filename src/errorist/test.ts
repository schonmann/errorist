import Errorist from '.';
import { EmptySearchError, WrapFalseyValueError } from '../errors';

describe('Errorist', () => {
  describe('constructor()', () => {
    it('should create `SampleError`, extending both `Errorist` and `Error`', () => {
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

    it('should be `Error`, `Errorist`, `SampleError` and include the specified `data`', () => {
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
        throw SampleError.create({ data });
      } catch (e: any) {
        expect(e.data).toStrictEqual(data);
      }
    });
  });

  describe('extend()', () => {
    it('should create `SampleError`, extending both `Errorist` and `Error`', () => {
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
    it('should wrap the `Error` instance to an `Errorist`', () => {
      const someNativeError = new Error('im a native error');

      const wrappedError = Errorist.wrap(someNativeError);

      expect(wrappedError).toBeInstanceOf(Errorist);
    });

    it('should throw an error when `error` parameter is a falsey value', () => {
      expect(() => Errorist.wrap(null)).toThrow(WrapFalseyValueError);
    });
  });

  describe('is()', () => {
    it('should be `Error`, `Errorist`, `SampleError`', () => {
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

    it('should throw if parameter is empty', () => {
      const SampleError = Errorist.extend({
        defaultParams: {
          code: 'sample-error-code',
          message: 'some human readable message',
        },
      });

      const sampleError = new SampleError();

      expect(() => sampleError.is(null)).toThrow(EmptySearchError);
    });

    it('should throw if parameter is empty', () => {
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
    it('should create `FooError` and `BarError` both being neiher instance of each other nor `is` comparisons being truthy', () => {
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
    it('should include the keys specified in `data` on the error', () => {
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

    it('subsequent calls should be idempotent', () => {
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
