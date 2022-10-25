class ParentIsNotAnErroristSubclassError extends Error {
  constructor() {
    super('parent class is not an `Errorist` subclass');
  }
}

export default ParentIsNotAnErroristSubclassError;
