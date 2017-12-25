import store from './store.js';

describe('store.js', () => {
  it('should be able to dispatch / subscribe', () => {
    expect(store.dispatch).toBeTruthy();
    expect(store.subscribe).toBeTruthy();
  });

  it('should have init state', () => {
    expect(store.getState()).toEqual({ topics: [] });
  });
});
