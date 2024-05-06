export const SIZES = {
  EXTRA_LARGE: 'xl',
  EXTRA_SMALL: 'xs',
  LARGE: 'l',
  MEDIUM: 'm',
  SMALL: 's',
} as const;

export type SizesType = (typeof SIZES)[keyof typeof SIZES];
