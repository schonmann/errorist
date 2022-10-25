class WrapEmptyParameterError extends Error {
  constructor() {
    super('the error class parameter cannot be empty');
  }
}

export default WrapEmptyParameterError;
