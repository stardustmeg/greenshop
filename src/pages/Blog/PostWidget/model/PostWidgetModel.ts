import type RouterModel from '@/app/Router/model/RouterModel.ts';

import PostView from '@/pages/Blog/Post/view/PostView.ts';
import observeStore, { selectCurrentLanguage } from '@/shared/Store/observer.ts';

import postsData from '../../data/posts.ts';
import PostWidgetView from '../view/PostWidgetView.ts';

const CART_COUNT = 3;
const HALF_RANDOM = 0.5;

export default class PostWidgetModel {
  private postClickHandler = (post: PostView): void => {
    this.view.openPost(post);
  };

  private posts: PostView[];

  private router: RouterModel;

  private view: PostWidgetView;

  constructor(parent: HTMLDivElement, router: RouterModel) {
    const shuffledPosts = [...postsData].sort(() => HALF_RANDOM - Math.random());
    const newPost = shuffledPosts.slice(0, CART_COUNT);
    this.router = router;
    this.posts = newPost.map((post) => new PostView(post, this.postClickHandler, this.router));
    this.view = new PostWidgetView(parent, this.posts);
    this.init();
  }

  private init(): boolean {
    this.observeStoreLanguage();
    return true;
  }

  private observeStoreLanguage(): boolean {
    observeStore(selectCurrentLanguage, () => this.view.updateLanguage());
    return true;
  }

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }
}
