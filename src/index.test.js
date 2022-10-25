import { WrapEmptyParameterError } from './errors';
import Errorist, { errorist } from './index';

describe('Errorist', () => {
  describe('constructor()', () => {
    test('should create `SampleError`, extending both `Errorist` and `Error`', () => {
      const SampleError = errorist.createErrorClass({
        code: 'sample-error-code',
        message: 'some human readable message',
      });

      const sampleError = new SampleError();

      expect(sampleError).toBeInstanceOf(Error);
      expect(sampleError).toBeInstanceOf(Errorist);
      expect(sampleError).toBeInstanceOf(SampleError);
    });

    test('should be `Error`, `Errorist`, `SampleError`', () => {
      const SampleError = errorist.createErrorClass({
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
      const SampleError = errorist.createErrorClass({
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
      const SampleError = errorist.createErrorClass({
        code: 'sample-error-code',
        message: 'some human readable message',
      });

      const sampleError = new SampleError();

      expect(() => sampleError.is()).toThrow(WrapEmptyParameterError);
    });

    test('should throw if parameter is empty', () => {
      const SomeError = errorist.createErrorClass({
        code: 'some-error-code',
        message: 'some human readable message',
      });

      const AnotherError = errorist.createErrorClass({
        code: 'another-error-code',
        message: 'another human readable message',
      });

      const anotherError = new AnotherError({ causes: [new SomeError()] });

      expect(anotherError.is(SomeError)).toBeTruthy();
    });
  });

  describe('with()', () => {
    test('should include the keys specified in `data` on the error', () => {
      const SampleError = errorist.createErrorClass({
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
      const SampleError = errorist.createErrorClass({
        code: 'sample-error-code',
        message: 'some human readable message',
      });

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
