import Errorist, { errors, createErrorClass, wrap } from './index';

describe('Errorist API', () => {
  const createSampleErrorClass = () => createErrorClass({
    code: 'sample-error-code',
    message: 'some human readable message',
  });

  describe('createErrorClass()', () => {
    test('should create `SampleError`, extending both `Errorist` and `Error`', () => {
      const SampleError = createSampleErrorClass();

      const sampleError = new SampleError();

      expect(sampleError).toBeInstanceOf(SampleError);
      expect(sampleError).toBeInstanceOf(Errorist);
      expect(sampleError).toBeInstanceOf(Error);
    });

    test('should create `SampleError`, extending from the specified `parentClass`', () => {});

    test('should throw an error when `parentClass` is not an `Erorrist` subclass', () => {
      expect(() => {
        createErrorClass({
          parent: Number, // or any other
          defaultParams: {
            code: 'sample-error-code',
            message: 'some human readable message',
          },
        });
      }).toThrow(errors.createErrorClass.parentIsNotAnErroristSubclass);
    });
  });

  describe('wrap()', () => {
    test('should wrap the `Error` instance to an `Errorist`', () => {
      const someNativeError = new Error('im a native error');

      const wrappedError = wrap(someNativeError);

      expect(wrappedError).toBeInstanceOf(Errorist);
    });

    test('should throw an error when `error` parameter is a falsey value', () => {
      expect(() => wrap()).toThrow(errors.wrap.errorIsFalsey);
    });
  });

  describe('Errorist', () => {
    describe('constructor()', () => {
      test('should create `SampleError`, extending both `Errorist` and `Error`', () => {
        const SampleError = createErrorClass({
          code: 'sample-error-code',
          message: 'some human readable message',
        });

        const sampleError = new SampleError();

        expect(sampleError).toBeInstanceOf(Error);
        expect(sampleError).toBeInstanceOf(Errorist);
        expect(sampleError).toBeInstanceOf(SampleError);
      });

      test('should be `Error`, `Errorist`, `SampleError`', () => {
        const SampleError = createErrorClass({
          code: 'sample-error-code',
          message: 'some human readable message',
        });

        const data = {
          someField: 'some value',
          someOtherField: 'some other value',
        };

        try {
          throw new SampleError({ data });
        } catch (e) {
          expect(e.data).toBe(data);
        }
      });
    });
    describe('is()', () => {
      test('should be `Error`, `Errorist`, `SampleError`', () => {
        const SampleError = createErrorClass({
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
        const SampleError = createErrorClass({
          code: 'sample-error-code',
          message: 'some human readable message',
        });

        const sampleError = new SampleError();

        expect(() => sampleError.is()).toThrow(errors.is.emptyParameter);
      });
    });

    describe('with()', () => {
      test('should include the keys specified in `data` on the error', () => {
        const SampleError = createErrorClass({
          code: 'sample-error-code',
          message: 'some human readable message',
        });

        const data = {
          someField: 'some value',
          someOtherField: 'some other value',
        };

        try {
          throw new SampleError().with(data);
        } catch (e) {
          expect(e.data).toBe(data);
        }
      });

      test('subsequent calls should be idempotent', () => {
        const SampleError = createErrorClass({
          code: 'sample-error-code',
          message: 'some human readable message',
        });

        const FooError = createErrorClass({
          code: 'foo-error-code',
          message: 'some human readable message',
        });

        expect(SampleError.create).toBeDefined();
        expect(SampleError.create()).toBeInstanceOf(SampleError);
        expect(SampleError.create()).not.toBeInstanceOf(FooError);

        const data = {
          someField: 'some value',
          someOtherField: 'some other value',
        };

        try {
          throw new SampleError().with(data).with(data);
        } catch (e) {
          expect(e.data).toBe(data);
        }
      });
    });
  });
});

describe('<customErrorClass>.create()', () => {});
