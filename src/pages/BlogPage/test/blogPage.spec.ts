import createBaseElement from '@/shared/utils/createBaseElement.ts';

import BlogPageModel from '../model/BlogPageModel.ts';

/**
 * @vitest-environment jsdom
 */

const parent = createBaseElement({
  tag: 'div',
});
const blog = new BlogPageModel(parent);

describe('Checking blog', () => {
  it('should check if post is defined', () => {
    expect(blog).toBeDefined();
  });

  it('should check if blog is an instance of BlogPageModel', () => {
    expect(blog).toBeInstanceOf(BlogPageModel);
  });
});
