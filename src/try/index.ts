import Errorist from '../errorist';

export type ErrorAndResult<R> = [Nullable<Errorist>, Nullable<R>];

export type TryFunction<R> = (...args: any) => R;

export type TryWrapper = <R> (fn : TryFunction<R>) => R extends Promise<infer K>
  ? Promise<ErrorAndResult<K>> : ErrorAndResult<R>;

const createTryWrapperMethod = (): TryWrapper => {
  const prepareResult = <R>(result: Nullable<R>, error: Nullable<Error>): ErrorAndResult<R> => (
    [error ? Errorist.wrap(error) : null, result]
  );

  const tryAsync = async <R>(fn: TryFunction<R>): Promise<ReturnType<typeof prepareResult>> => {
    try {
      const result = await fn();

      return prepareResult<R>(result, null);
    } catch (error) {
      return prepareResult<R>(null, error as Errorist);
    }
  };

  const tryWrapper = <R>(fn: TryFunction<R>) => {
    try {
      const result = fn();
      if (result instanceof Promise) {
        return tryAsync(() => result);
      }
      return prepareResult(result, null);
    } catch (error) {
      if (error instanceof Error) {
        return prepareResult(null, error);
      }
      throw error;
    }
  };

  return tryWrapper as TryWrapper;
};

export default createTryWrapperMethod;
