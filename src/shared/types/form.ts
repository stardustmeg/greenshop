export interface InputParams {
  autocomplete: 'off' | 'on';
  id: string;
  lang?: string;
  placeholder: null | string;
  type: 'checkbox' | 'color' | 'date' | 'email' | 'number' | 'password' | 'search' | 'tel' | 'text';
}

export interface LabelParams {
  for: string;
  text: {
    en: string;
    ru: string;
  } | null;
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
    messages: Record<string, string>;
    pattern: RegExp;
  } | null;
  notWhitespace?: {
    messages: Record<string, string>;
    pattern: RegExp;
  } | null;
  required?: boolean | null;
  requiredSymbols?: {
    messages: Record<string, string>;
    pattern: RegExp;
  } | null;
  validBirthday?: {
    maxAge: number;
    messages: Record<string, string>;
    minAge: number;
    pattern: RegExp;
  } | null;
  validCountry?: boolean;
  validMail?: {
    messages: Record<string, string>;
    pattern: RegExp;
  } | null;
  validPostalCode?: boolean;
}
