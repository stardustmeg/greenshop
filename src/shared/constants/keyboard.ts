export const KEYBOARD_KEYS = {
  ENTER: 'Enter',
  ESC: 'Escape',
  TAB: 'Tab',
} as const;

export type KeyboardKeysType = (typeof KEYBOARD_KEYS)[keyof typeof KEYBOARD_KEYS];
