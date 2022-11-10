import mergeConfigWithDefault from './config';
import createTryWrapperMethod from './try';
import { Config } from './types';

const initializeErroristLibrary = (config : Config) => ({
  try: createTryWrapperMethod({
    config: mergeConfigWithDefault(config),
  }),
});

export default initializeErroristLibrary;
