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
      } catch (e: unknown) {
        expect(e.data).toStrictEqual(data);
      }
    });
  });

  describe('searchCause()', () => {
    it('should find and return the cause if error search is a string and the message matches accordingly', () => {
      const errorSearch = 'something failed';
      const causes = [
        new Error(errorSearch),
      ];

      const cause = Errorist.searchCause(errorSearch, causes);

      expect(cause).toStrictEqual(causes[0]);
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

  describe('getFullStack()', () => {
    it('should print the full stack with causes', () => {
      const SomeError = Errorist.extend({
        defaultParams: {
          code: 'some-error-code',
          message: 'some human readable message',
        },
      });

      const AnotherError = Errorist.extend({
        defaultParams: {
          name: 'AnotherError',
          code: 'another-error-code',
          message: 'another human readable message',
        },
      });

      const nestedAnotherError = AnotherError.create({
        causes: AnotherError.create(),
      });

      const anotherError = AnotherError.create({
        causes: nestedAnotherError,
      });

      const sampleError = SomeError.create({
        data: {
          someField: 'some value',
          someOtherField: 'some other value',
        },
        causes: [
          anotherError,
          anotherError,
          anotherError,
        ],
      });

      const fullStack = sampleError.getFullStackTrace();

      expect(fullStack).toContain(sampleError.stack);
      expect(fullStack).toContain(anotherError.stack);
    });
  });

  describe('withData()', () => {
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
        throw new SampleError().withData(data);
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
        throw new SampleError().withData(data).withData(data);
      } catch (e: any) {
        expect(e.data).toStrictEqual(data);
      }
    });
  });
});
