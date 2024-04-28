/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { isNotNullable } from './isNullable.ts';

export type Props<T extends HTMLElement = HTMLElement> = {
  tag?: keyof HTMLElementTagNameMap;
  txt?: string;
} & Partial<Omit<T, 'children' | 'classList' | 'dataset' | 'style' | 'tagName'>>;

export type ElementFnProps<T extends HTMLElement = HTMLElement> = Omit<Props<T>, 'tag'>;

export class BaseComponent<T extends HTMLElement = HTMLElement> {
  protected children: BaseComponent[] = [];

  protected node: T;

  constructor(p: Props<T>, ...children: (BaseComponent | HTMLElement | null)[]) {
    const currentProp = p;
    currentProp.textContent = p.txt;
    const node = document.createElement(p.tag ?? 'div') as T;
    Object.assign(node, p);
    this.node = node;
    if (children) {
      this.appendChildren(children.filter(isNotNullable));
    }
  }

  public addClass(classNameClassName: string): void {
    this.node.classList.add(classNameClassName);
  }

  public append(child: BaseComponent | HTMLElement): void {
    if (child instanceof BaseComponent) {
      this.children.push(child);
      this.node.append(child.getNode());
    } else {
      this.node.append(child);
    }
  }

  public appendChildren(children: (BaseComponent | HTMLElement | null)[]): void {
    children.filter(isNotNullable).forEach((element) => {
      this.append(element);
    });
  }

  public destroy(): void {
    this.destroyAllChildren();
    this.node.remove();
  }

  public destroyAllChildren(): void {
    this.children.reduce((_, child) => {
      child.destroy();
      return null;
    }, null);
    this.children.length = 0;
  }

  public getNode(): T {
    return this.node;
  }

  public removeClass(className: string): void {
    this.node.classList.remove(className);
  }

  public stc(text: string): void {
    this.node.textContent = text;
  }

  public toggleClass(classSurname: string): void {
    this.node.classList.toggle(classSurname);
  }
}
