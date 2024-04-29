import type { ButtonActionType } from './types.ts';

export interface ButtonAttributesInterface {
  action?: ButtonActionType;
  attrs?: Record<string, string>;
  classes?: string[];
  text?: string;
}

export interface PageInterface {
  getHTML(): HTMLDivElement;
}
