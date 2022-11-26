// eslint-disable-next-line max-classes-per-file
import { EmptySearchError, WrapFalseyValueError } from '../errors';
import WithErrorNotAllowedError from '../errors/withErrorNotAllowed';
import type { ErrorSearch } from '../types';

const getNativeErrorCauses = (error?: Error | null): Error[] => {
  if (error instanceof AggregateError) {
    return error.errors;
  }
  if (error instanceof Error && error.cause) {
    return [error.cause];
  }
  return [];
};

export interface CustomErroristCreateParams {
  data?: object,
  error?: Error
  causes?: Error[] | Error
}

export interface ErroristExtendParams {
  parent?: Type<Errorist> | null,
  defaultParams: CustomErroristCreateParams & {
    name?: string,
    message: string,
    code: string,
  }
}

class Errorist extends Error {
  public code: string = '';

  public data: Optional<object> = {};

  public causes: Error[] = [];

  public constructor(message?: string) {
    super(message);

    Error.captureStackTrace(this, new.target);
    Object.setPrototypeOf(this, new.target.prototype);
  }

  static extend({ defaultParams }: ErroristExtendParams): typeof Errorist {
    return class CustomErrorist extends this {
      constructor(message?: string | undefined) {
        super(defaultParams.message || message);

        this.name = defaultParams.name || this.name;

        this.message = defaultParams.message;
        this.code = defaultParams.code;

        Error.captureStackTrace(this, new.target);
        Object.setPrototypeOf(this, new.target.prototype);
      }

      // eslint-disable-next-line class-methods-use-this
      withError(): this {
        throw new WithErrorNotAllowedError();
      }
    };
  }

  static create(params?: CustomErroristCreateParams): Errorist {
    const Clazz = this;
    const instance = new Clazz();

    if (!params) {
      return instance;
    }

    const { data, causes } = params;

    return instance.withData(data).withCauses(
      ...(Array.isArray(causes) ? causes : [causes]),
    );
  }

  static wrap(error: unknown): Errorist {
    if (!error) {
      throw new WrapFalseyValueError();
    }
    if (error instanceof Errorist) {
      return error;
    }
    if (error instanceof Error) {
      return new Errorist().withError(error);
    }
    if (typeof error === 'string' || typeof error === 'number') {
      const str = error.toString();
      return new Errorist(str).withCode(str);
    }
    if (typeof error === 'object') {
      return new Errorist().withData(error);
    }
    return new Errorist();
  }

  static searchCause(errorSearch: ErrorSearch, causes: Error[]): Error | null {
    for (let i = 0; i < causes.length; i += 1) {
      const cause = causes[i];

      if (typeof errorSearch === 'function' && cause instanceof errorSearch) {
        return cause;
      }

      if (cause instanceof Errorist) {
        return cause.is(errorSearch);
      }

      if (cause instanceof AggregateError) {
        return this.searchCause(errorSearch, cause.errors);
      }
    }
    return null;
  }

  isCausedBy(errorSearch: ErrorSearch): Error | null {
    return Errorist.searchCause(errorSearch, this.causes);
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

    return this.isCausedBy(errorSearch);
  }

  withCode(code: string) : this {
    this.code = code;
    return this;
  }

  withData(data?: Optional<object>): this {
    this.data = {
      ...this.data,
      ...(data || {}),
    };

    return this;
  }

  withError(error?: Error | null): this {
    this.name = error?.name ?? '';
    this.message = error?.message ?? '';
    this.stack = error?.stack ?? '';

    const causes = getNativeErrorCauses(error);

    return this.withCauses(...causes);
  }

  withCauses(...causes: Optional<Error>[]): this {
    this.causes = [
      ...this.causes,
      ...causes.filter((cause) => Boolean(cause)) as Error[],
    ];

    return this;
  }

  getFullStackTrace(depth: number = 1): string {
    if (this.causes.length === 0) {
      return this.stack ?? '';
    }

    const causesStack = `\nCaused by: [\n${this.causes.map((cause, index) => {
      const includeCauseFullStack = cause instanceof Errorist && depth > 0;
      const stack = includeCauseFullStack ? cause.getFullStackTrace(depth - 1) : cause.stack;

      return `#${index + 1}: ${stack}`;
    }).join('\n')}\n]`;

    return `${this.stack}${causesStack}`;
  }
}

export default Errorist;
