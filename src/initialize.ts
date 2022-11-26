import createTryWrapperMethod, { TryWrapper } from './try';

export interface ErroristLibrary {
  try: TryWrapper
}

const initializeErroristLibrary = () : ErroristLibrary => ({
  try: createTryWrapperMethod(),
});

export default initializeErroristLibrary;
