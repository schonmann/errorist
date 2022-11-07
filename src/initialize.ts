import mergeConfigWithDefault from './config';
import createTryWrapperMethod from './try';
import { Config, DependencyContainer } from './types';

const initializeErroristLibrary = (config : Config) => ({
  try: createTryWrapperMethod({
    config: mergeConfigWithDefault(config),
  } as DependencyContainer),
});

export default initializeErroristLibrary;
