import { Config } from '../types';

const defaultConfig : Config = {
  try: {
    errorFirst: false,
  },
};

const mergeConfigWithDefault = (config : Config) => ({
  try: {
    errorFirst: config?.try?.errorFirst ?? defaultConfig.try.errorFirst,
  },
});

export default mergeConfigWithDefault;
