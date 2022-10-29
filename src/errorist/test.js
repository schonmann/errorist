import Errorist from '.';
import { WrapEmptyParameterError } from '../errors';

describe('Errorist', () => {
  describe('constructor()', () => {
    test('should create `SampleError`, extending both `Errorist` and `Error`', () => {
      const SampleError = Errorist.extend({
        code: 'sample-error-code',
        message: 'some human readable message',
      });

      const sampleError = new SampleError();

      expect(sampleError).toBeInstanceOf(Error);
      expect(sampleError).toBeInstanceOf(Errorist);
      expect(sampleError).toBeInstanceOf(SampleError);
    });

    test('should be `Error`, `Errorist`, `SampleError`', () => {
      const SampleError = Errorist.extend({
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

  describe('extend()', () => {
    test('should create `SampleError`, extending both `Errorist` and `Error`', () => {
      const SampleError = Errorist.extend({
        code: 'sample-error-code',
        message: 'some human readable message',
      });

      const sampleError = new SampleError();

      expect(sampleError).toBeInstanceOf(SampleError);
      expect(sampleError).toBeInstanceOf(Errorist);
      expect(sampleError).toBeInstanceOf(Error);
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
        code: 'sample-error-code',
        message: 'some human readable message',
      });

      const sampleError = new SampleError();

      expect(() => sampleError.is()).toThrow(WrapEmptyParameterError);
    });

    test('should throw if parameter is empty', () => {
      const SomeError = Errorist.extend({
        code: 'some-error-code',
        message: 'some human readable message',
      });

      const AnotherError = Errorist.extend({
        code: 'another-error-code',
        message: 'another human readable message',
      });

      const anotherError = new AnotherError({ causes: [new SomeError()] });

      expect(anotherError.is(SomeError)).toBeTruthy();
    });
  });

  describe('extend() + is()', () => {
    test('should create `FooError` and `BarError` both being neiher instance of each other nor `is` comparisons being truthy', () => {
      const FooError = Errorist.extend({
        code: 'sample-error-code',
        message: 'some human readable message',
      });

      const BarError = Errorist.extend({
        code: 'sample-error-code',
        message: 'some human readable message',
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
      const SampleError = Errorist.extend({
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
