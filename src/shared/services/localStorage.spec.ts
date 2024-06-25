import { clearLocalStorage, saveCurrentStateToLocalStorage } from './localStorage.ts';

/**
 * @vitest-environment jsdom
 */

describe('Checking Local Storage', () => {
  it('{} should return {}', () => {
    expect(saveCurrentStateToLocalStorage({})).toStrictEqual({});
  });

  it('clearLocalStorage should return {}', () => {
    expect(clearLocalStorage()).toStrictEqual({});
  });
});
