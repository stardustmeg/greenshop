/* eslint-disable max-lines-per-function */
import BaseElement from './baseElement.ts';
import createBaseElement from './createBaseElement.ts';
import createSVGUse from './createSVGUse.ts';
import { isNotNullable, isNullable } from './isNullable.ts';

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
});
