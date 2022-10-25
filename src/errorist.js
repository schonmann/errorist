import errors from './errors';

class Errorist extends Error {
  static create(params) {
    const Clazz = this;
    return new Clazz(params);
  }

  /**
   * Perform a Depth-First Search (DFS) to find the first matching cause in the error tree.
   * @param {Array<Error>} cause
   * @param {Object} errorClass
   * @returns
   */
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
    return false;
  }

  searchCause(errorClass) {
    return Errorist.searchCause(this.causes, errorClass);
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
    return this instanceof errorClass || this.isCausedBy(this.causes, errorClass);
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
    message, code, data, name, causes,
  } = {}) {
    super(message);

    this.message = message;
    this.code = code;
    this.data = data;
    this.name = name;
    this.causes = causes;
  }
}

export default Errorist;
