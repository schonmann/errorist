import Errorist from './errorist';
import errors, { ParentIsNotAnErroristSubclassError, WrapFalseyValueError } from './errors';

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
    throw new WrapFalseyValueError();
  }
  if (error instanceof Errorist) {
    return error;
  }
  return new Errorist({
    ...error,
    causes: getErrorCauses(error),
  });
};

const createErrorClass = ({ parent: Parent = Errorist, defaultParams }) => {
  const isErroristOrSubclass = Parent.prototype instanceof Errorist || Parent === Errorist;
  if (!isErroristOrSubclass) {
    throw new ParentIsNotAnErroristSubclassError();
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

const normalizePromiseResult = async (promiseResult) => promiseResult
  .then((result) => Promise.resolve([result, null]))
  .catch((error) => Promise.resolve([null, wrap(error)]));

const tryHelper = (fn) => {
  try {
    const result = fn();
    if (result instanceof Promise) {
      return normalizePromiseResult(result);
    }
    return [result, null];
  } catch (error) {
    return [null, wrap(error)];
  }
};

export const errorist = {
  errors,
  createErrorClass,
  wrap,
  try: tryHelper,
};

export default Errorist;
