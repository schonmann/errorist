import initializeErrorist from '.';

describe('initializeErrorist', () => {
  it('should return a defined instance of `initializeErrorist`', () => {
    const errorist = initializeErrorist();
    expect(errorist).toBeDefined();
  });
});
