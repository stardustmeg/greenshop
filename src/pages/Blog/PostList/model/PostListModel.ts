import type RouterModel from '@/app/Router/model/RouterModel.ts';
import type { Post } from '@/shared/constants/blog.ts';
import type { Page } from '@/shared/types/common.ts';

import PostView from '@/pages/Blog/Post/view/PostView.ts';
import getStore from '@/shared/Store/Store.ts';
import { setCurrentPage } from '@/shared/Store/actions.ts';
import observeStore, { selectCurrentLanguage } from '@/shared/Store/observer.ts';
import { PAGE_ID } from '@/shared/constants/pages.ts';

import postsData from '../../data/posts.ts';
import BlogPageView from '../view/PostListView.ts';

export default class PostListModel implements Page {
  private parent: HTMLDivElement;

  private postClickHandler = (post: PostView): void => {
    this.view.openPost(post);
  };

  private posts: PostView[];

  private router: RouterModel;

  private view: BlogPageView;

  constructor(parent: HTMLDivElement, router: RouterModel) {
    const newPost: Post[] = postsData;
    this.parent = parent;
    this.router = router;
    this.posts = newPost.map((post) => new PostView(post, this.postClickHandler, this.router));
    this.view = new BlogPageView(parent, this.posts);
    this.render();
    this.init();
  }

  private init(): boolean {
    getStore().dispatch(setCurrentPage(PAGE_ID.BLOG));
    this.observeStoreLanguage();
    window.addEventListener('popstate', () => this.render());
    return true;
  }

  private observeStoreLanguage(): boolean {
    observeStore(selectCurrentLanguage, () => this.view.updateLanguage());
    return true;
  }

  private render(): void {
    const path = window.location.pathname;
    const postId = path.split('/').pop();

    this.view = new BlogPageView(this.parent, this.posts);
    if (path !== '/blog') {
      const postEl = this.posts.find((post) => post.getPost().id === postId);
      if (postEl) {
        this.view.openPost(postEl);
      }
    }
  }

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }
}
