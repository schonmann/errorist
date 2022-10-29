const defaultConfig = {
  try: {
    errorFirst: false,
  },
};

const mergeConfigWithDefault = (config = {}) => ({
  try: {
    errorFirst: config?.try?.errorFirst ?? defaultConfig.try.errorFirst,
  },
});

export default mergeConfigWithDefault;
