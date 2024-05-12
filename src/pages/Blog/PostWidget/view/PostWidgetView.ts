import type BlogPostView from '@/pages/Blog/Post/view/PostView';

import getStore from '@/shared/Store/Store.ts';
import { BLOG_DESCRIPTION } from '@/shared/constants/pages.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';

import styles from './postWidgetView.module.scss';

export default class PostWidgetView {
  private description: HTMLParagraphElement;

  private page: HTMLDivElement;

  private parent: HTMLDivElement;

  private postItems: BlogPostView[];

  private postList: HTMLUListElement;

  private title: HTMLHeadingElement;

  constructor(parent: HTMLDivElement, postsItem: BlogPostView[]) {
    this.parent = parent;
    this.postItems = postsItem;
    this.title = this.createPageTitle();
    this.postList = this.createPostList();
    this.description = this.createPageDescription();

    this.page = this.createHTML();
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
      innerContent: BLOG_DESCRIPTION[getStore().getState().currentLanguage].WIDGET_DESCRIPTIONS,
      tag: 'p',
    });
    return this.description;
  }

  private createPageTitle(): HTMLHeadingElement {
    this.title = createBaseElement({
      cssClasses: [styles.pageTitle],
      innerContent: BLOG_DESCRIPTION[getStore().getState().currentLanguage].WIDGET_TITTLE,
      tag: 'h3',
    });
    return this.title;
  }

  private createPostList(): HTMLUListElement {
    this.postList = createBaseElement({
      cssClasses: [styles.postList],
      tag: 'ul',
    });
    this.postList.append(...this.postItems.map((post) => post.getCardHTML(true)));
    return this.postList;
  }

  public getHTML(): HTMLDivElement {
    return this.page;
  }

  public openPost(post: BlogPostView): void {
    this.parent.innerHTML = '';
    this.parent.append(post.getPostHTML());
  }

  public updateLanguage(): boolean {
    this.title.innerText = BLOG_DESCRIPTION[getStore().getState().currentLanguage].WIDGET_TITTLE;
    this.description.innerText = BLOG_DESCRIPTION[getStore().getState().currentLanguage].WIDGET_DESCRIPTIONS;
    return true;
  }
}
