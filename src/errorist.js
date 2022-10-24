import errors from './errors';

class Errorist extends Error {
  static create(params) {
    const Clazz = this;
    return new Clazz(params);
  }

  isCausedBy(clazz) {
    return this.causes.find((cause) => {
      if (cause instanceof clazz) {
        return cause;
      }
      return cause instanceof Errorist && cause.isCausedBy(clazz);
    });
  }

  /**
   * Checks if the instance is:
   * - An instance of `errorClass`, or:
   * - Caused by an error that is an instance of `errorClass`
   * @param {Object} errorClass
   * @returns
   */
  is(errorClass) {
    if (!errorClass) {
      throw errors.is.emptyParameter;
    }
    return (this instanceof errorClass && this) || this.isCausedBy(errorClass);
  }

  /**
   * Patches the error with related data.
   * @param {Object} data
   * @returns {Errorist}
   */
  with(data) {
    this.data = data;
    return this;
  }

  constructor({
    causes, code, message, name, data, cause,
  } = {}) {
    super(message, { cause });

    this.causes = causes;
    this.code = code;
    this.message = message;
    this.data = data;
    this.name = name;
  }
}

export default Errorist;
