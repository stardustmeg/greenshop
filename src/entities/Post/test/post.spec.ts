import postsData from '@/shared/Posts/posts.ts';
import sinon from 'sinon';

import PostView from '../view/PostView.ts';

/**
 * @vitest-environment jsdom
 */

const deleteCallback = sinon.fake();
const posts = postsData;
const post = new PostView(posts[0], deleteCallback);

describe('Checking post', () => {
  it('should check if post is defined', () => {
    expect(post).toBeDefined();
  });

  it('should check if post is an instance of PostView', () => {
    expect(post).toBeInstanceOf(PostView);
  });
});
