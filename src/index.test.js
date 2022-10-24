import Errorist, { ErroristError } from '.';

describe('Errorist API', () => {
  const createSampleErrorClass = () => Errorist.createErrorClass({
    code: 'sample-error-code',
    message: 'some human readable message',
  });

  describe('createErrorClass()', () => {
    test('should createErrorClass a dynamic `SampleError` class, extending both `Errorist` and `Error` classes when constructor is called', () => {
      const SampleError = createSampleErrorClass();

      const sampleError = new SampleError();

      expect(sampleError).toBeInstanceOf(SampleError);
      expect(sampleError).toBeInstanceOf(ErroristError);
      expect(sampleError).toBeInstanceOf(Error);
    });
  });

  describe('wrap()', () => {
    test('should wrap the `Error` instance to an `ErroristError`', () => {
      const someNativeError = new Error('im a native error');

      const wrappedError = Errorist.wrap(someNativeError);

      expect(wrappedError).toBeInstanceOf(ErroristError);
    });

    test('should throw an error when `error` parameter is a falsey value', () => {
      expect(() => Errorist.wrap()).toThrow(Errorist.errors.wrap.errorIsFalsey);
    });
  });

  describe('Errorist', () => {
    describe('constructor()', () => {
      test('should create a dynamic `SampleError` class, extending both `Errorist` and `Error` classes when constructor is called', () => {
        const SampleError = Errorist.createErrorClass({
          code: 'sample-error-code',
          message: 'some human readable message',
        });

        const sampleError = new SampleError();

        expect(sampleError).toBeInstanceOf(Error);
        expect(sampleError).toBeInstanceOf(ErroristError);
        expect(sampleError).toBeInstanceOf(SampleError);
      });

      test('should be `Error`, `ErroristError`, `SampleError`', () => {
        const SampleError = Errorist.createErrorClass({
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
      test('should be `Error`, `ErroristError`, `SampleError`', () => {
        const SampleError = Errorist.createErrorClass({
          code: 'sample-error-code',
          message: 'some human readable message',
        });

        const sampleError = new SampleError();

        expect(sampleError.is(Error)).toBeTruthy();
        expect(sampleError.is(ErroristError)).toBeTruthy();
        expect(sampleError.is(SampleError)).toBeTruthy();
      });

      test('should throw if parameter is empty', () => {
        const SampleError = Errorist.createErrorClass({
          code: 'sample-error-code',
          message: 'some human readable message',
        });

        const sampleError = new SampleError();

        expect(() => sampleError.is()).toThrow(Errorist.errors.is.emptyParameter);
      });
    });

    describe('with()', () => {
      test('should include the keys specified in `data` on the error', () => {
        const SampleError = Errorist.createErrorClass({
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
        const SampleError = Errorist.createErrorClass({
          code: 'sample-error-code',
          message: 'some human readable message',
        });

        const FooError = Errorist.createErrorClass({
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

describe('<customErrorClass>.create()', () => {

});
