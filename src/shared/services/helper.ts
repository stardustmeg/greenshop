/* eslint-disable @typescript-eslint/consistent-type-assertions */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
const COLLECTION_FIELD_KEY = {
  selectedFilters: 'selectedFilters',
} as const;

const COLLECTION_FIELD_VALUE = {
  category: 'category',
} as const;

export default function stringifyToSave<S>(state: S): string {
  return JSON.stringify(state, (key, value) => (hasKey(COLLECTION_FIELD_KEY, key) ? collectionToArray(value) : value));
}

function hasKey<T extends object, K extends string>(obj: T, key: K): key is K {
  return key in obj;
}

function collectionToArray(obj: Record<string, unknown>): Record<string, unknown> {
  const newObj: Record<string, unknown> = { ...obj };
  Object.entries(obj).forEach(([key, value]) => {
    if (hasKey(COLLECTION_FIELD_VALUE, key) && value instanceof Set) {
      newObj[key] = [...value];
    }
  });
  return newObj;
}

export function parseToLoad<S>(state: string): S {
  return JSON.parse(state, (key, value) => (hasKey(COLLECTION_FIELD_KEY, key) ? arrayToCollection(value) : value)) as S;
}

function arrayToCollection(obj: Record<string, unknown>): Record<string, unknown> {
  const newObj: Record<string, unknown> = { ...obj };
  Object.entries(obj).forEach(([key, value]) => {
    if (hasKey(COLLECTION_FIELD_VALUE, key) && value instanceof Array) {
      newObj[key] = new Set(value);
    }
  });
  return newObj;
}
