import AppModel from '../model/AppModel.ts';

const app = new AppModel();

describe('Checking AppModel class', () => {
  it('the getHTML method should return HTMLDivElement', () => {
    expect(app.getHTML()).toBeInstanceOf(HTMLDivElement);
  });
});
