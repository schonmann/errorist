import Errorist from '../errorist';
import {
  DependencyContainer,
  TryReturnValue,
} from '../types';

const createTryWrapperMethod = ({ config }: DependencyContainer) => {
  const { errorFirst } = config?.try || {};

  const swapAndWrap = <R>(result: Nullable<R>, error: Nullable<Error>): TryReturnValue<R> => (
    errorFirst ? [error ? Errorist.wrap(error) : null, result]
      : [result, error ? Errorist.wrap(error) : null]
  );

  const tryAsync = async <R>(fn: () => Promise<R>): Promise<TryReturnValue<R>> => {
    try {
      const result = await fn();

      return swapAndWrap<R>(result, null);
    } catch (error) {
      return swapAndWrap<R>(null, error as Error);
    }
  };

  const tryWrapper = (fn: SyncFunction): any => {
    try {
      const result = fn();
      if (result instanceof Promise) {
        return tryAsync(() => result);
      }
      return swapAndWrap(result, null);
    } catch (error) {
      if (error instanceof Error) {
        return swapAndWrap(null, error as Error);
      }
      throw error;
    }
  };

  return tryWrapper;
};

export default createTryWrapperMethod;
