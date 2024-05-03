import type { ButtonActionType } from './action.ts';

export interface ButtonAttributes {
  action?: ButtonActionType;
  attrs?: Record<string, string>;
  classes?: string[];
  text?: string;
}
