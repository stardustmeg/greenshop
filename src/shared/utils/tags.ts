import { BaseComponent, type ElementFnProps } from './baseComponent.ts';

export const span = (props: ElementFnProps<HTMLElement>, ...children: BaseComponent[]): BaseComponent =>
  new BaseComponent({ ...props, tag: 'span' }, ...children);

export const main = (props: ElementFnProps, ...children: BaseComponent[]): BaseComponent =>
  new BaseComponent({ ...props, tag: 'main' }, ...children);

export const label = (props: ElementFnProps, ...children: BaseComponent[]): BaseComponent =>
  new BaseComponent({ ...props, tag: 'label' }, ...children);

export const input = (props: ElementFnProps & Partial<HTMLInputElement>): BaseComponent =>
  new BaseComponent<HTMLInputElement>({ ...props, tag: 'input' });

export const iconFromCode = (props: ElementFnProps, code: string): BaseComponent =>
  new BaseComponent({ ...props, innerHTML: code, tag: 'i' });

export const h2 = (className: string, txt: string): BaseComponent<HTMLElementTagNameMap['h2']> =>
  new BaseComponent({ className, tag: 'h2', txt });

export const h3 = (className: string, txt: string): BaseComponent<HTMLElementTagNameMap['h3']> =>
  new BaseComponent({ className, tag: 'h3', txt });

export const div = (
  props: ElementFnProps<HTMLDivElement>,
  ...children: (BaseComponent | HTMLElement | null)[]
): BaseComponent => new BaseComponent<HTMLDivElement>(props, ...children);

export const a = (props: ElementFnProps<HTMLLinkElement>, ...children: BaseComponent[]): BaseComponent =>
  new BaseComponent<HTMLLinkElement>({ ...props, tag: 'a' }, ...children);

export const img = ({ alt = '', className = '', src = '' }): BaseComponent<HTMLElementTagNameMap['img']> =>
  new BaseComponent<HTMLElementTagNameMap['img']>({
    alt,
    className,
    src,
    tag: 'img',
  });
