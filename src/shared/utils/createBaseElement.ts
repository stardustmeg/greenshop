interface CreateBaseElement<T> {
  attributes?: Record<string, string>;
  cssClasses?: string[];
  innerContent?: string;
  tag: T;
  title?: string;
}

const createBaseElement = <T extends keyof HTMLElementTagNameMap>({
  attributes = {},
  cssClasses = [],
  innerContent = '',
  tag,
  title = '',
}: CreateBaseElement<T>): HTMLElementTagNameMap[T] => {
  const elem = document.createElement(tag);

  elem.classList.add(...cssClasses);

  Object.entries(attributes).forEach(([attrName, attrValue]) => {
    if (attrValue) {
      elem.setAttribute(attrName, attrValue);
    }
  });

  elem.title = title;

  elem.innerHTML = innerContent;

  return elem;
};

export default createBaseElement;
