import createTryWrapperMethod from '.';

describe('try()', () => {
  const tryFn = createTryWrapperMethod();

  it('should return a `null` result plus an error when `fn` throws an exception', () => {
    const [error, result] = tryFn(() : string => {
      throw new Error('some thrown error');
      return 'i will never be reached :)';
    });

    if (!error) {
      // eslint-disable-next-line no-undef
      fail('an error should be returned!');
    }

    expect(result).toBeNull();
    expect(error.message).toStrictEqual('some thrown error');
  });

  it('should return a result plus a `null` error when `fn` returns a value', () => {
    const [error, result] = tryFn(() : string => 'some result');

    if (error) {
      // eslint-disable-next-line no-undef
      fail('an error should not be returned!');
    }

    expect(result).toStrictEqual('some result');
    expect(error).toBeNull();
  });

  it('should handle an asynchronous `fn` resolve and return a result gracefully', async () => {
    const [error, result] = await tryFn(async () : Promise<string> => 'some result');

    if (error) {
      // eslint-disable-next-line no-undef
      fail('an error should not be returned!');
    }

    expect(result).toStrictEqual('some result');
    expect(error).toBeNull();
  });

  it('should handle an asynchronous `fn` reject and return an error gracefully', async () => {
    const [error, result] = await tryFn(async () => {
      throw new Error('on purpose errorist');
    });

    if (!error) {
      // eslint-disable-next-line no-undef
      fail('an error should be returned!');
    }

    expect(result).toBeNull();
    expect(error.message).toStrictEqual('on purpose errorist');
  });
});
