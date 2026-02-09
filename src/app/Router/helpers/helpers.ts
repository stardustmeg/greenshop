export const remove = (url: URL, key: string | string[]): void => {
  if (Array.isArray(key)) {
    key.forEach((k) => url.searchParams.delete(k));
  } else {
    url.searchParams.delete(key);
  }
};
export const append = (url: URL, key: string, value: string): void => url.searchParams.append(key, value);
export const set = (url: URL, key: string, value: string): void => url.searchParams.set(key, value);
