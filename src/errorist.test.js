import Errorist, { errorist } from '.';
import {
  ParentIsNotAnErroristSubclassError,
  WrapFalseyValueError,
} from './errors';

describe('errorist', () => {
  describe('createErrorClass()', () => {
    test('should create `SampleError`, extending both `Errorist` and `Error`', () => {
      const SampleError = errorist.createErrorClass({
        code: 'sample-error-code',
        message: 'some human readable message',
      });

      const sampleError = new SampleError();

      expect(sampleError).toBeInstanceOf(SampleError);
      expect(sampleError).toBeInstanceOf(Errorist);
      expect(sampleError).toBeInstanceOf(Error);
    });

    test('should create `SampleError`, extending from the specified `parentClass`', () => {});

    test('should throw an error when `parentClass` is not an `Erorrist` subclass', () => {
      expect(() => {
        errorist.createErrorClass({
          parent: Number, // or any other
          defaultParams: {
            code: 'sample-error-code',
            message: 'some human readable message',
          },
        });
      }).toThrow(ParentIsNotAnErroristSubclassError);
    });
  });

  describe('wrap()', () => {
    test('should wrap the `Error` instance to an `Errorist`', () => {
      const someNativeError = new Error('im a native error');

      const wrappedError = errorist.wrap(someNativeError);

      expect(wrappedError).toBeInstanceOf(Errorist);
    });

    test('should throw an error when `error` parameter is a falsey value', () => {
      expect(() => errorist.wrap()).toThrow(WrapFalseyValueError);
    });
  });

  describe('try()', () => {
    test('should return a `null` result plus an error when `fn` throws an exception', () => {
      const [result, error] = errorist.try(() => {
        throw new Error('some error thrown');
      });

      if (!error) {
        // eslint-disable-next-line no-undef
        fail('an error should be returned!');
      }

      expect(result).toBeNull();
      expect(error.is(Error)).not.toBeNull();
    });

    test('should return a result plus a `null` error when `fn` returns a value', () => {
      const [result, error] = errorist.try(() => 'some result');

      if (error) {
        // eslint-disable-next-line no-undef
        fail('an error should not be returned!');
      }

      expect(result).toStrictEqual('some result');
      expect(error).toBeNull();
    });
  });
});
