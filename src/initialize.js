import mergeConfigWithDefault from './config';
import createTryWrapperMethod from './try';
import createWrapMethod from './wrap';

const initializeErrorist = ({ config: customConfig } = {}) => {
  const container = {
    config: mergeConfigWithDefault(customConfig),
  };

  const wrap = createWrapMethod(container);

  return {
    wrap,
    try: createTryWrapperMethod({ ...container, wrap }),
  };
};

export default initializeErrorist;
