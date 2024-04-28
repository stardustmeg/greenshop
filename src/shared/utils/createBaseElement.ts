interface CreateBaseElement<T> {
  attributes?: Record<string, string>;
  cssClasses?: string[];
  innerContent?: string;
  tag: T;
}

const createBaseElement = <T extends keyof HTMLElementTagNameMap>({
  attributes = {},
  cssClasses = [],
  innerContent = '',
  tag,
}: CreateBaseElement<T>): HTMLElementTagNameMap[T] => {
  const elem = document.createElement(tag);

  elem.classList.add(...cssClasses);

  Object.entries(attributes).forEach(([attrName, attrValue]) => {
    elem.setAttribute(attrName, attrValue);
  });

  elem.innerHTML = innerContent;

  return elem;
};

export default createBaseElement;
