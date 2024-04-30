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

export interface InputParams {
  autocomplete: string;
  id: string;
  lang?: string;
  placeholder: null | string;
  type: string;
}

export interface LabelParams {
  for: string;
  text: null | string;
}

export interface InputFieldParams {
  inputParams: InputParams;
  labelParams?: LabelParams | null;
}

export interface InputFieldValidatorParams {
  key: string;
  maxLength?: null | number;
  minLength?: null | number;
  notSpecialSymbols?: {
    message: string;
    pattern: RegExp;
  } | null;
  notWhitespace?: {
    message: string;
    pattern: RegExp;
  } | null;
  required?: boolean | null;
  requiredSymbols?: {
    message: string;
    pattern: RegExp;
  } | null;
  validBirthday?: {
    maxAge: number;
    message: string;
    minAge: number;
    pattern: RegExp;
  } | null;
  validMail?: {
    message: string;
    pattern: RegExp;
  } | null;
}
