import type { PageIdType } from '@/shared/constants/pages';

import { PAGE_ID } from '@/shared/constants/pages.ts';

interface PopStateEventState {
  path: string;
}

export const isValidPath = (value: unknown): value is PageIdType =>
  Object.values(PAGE_ID).findIndex((route) => route === value) !== -1;

export const isValidState = (state: unknown): state is PopStateEventState => {
  if (!state) {
    return false;
  }
  if (typeof state === 'object' && 'path' in state && typeof state.path === 'string') {
    return true;
  }
  return false;
};
