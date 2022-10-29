/* eslint-disable max-classes-per-file */
import { WrapEmptyParameterError } from '../errors';

class Errorist extends Error {
  constructor({
    message, code, data, name, causes,
  } = {}) {
    super(message);

    this.message = message;
    this.code = code;
    this.data = data;
    this.name = name;
    this.withCauses(causes);
  }

  static searchCause(causes, errorClass) {
    for (let i = 0; i < causes.length; i += 1) {
      const cause = causes[i];

      if (cause instanceof errorClass) {
        return cause;
      }
      if (cause instanceof Errorist) {
        return cause.searchCause(errorClass);
      }
      if (cause instanceof AggregateError) {
        return this.searchCause(cause.errors, errorClass);
      }
    }
    return null;
  }

  static extend({ defaultParams }) {
    return class CustomErroristError extends this {
      constructor(params) {
        super({
          ...defaultParams,
          ...params,
        });

        Error.captureStackTrace(this, CustomErroristError);
      }
    };
  }

  searchCause(errorClass) {
    return Errorist.searchCause(this.causes, errorClass);
  }

  is(errorClass) {
    if (!errorClass) {
      throw new WrapEmptyParameterError();
    }
    return this instanceof errorClass || this.searchCause(errorClass);
  }

  with(data) {
    this.data = data;
    return this;
  }

  withCauses(causes) {
    this.causes = Array.isArray(causes) ? causes : [causes];
    return this;
  }
}

export default Errorist;
