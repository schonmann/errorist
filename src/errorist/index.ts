// eslint-disable-next-line max-classes-per-file
import { EmptySearchError, WrapFalseyValueError } from '../errors';
import {
  ErroristParams, ErrorSearch,
} from '../types';

interface ErroristExtendParams {
  parent?: Class<Errorist> | null,
  defaultParams: ErroristParams & {
    name?: string,
    message: string,
    code: string,
  }
}

const getNativeErrorCauses = (error?: Error | null): Error[] => {
  if (error instanceof AggregateError) {
    return error.errors;
  }
  if (error instanceof Error && error.cause) {
    return [error.cause];
  }
  return [];
};

class Errorist extends Error {
  code: string = '';

  data: Optional<object> = {};

  causes: Error[] = [];

  constructor(message?: string) {
    super(message);

    Error.captureStackTrace(this, new.target);
    Object.setPrototypeOf(this, new.target.prototype);
  }

  static searchCauses(causes: Error[], errorSearch: ErrorSearch): Error | null {
    for (let i = 0; i < causes.length; i += 1) {
      const cause = causes[i];

      if (typeof errorSearch === 'function' && cause instanceof errorSearch) {
        return cause;
      }

      if (cause instanceof Errorist) {
        return cause.is(errorSearch);
      }

      if (cause instanceof AggregateError) {
        return this.searchCauses(cause.errors, errorSearch);
      }
    }
    return null;
  }

  static extend({ defaultParams }: ErroristExtendParams) {
    return class CustomErrorist extends this {
      constructor(message?: string | undefined) {
        super(defaultParams.message || message);

        this.name = defaultParams.name || this.name;

        this.message = defaultParams.message;
        this.code = defaultParams.code;

        Error.captureStackTrace(this, new.target);
        Object.setPrototypeOf(this, new.target.prototype);
      }
    };
  }

  static create({ data, cause, error }: ErroristParams): Errorist {
    const Clazz = this;
    const instance = new Clazz();

    return instance.with(data).withError(error).withCauses(cause);
  }

  static wrap(error: Error): Errorist {
    if (!error) {
      throw new WrapFalseyValueError();
    }
    const Clazz = this;
    if (error instanceof Clazz) {
      return error;
    }
    return Clazz.create({ error });
  }

  searchCauses(errorSearch: ErrorSearch): Error | null {
    return Errorist.searchCauses(this.causes, errorSearch);
  }

  is(errorSearch: ErrorSearch): Error | null {
    if (!errorSearch) {
      throw new EmptySearchError();
    }

    if (typeof errorSearch === 'function' && this instanceof errorSearch) {
      return this;
    }

    if (typeof errorSearch === 'string' && [this.message, this.code].includes(errorSearch)) {
      return this;
    }

    return this.searchCauses(errorSearch);
  }

  withError(error?: Error | null): this {
    this.name = error?.name ?? '';
    this.message = error?.message ?? '';
    this.stack = error?.stack ?? '';

    const causes = getNativeErrorCauses(error);

    return this.withCauses(...causes);
  }

  with(data?: Optional<object>): this {
    this.data = {
      ...this.data,
      ...(data || {}),
    };

    return this;
  }

  withCauses(...causes: Optional<Error>[]): this {
    this.causes = [
      ...this.causes,
      ...causes.filter((cause) => Boolean(cause)) as Error[],
    ];

    return this;
  }

  formatCauses(causes: Error[]): string {
    return causes.map(({ stack }, index) => `#${index + 1}: ${stack}`).join('\t');
  }

  getFullStack(): string {
    const causesStack = this.causes.length > 0 ? `\nCaused by: \n${this.formatCauses(this.causes)}` : '';
    return `${this.stack}${causesStack}`;
  }
}

export default Errorist;
