export const arrayContainsObjectWithValue = <T, K extends keyof T>(arr: T[], key: K, value: T[K]): boolean =>
  arr.some((obj) => obj[key] === value);

export const objectHasPropertyValue = <T, K extends keyof T>(obj: T | null, key: K, value: T[K]): boolean =>
  obj !== null && obj !== undefined && obj[key] === value;
