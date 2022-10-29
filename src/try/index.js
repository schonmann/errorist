const createTryWrapperMethod = ({ wrap, config }) => {
  const swapAndWrap = (result, error) => (config?.try?.errorFirst
    ? [error ? wrap(error) : null, result]
    : [result, error ? wrap(error) : null]);

  const tryAsync = async (fn) => {
    try {
      const result = await fn();
      return swapAndWrap(result, null);
    } catch (error) {
      return swapAndWrap(null, error);
    }
  };

  const tryWrapper = (fn) => {
    try {
      const result = fn();
      if (result instanceof Promise) {
        return tryAsync(() => result);
      }
      return swapAndWrap(result, null);
    } catch (error) {
      return swapAndWrap(null, error);
    }
  };

  return tryWrapper;
};

export default createTryWrapperMethod;
