class WrapFalseyValueError extends Error {
  constructor() {
    super('the error to be wrapped cannot be a falsey value');
  }
}

export default WrapFalseyValueError;
