import initializeErrorist from '.';
import { Config } from './types';

describe('initializeErrorist', () => {
  test('()', () => {
    const errorist = initializeErrorist({} as Config);
    expect(errorist).toBeDefined();
  });
});
