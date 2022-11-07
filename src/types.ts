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

// {
//   message?: Optional<string>,
//   code?: Optional<string>,
//   data?: Optional<object>,
//   causes?: Array<typeof Error> | typeof Error,
// }

export interface RepresentationOptions {
  representation?: 'complete' | 'date' | 'time'
}

export type Era = 0 | 1;

export type Quarter = 1 | 2 | 3 | 4;

export type Day = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type Month = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

export type FirstWeekContainsDate = 1 | 4;

export interface DateValues {
  year?: number
  month?: number
  date?: number
  hours?: number
  minutes?: number
  seconds?: number
  milliseconds?: number
}

export type RoundingMethod = 'ceil' | 'floor' | 'round' | 'trunc';

export interface RoundingOptions {
  roundingMethod?: RoundingMethod
}

export type Unit =
  | 'second'
  | 'minute'
  | 'hour'
  | 'day'
  | 'dayOfYear'
  | 'date'
  | 'week'
  | 'month'
  | 'quarter'
  | 'year';

export type FormatDistanceStrictUnit =
  | 'second'
  | 'minute'
  | 'hour'
  | 'day'
  | 'month'
  | 'year';

export interface AdditionalTokensOptions {
  useAdditionalWeekYearTokens?: boolean
  useAdditionalDayOfYearTokens?: boolean
}

export type IntlOptionsUnit =
  | 'year'
  | 'quarter'
  | 'month'
  | 'week'
  | 'day'
  | 'hour'
  | 'minute'
  | 'second';
