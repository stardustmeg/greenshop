import createBaseElement from '@/shared/utils/createBaseElement.ts';

import BlogWidgetModel from '../model/BogWidgetModel.ts';

/**
 * @vitest-environment jsdom
 */

const parent = createBaseElement({
  tag: 'div',
});
const blog = new BlogWidgetModel(parent);

describe('Checking blog widget', () => {
  it('should check if post is defined', () => {
    expect(blog).toBeDefined();
  });

  it('should check if cart is an instance of CartPageModel', () => {
    expect(blog).toBeInstanceOf(BlogWidgetModel);
  });
});
