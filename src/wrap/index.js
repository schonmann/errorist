import Errorist from '../errorist';
import { WrapFalseyValueError } from '../errors';

const createWrapMethod = () => {
  const getErrorCauses = (error) => {
    if (error instanceof AggregateError) {
      return error.errors;
    }
    if (error instanceof Error) {
      return [error.cause];
    }
    return null;
  };

  const mapPropertiesFromNativeError = ({ message, stack }) => ({
    message,
    stack,
  });

  return (error) => {
    if (!error) {
      throw new WrapFalseyValueError();
    }
    if (error instanceof Errorist) {
      return error;
    }
    return new Errorist({
      causes: getErrorCauses(error),
      ...mapPropertiesFromNativeError(error),
    });
  };
};

export default createWrapMethod;
