import type ButtonActionType from './types.ts';

interface ButtonAttributesInterface {
  action?: ButtonActionType;
  attrs?: Record<string, string>;
  classes?: string[];
  text?: string;
}

export default ButtonAttributesInterface;
