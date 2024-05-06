import { clearLocalStorage, saveCurrentStateToLocalStorage } from './localStorage.ts';

describe('Checking Local Storage', () => {
  it('{} should return {}', () => {
    expect(saveCurrentStateToLocalStorage({})).toStrictEqual({});
  });

  it('clearLocalStorage should return {}', () => {
    expect(clearLocalStorage()).toStrictEqual({});
  });
});
