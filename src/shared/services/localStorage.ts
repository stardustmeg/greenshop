export const STORAGE_KEY = '3a981d01-2a98-4e10-8869-8b5839202195';

export function saveCurrentStateToLocalStorage<S>(state: S): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function clearLocalStorage(): void {
  localStorage.removeItem(STORAGE_KEY);
}
