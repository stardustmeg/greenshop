import { BaseComponent } from './baseComponent.ts';
import BaseElement from './baseElement.ts';
import createBaseElement from './createBaseElement.ts';
import createSVGUse from './createSVGUse.ts';
import getCountryIndex from './getCountryIndex.ts';
import isKeyOfUserData from './isKeyOfUserData.ts';
import { isNotNullable, isNullable } from './isNullable.ts';
import { a, div, h2, h3, iconFromCode, img, input, label, main, span } from './tags.ts';

const baseElement = new BaseElement(
  'a',
  ['first', 'second'],
  {
    'data-test': 'test',
    href: 'test',
  },
  'someText',
);

const elem = createBaseElement({
  attributes: {
    'data-test': 'test',
  },
  cssClasses: ['test'],
  innerContent: 'test',
  tag: 'div',
});

const baseComponent = new BaseComponent({
  tag: 'div',
  txt: 'test',
});

describe('Checking createBaseElement function', () => {
  it('should create an element', () => {
    expect(elem).toBeDefined();
  });

  it('should create an element with attributes', () => {
    expect(elem.dataset.test).toBe('test');
  });

  it('should create an element with css classes', () => {
    expect(elem.classList.contains('test')).toBe(true);
  });
});

describe('Checking isNullable function', () => {
  it('should return true', () => {
    expect(isNullable(null)).toBe(true);
  });
  it('should return false', () => {
    expect(isNullable('test')).toBe(false);
  });
});

describe('Checking isNotNullable function', () => {
  it('should return true', () => {
    expect(isNotNullable(null)).toBe(false);
  });
  it('should return false', () => {
    expect(isNotNullable('test')).toBe(true);
  });
});

describe('Checking createSVGUse function', () => {
  it('should create an element', () => {
    expect(createSVGUse('test')).toBeDefined();
  });
});

describe('Checking BaseElement class', () => {
  it('should add css class to the element and return true', () => {
    baseElement.addCssClass('third');
    expect(baseElement.getNode().classList.contains('third')).toBe(true);
  });

  it('should remove css class from the element and return true', () => {
    baseElement.removeCssClass('first');
    expect(baseElement.getNode().classList.contains('first')).toBe(false);
  });

  it('should toggle css class from the element and return true', () => {
    baseElement.toggleCssClass('first');
    expect(baseElement.getNode().classList.contains('first')).toBe(true);
  });

  it('remove should return true', () => {
    baseElement.remove();
    expect(baseElement.getNode().parentElement).toBe(null);
  });

  it('append children should return true', () => {
    baseElement.append(elem);
    expect(baseElement.getNode().contains(elem)).toBe(true);
  });

  it('replace children should return true', () => {
    baseElement.replaceChildren(elem);
    expect(baseElement.getNode().contains(elem)).toBe(true);
  });

  it('add event listener should return true', () => {
    baseElement.addListener('click', () => {});
    const addEventListenerSpy = vi.spyOn(baseElement.getNode(), 'addEventListener');
    expect(addEventListenerSpy).toBeInstanceOf(Function);
  });

  it('add event listener should return true', () => {
    baseElement.addEventListener('click', () => {});
    const addEventListenerSpy = vi.spyOn(baseElement.getNode(), 'addEventListener');
    expect(addEventListenerSpy).toBeInstanceOf(Function);
  });

  it('remove event listener should return true', () => {
    baseElement.removeListener('click', () => {});
    const removeEventListenerSpy = vi.spyOn(baseElement.getNode(), 'removeEventListener');
    expect(removeEventListenerSpy).toBeInstanceOf(Function);
  });

  it('get attribute should return true', () => {
    const attribute = baseElement.getAttribute('data-test');
    expect(attribute).toBe('test');
  });

  it('set attributes should return true', () => {
    baseElement.setAttributes({
      'data-test1': 'test1',
      'data-test2': 'test2',
    });
    expect(baseElement.getNode().dataset.test1).toBe('test1');
    expect(baseElement.getNode().dataset.test2).toBe('test2');
  });

  it('inner text is equal to test2', () => {
    baseElement.setTextContent('test2');
    expect(baseElement.getNode().innerText).toBe('test2');
  });

  it('append should return true', () => {
    baseElement.append(elem);
    expect(baseElement.getNode().contains(elem)).toBe(true);
  });
});

describe('Checking BaseComponent class', () => {
  it('getNode should return instance of HTMLDivElement', () => {
    expect(baseComponent.getNode()).toBeInstanceOf(HTMLDivElement);
  });

  it('destroy should return true', () => {
    baseComponent.destroy();
    expect(baseComponent.getNode().parentElement).toBe(null);
  });

  it('destroyAllChildren should return true', () => {
    baseComponent.destroyAllChildren();
    expect(baseComponent.getNode().children.length).toBe(0);
  });

  it('append should return true', () => {
    baseComponent.append(elem);
    expect(baseComponent.getNode().contains(elem)).toBe(true);
  });

  it('appendChildren should return true', () => {
    baseComponent.appendChildren([elem]);
    expect(baseComponent.getNode().contains(elem)).toBe(true);
  });

  it('set text content should return test', () => {
    baseComponent.stc('test');
    expect(baseComponent.getNode().textContent).toBe('test');
  });

  it('add css class should return test', () => {
    baseComponent.addClass('test');
    expect(baseComponent.getNode().classList.contains('test')).toBe(true);
  });

  it('remove css class should return test', () => {
    baseComponent.removeClass('test');
    expect(baseComponent.getNode().classList.contains('test')).toBe(false);
  });

  it('toggle css class should return test', () => {
    baseComponent.toggleClass('test');
    expect(baseComponent.getNode().classList.contains('test')).toBe(true);
  });
});

describe('Checking tags functions', () => {
  it('span should return instance of HTMLSpanElement', () => {
    expect(span({ txt: 'test' }).getNode()).toBeInstanceOf(HTMLSpanElement);
  });

  it('main should return instance of HTMLDivElement', () => {
    expect(main({ txt: 'test' }).getNode()).toBeInstanceOf(HTMLElement);
  });

  it('label should return instance of HTMLLabelElement', () => {
    expect(label({ txt: 'test' }).getNode()).toBeInstanceOf(HTMLLabelElement);
  });

  it('input should return instance of HTMLInputElement', () => {
    expect(input({ txt: 'test' }).getNode()).toBeInstanceOf(HTMLInputElement);
  });

  it('iconFromCode should return instance of HTMLElement', () => {
    expect(iconFromCode({ txt: 'test' }, 'test').getNode()).toBeInstanceOf(HTMLElement);
  });

  it('h2 should return instance of HTMLHeadingElement', () => {
    expect(h2('test', 'test').getNode()).toBeInstanceOf(HTMLHeadingElement);
  });

  it('h3 should return instance of HTMLHeadingElement', () => {
    expect(h3('test', 'test').getNode()).toBeInstanceOf(HTMLHeadingElement);
  });

  it('div should return instance of HTMLDivElement', () => {
    expect(div({ txt: 'test' }, null).getNode()).toBeInstanceOf(HTMLDivElement);
  });

  it('a should return instance of HTMLAnchorElement', () => {
    expect(a({ txt: 'test' }).getNode()).toBeInstanceOf(HTMLAnchorElement);
  });

  it('img should return instance of HTMLImageElement', () => {
    expect(img({ src: 'test' }).getNode()).toBeInstanceOf(HTMLImageElement);
  });
});

describe('Checking getCountryIndex function', () => {
  it('Afghanistan country should return AF', () => {
    expect(getCountryIndex('Afghanistan')).toBe('AF');
  });

  it('Canada country should return CA', () => {
    expect(getCountryIndex('Canada')).toBe('CA');
  });
});

const userData = {
  email: 'user@example.com',
  password: 'test',
};

describe('Checking isKeyOfUserData function', () => {
  it('Email should return true', () => {
    expect(isKeyOfUserData(userData, 'email')).toBe(true);
  });
});
