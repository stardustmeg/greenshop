import PostView from '@/entities/Post/view/PostView.ts';
import observeStore, { selectCurrentLanguage } from '@/shared/Store/observer.ts';

import postsData from '../../../shared/Posts/posts.ts';
import BlogWidgetView from '../view/BlogWidgetView.ts';

const CART_COUNT = 3;
const HALF_RANDOM = 0.5;

export default class BlogWidgetModel {
  private postClickHandler = (post: PostView): void => {
    this.view.openPost(post);
  };

  private posts: PostView[];

  private view: BlogWidgetView;

  constructor(parent: HTMLDivElement) {
    const shuffledPosts = [...postsData].sort(() => HALF_RANDOM - Math.random());
    const newPost = shuffledPosts.slice(0, CART_COUNT);
    this.posts = newPost.map((post) => new PostView(post, this.postClickHandler));
    this.view = new BlogWidgetView(parent, this.posts);
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
