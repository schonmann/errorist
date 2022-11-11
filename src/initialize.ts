import createTryWrapperMethod from './try';
import { ErroristLibrary } from './types';

const initializeErroristLibrary = () : ErroristLibrary => ({
  try: createTryWrapperMethod(),
});

export default initializeErroristLibrary;
