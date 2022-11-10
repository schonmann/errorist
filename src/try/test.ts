import createTryWrapperMethod from '.';

describe('try()', () => {
  const tryFn = createTryWrapperMethod({
    config: {
      try: {
        errorFirst: false,
      },
    },
  });

  test('should return a `null` result plus an error when `fn` throws an exception', () => {
    const [result, error] = tryFn(() => {
      throw new Error('some thrown error');
    });

    if (!error) {
      // eslint-disable-next-line no-undef
      fail('an error should be returned!');
    }

    expect(result).toBeNull();
    expect(error.message).toStrictEqual('some thrown error');
  });

  test('should return a result plus a `null` error when `fn` returns a value', () => {
    const [result, error] = tryFn(() => 'some result');

    if (error) {
      // eslint-disable-next-line no-undef
      fail('an error should not be returned!');
    }

    expect(result).toStrictEqual('some result');
    expect(error).toBeNull();
  });

  test('should handle an asynchronous `fn` resolve and return a result gracefully', async () => {
    const [result, error] = await tryFn(async () => 'some result');

    if (error) {
      // eslint-disable-next-line no-undef
      fail('an error should not be returned!');
    }

    expect(result).toStrictEqual('some result');
    expect(error).toBeNull();
  });

  test('should handle an asynchronous `fn` reject and return an error gracefully', async () => {
    const [result, error] = await tryFn(async () => {
      throw new Error('on purpose errorist');
    });

    if (!error) {
      // eslint-disable-next-line no-undef
      fail('an error should be returned!');
    }

    expect(result).toBeNull();
    expect(error.message).toStrictEqual('on purpose errorist');
  });

  test('should swap return values when `errorFirst` is `true` on config', async () => {
    const customTry = createTryWrapperMethod({
      config: {
        try: {
          errorFirst: true,
        },
      },
    });

    const [error, result] = customTry(() => {
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
