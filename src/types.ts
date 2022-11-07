export interface Config {
  try: {
    errorFirst: boolean,
  };
}

export type WrapFunction = (err: Error) => any;
export type ErrorSearch = Class<Error> | string;

export interface DependencyContainer {
  wrap: Function,
  config: Config,
}

export interface ErroristParams {
  data?: object,
  error?: Error
  cause?: Error
}
