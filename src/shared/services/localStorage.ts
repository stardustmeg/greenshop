import stringifyToSave from './helper.ts';

export const STORAGE_KEY = '3a981d01-2a98-4e10-8869-8b5839202195';

export function saveCurrentStateToLocalStorage<S>(state: S): S {
  localStorage.setItem(STORAGE_KEY, stringifyToSave<S>(state));
  return state;
}

export function clearLocalStorage(): Record<string, unknown> {
  localStorage.removeItem(STORAGE_KEY);
  return {};
}
