export interface Config {
  try: {
    errorFirst: boolean,
  };
}

export type WrapFunction = (err: Error) => any;
export type ErrorSearch = Class<Error> | string;

export type ErrorWrapper = ReturnType<WrapFunction>;
export type ResultOrErrorWrapper<R> = R | ErrorWrapper | null;

export type TryReturnValue<R> = [ResultOrErrorWrapper<R>, ResultOrErrorWrapper<R>];

export interface DependencyContainer {
  config: Config,
}

export interface ErroristParams {
  data?: object,
  error?: Error
  cause?: Error
}
