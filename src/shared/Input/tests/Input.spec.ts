import InputModel from '../model/InputModel.ts';

const input = new InputModel({
  id: 'test',
  type: 'password',
});
describe('Checking InputModel class', () => {
  it('should be defined', () => {
    expect(InputModel).toBeDefined();
  });

  it('the input has a password type', () => {
    expect(input.getHTML().type).toBe('password');
  });

  it('The method to clear the value should return an empty string', () => {
    input.clear();
    expect(input.getHTML().value).toBe('');
  });

  it('The method to get the value should return an empty string', () => {
    expect(input.getValue()).toBe('');
  });

  it('the disabled attribute should return true', () => {
    input.setDisabled();
    expect(input.getHTML().disabled).toBe(true);
  });
  it('the disabled attribute should return false', () => {
    input.setEnabled();
    expect(input.getHTML().disabled).toBe(false);
  });
});
