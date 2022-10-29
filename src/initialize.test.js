import initializeErrorist from '.';

describe('initializeErrorist', () => {
  test('()', () => {
    const errorist = initializeErrorist();
    expect(errorist).toBeDefined();
  });
});
