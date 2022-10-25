import errors from './errors';

class Errorist extends Error {
  constructor({
    message, code, data, name, causes,
  } = {}) {
    super(message);

    this.message = message;
    this.code = code;
    this.data = data;
    this.name = name;
    this.causes = causes;
  }

  static create(params) {
    const Class = this;
    return new Class(params);
  }

  static searchCause(causes, errorClass) {
    for (let i = 0; i < causes.length; i += 1) {
      const cause = causes[i];

      if (cause instanceof errorClass || cause === errorClass) {
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

  searchCause(errorClass) {
    return Errorist.searchCause(this.causes, errorClass);
  }

  is(errorClass) {
    if (!errorClass) {
      throw errors.is.emptyParameter;
    }
    return this instanceof errorClass || this.searchCause(errorClass);
  }

  with(data) {
    this.data = data;
    return this;
  }
}

export default Errorist;
