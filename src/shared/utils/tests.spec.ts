import findAddressIndex from './address.ts';
import BaseElement from './baseElement.ts';
import clearOutElement from './clearOutElement.ts';
import createBaseElement from './createBaseElement.ts';
import createSVGUse from './createSVGUse.ts';
import formattedText from './formattedText.ts';
import getCountryIndex from './getCountryIndex.ts';
import observeCurrentLanguage from './observeCurrentLanguage.ts';

/**
 * @vitest-environment jsdom
 */

describe('Checking formattedText function', () => {
  it('should return formatted text for basic functionality', () => {
    expect(formattedText('test')).toBe('Test');
  });

  it('should return empty string for empty input', () => {
    expect(formattedText('')).toBe('');
  });

  it('should trim leading and trailing spaces and return formatted text', () => {
    expect(formattedText('  test  ')).toBe('Test');
  });

  it('should capitalize the first letter of each word and return formatted text', () => {
    expect(formattedText('hello world')).toBe('Hello World');
  });

  it('should handle all uppercase input', () => {
    expect(formattedText('HELLO')).toBe('Hello');
  });

  it('should handle all lowercase input', () => {
    expect(formattedText('hello')).toBe('Hello');
  });

  it('should handle input with special characters', () => {
    expect(formattedText('hello-world')).toBe('Hello-world');
  });

  it('should handle input with numbers', () => {
    expect(formattedText('123 test 456')).toBe('123 Test 456');
  });
});

describe('Checking clearOutElement function', () => {
  it('should clear out element', () => {
    const element = document.createElement('div');
    element.innerHTML = 'test';
    clearOutElement(element);
    expect(element.innerHTML).toBe('');
  });
});

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

describe('Checking getCountryIndex function', () => {
  it('Afghanistan country should return AF', () => {
    expect(getCountryIndex('Afghanistan')).toBe('AF');
  });

  it('Canada country should return CA', () => {
    expect(getCountryIndex('Canada')).toBe('CA');
  });
});

describe('Checking observeCurrentLanguage function', () => {
  it('should return true', () => {
    expect(observeCurrentLanguage(document.body, {}, 'test')).toBe(true);
  });
});

describe('Checking findAddressIndex function', () => {
  it('should return null', () => {
    expect(
      findAddressIndex([], {
        city: 'test',
        country: 'test',
        postalCode: 'test',
        streetName: 'test',
        streetNumber: 'test',
      }),
    ).toBe(null);
  });
  it('should return 0', () => {
    expect(
      findAddressIndex(
        [
          {
            city: 'test',
            country: 'test',
            postalCode: 'test',
            streetName: 'test',
            streetNumber: 'test',
          },
        ],
        {
          city: 'test',
          country: 'test',
          postalCode: 'test',
          streetName: 'test',
          streetNumber: 'test',
        },
      ),
    ).toBe(0);
  });
});
