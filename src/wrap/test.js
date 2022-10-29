import createWrapMethod from '.';
import Errorist from '../errorist';
import { WrapFalseyValueError } from '../errors';

describe('wrap()', () => {
  const wrap = createWrapMethod();

  test('should wrap the `Error` instance to an `Errorist`', () => {
    const someNativeError = new Error('im a native error');

    const wrappedError = wrap(someNativeError);

    expect(wrappedError).toBeInstanceOf(Errorist);
  });

  test('should throw an error when `error` parameter is a falsey value', () => {
    expect(() => wrap()).toThrow(WrapFalseyValueError);
  });
});
