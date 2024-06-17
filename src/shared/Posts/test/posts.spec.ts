import postsData from '../posts.ts';

/**
 * @vitest-environment jsdom
 */

describe('Checking posts', () => {
  const posts = postsData;
  it('should check if post is defined', () => {
    expect(posts).toBeDefined();
  });

  it('should check if posts is an instance of CartPageModel', () => {
    expect(Array.isArray(posts)).toBe(true);
  });
});
