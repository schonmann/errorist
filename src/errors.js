const errors = {
  wrap: {
    errorIsFalsey: new Error('the error to be wrapped cannot be a falsey value'),
  },
  is: {
    emptyParameter: new Error('the error class parameter cannot be empty'),
  },
  createErrorClass: {
    parentIsNotAnErroristSubclass: new Error('parent class is not an `Errorist` subclass'),
  },
};

export default errors;
