class WithErrorNotAllowedError extends Error {
  constructor() {
    super('calls to `withError` are not allowed on errorist subclass instances');
  }
}

export default WithErrorNotAllowedError;
