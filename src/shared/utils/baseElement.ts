type EventListenerFunction = (event: Event) => void;

export default class BaseElement {
  private readonly node;

  constructor(tag = 'div', cssClasses: string[] = [], attributes: Record<string, string> = {}, innerContent = '') {
    this.node = document.createElement(tag);

    if (cssClasses.length > 0) {
      this.node.classList.add(...cssClasses);
    }

    this.setAttributes(attributes);
    this.node.innerHTML = innerContent;
  }

  public addCssClass(cssClass: string): void {
    this.node.classList.add(cssClass);
  }

  public addEventListener(eventName: string, listener: EventListenerFunction): void {
    this.node.addEventListener(eventName, listener);
  }

  public addListener(eventName: string, listener: VoidFunction): void {
    this.node.addEventListener(eventName, listener);
  }

  public append(...children: (BaseElement | HTMLElement)[]): void {
    children.forEach((child) => {
      if (child instanceof HTMLElement) {
        this.node.append(child);
      } else if (child instanceof BaseElement) {
        this.node.append(child.node);
      }
    });
  }

  public appendTo(parent: BaseElement | HTMLElement): void {
    if (parent instanceof HTMLElement || parent instanceof BaseElement) {
      parent.append(this.node);
    }
  }

  public getAttribute(attributeName: string): null | string {
    return this.node.getAttribute(attributeName);
  }

  public getNode(): HTMLElement {
    return this.node;
  }

  public remove(): void {
    this.node.remove();
  }

  public removeCssClass(cssClass: string): void {
    this.node.classList.remove(cssClass);
  }

  public removeListener(eventName: string, listener: VoidFunction): void {
    this.node.removeEventListener(eventName, listener);
  }

  public replaceChildren(...children: (BaseElement | HTMLElement)[]): void {
    const elements = children.map((child) => {
      if (child instanceof BaseElement) {
        return child.node;
      }
      return child;
    });
    this.node.replaceChildren(...elements);
  }

  public setAttributes(attributes: Record<string, string>): void {
    Object.entries(attributes).forEach(([attributeName, attributeValue]) => {
      this.node.setAttribute(attributeName, attributeValue);
    });
  }

  public setTextContent(text: string): void {
    this.node.innerText = text;
  }

  public toggleCssClass(cssClass: string): void {
    this.node.classList.toggle(cssClass);
  }
}
