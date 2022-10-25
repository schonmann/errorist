import Errorist from './errorist';
import errors from './errors';

const getErrorCauses = (error) => {
  if (error instanceof AggregateError) {
    return error.errors;
  }
  if (error instanceof Error) {
    return [error.cause];
  }
  return null;
};

const wrap = (error) => {
  if (!error) {
    throw errors.wrap.errorIsFalsey;
  }
  if (error instanceof Errorist) {
    return error;
  }
  return new Errorist({
    ...error,
    causes: getErrorCauses(error),
  });
};

/**
 *
 * @param {Object} params
 * @returns {CustomErroristError}
 */
const createErrorClass = ({
  parent: Parent = Errorist,
  defaultParams,
}) => {
  const isErrorist = Parent.prototype instanceof Errorist || Parent === Errorist;
  if (!isErrorist) {
    throw errors.createErrorClass.parentIsNotAnErroristSubclass;
  }

  return class CustomErroristError extends Parent {
    constructor(params) {
      super({
        ...defaultParams,
        ...params,
      });

      Error.captureStackTrace(this, CustomErroristError);
    }
  };
};

export { errors, createErrorClass, wrap };

export default Errorist;
