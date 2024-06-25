import AppModel from '../model/AppModel.ts';

const app = new AppModel();

/**
 * @vitest-environment jsdom
 */

describe('Checking AppModel class', () => {
  it('application successfully created', () => {
    expect(app.start()).toBe(true);
  });
});
