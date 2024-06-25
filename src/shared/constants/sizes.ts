export const LOADER_SIZE = {
  EXTRA_LARGE: 'xl',
  EXTRA_SMALL: 'xs',
  LARGE: 'l',
  MEDIUM: 'm',
  SMALL: 's',
} as const;

export type LoaderSizeType = (typeof LOADER_SIZE)[keyof typeof LOADER_SIZE];
