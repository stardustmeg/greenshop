import type BlogPostView from '@/entities/Post/view/PostView';

import getStore from '@/shared/Store/Store.ts';
import { BLOG_DESCRIPTION } from '@/shared/constants/pages.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';

import styles from './blogPageView.module.scss';

export default class BlogPageView {
  private description: HTMLParagraphElement;

  private page: HTMLDivElement;

  private parent: HTMLDivElement;

  private postItems: BlogPostView[];

  private postList: HTMLUListElement;

  private title: HTMLHeadingElement;

  constructor(parent: HTMLDivElement, postsItem: BlogPostView[]) {
    this.parent = parent;
    this.postItems = postsItem;
    this.parent.innerHTML = '';
    this.title = this.createPageTitle();
    this.postList = this.createPostList();
    this.description = this.createPageDescription();

    this.page = this.createHTML();
    window.scrollTo(0, 0);
  }

  private createHTML(): HTMLDivElement {
    this.page = createBaseElement({
      cssClasses: [styles.blog],
      tag: 'div',
    });

    const wrap = createBaseElement({
      cssClasses: [styles.wrap],
      tag: 'div',
    });
    wrap.append(this.title, this.description);
    this.page.append(wrap, this.postList);
    this.parent.append(this.page);

    return this.page;
  }

  private createPageDescription(): HTMLParagraphElement {
    this.description = createBaseElement({
      cssClasses: [styles.pageDescription],
      innerContent: BLOG_DESCRIPTION[getStore().getState().currentLanguage].LIST_DESCRIPTION,
      tag: 'p',
    });
    return this.description;
  }

  private createPageTitle(): HTMLHeadingElement {
    this.title = createBaseElement({
      cssClasses: [styles.pageTitle],
      innerContent: BLOG_DESCRIPTION[getStore().getState().currentLanguage].LIST_TITLE,
      tag: 'h1',
    });
    return this.title;
  }

  private createPostList(): HTMLUListElement {
    this.postList = createBaseElement({
      cssClasses: [styles.postList],
      tag: 'ul',
    });
    this.postList.append(...this.postItems.map((post) => post.getCardHTML()));
    return this.postList;
  }

  public getHTML(): HTMLDivElement {
    return this.page;
  }

  public openPost(post: BlogPostView): void {
    this.parent.innerHTML = '';
    this.parent.append(post.getPostHTML());
    window.scrollTo(0, 0);
  }

  public updateLanguage(): boolean {
    const ln = getStore().getState().currentLanguage;
    this.title.innerText = BLOG_DESCRIPTION[ln].LIST_TITLE;
    this.description.innerText = BLOG_DESCRIPTION[ln].LIST_DESCRIPTION;
    return true;
  }
}
