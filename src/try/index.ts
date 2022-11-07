import { DependencyContainer, WrapFunction } from '../types';

type ErrorWrapper = ReturnType<WrapFunction>;
type ResultOrErrorWrapper<R> = R | ErrorWrapper | null;

type TryReturnValue<R> = [ResultOrErrorWrapper<R>, ResultOrErrorWrapper<R>];

const createTryWrapperMethod = ({ wrap, config }: DependencyContainer) => {
  const { errorFirst } = config?.try || {};

  const swapAndWrap = <R>(result: Nullable<R>, error: Nullable<Error>): TryReturnValue<R> => (
    errorFirst ? [error ? wrap(error) : null, result]
      : [result, error ? wrap(error) : null]
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
