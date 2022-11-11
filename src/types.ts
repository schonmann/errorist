import type Errorist from './errorist';

export interface Config {
  try: {
    errorFirst: boolean,
  };
}

export type ErrorSearch = Type<Error> | string;

export type SwapAndWrapReturnType<R> = [Nullable<Errorist>, Nullable<R>];

export type TryFunction<R> = (...args: any) => R;

export type TryWrapper = <R> (fn : TryFunction<R>) => R extends Promise<infer K>
  ? Promise<SwapAndWrapReturnType<K>> : SwapAndWrapReturnType<R>;

export interface ErroristLibrary {
  try: TryWrapper
}
