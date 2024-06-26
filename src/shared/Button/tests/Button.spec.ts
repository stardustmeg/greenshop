import ButtonModel from '../model/ButtonModel.ts';

/**
 * @vitest-environment jsdom
 */

const button = new ButtonModel({
  action: {
    key: 'click',
    value: (): void => {},
  },
  attrs: {
    'data-test': 'test',
  },
  classes: ['test'],
  text: 'test',
});

describe('Checking ButtonModel class', () => {
  it('the data-set attribute should return test', () => {
    expect(button.getHTML().dataset.test).toBe('test');
  });
  it('the disabled attribute should return true', () => {
    button.setDisabled();
    expect(button.getHTML().disabled).toBe(true);
  });
  it('the disabled attribute should return false', () => {
    button.setEnabled();
    expect(button.getHTML().disabled).toBe(false);
  });
});
