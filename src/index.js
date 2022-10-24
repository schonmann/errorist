import ErroristError from './errorist';
import errors from './errors';

Error.stackTraceLimit = Infinity;

export { ErroristError };

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
  if (error instanceof ErroristError) {
    return error;
  }
  return new ErroristError({
    causes: getErrorCauses(error),
    message: error.message,
    code: error.code,
  });
};

/**
 *
 * @param {Object} params
 * @param {String} [params.message] the error message.
 * @param {String} [params.code] an unique code for the error.
 * @returns {CustomErroristError}
 */
const createErrorClass = ({
  message, code, name,
}) => class CustomErroristError extends ErroristError {
  constructor(params) {
    super({
      message,
      code,
      name,
      ...params,
    });

    Error.captureStackTrace(this, CustomErroristError);
  }
};

export default {
  errors,

  createErrorClass,
  wrap,
};
