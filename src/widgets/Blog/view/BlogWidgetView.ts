import type BlogPostView from '@/entities/Post/view/PostView';

import { BLOG_DESCRIPTION } from '@/shared/constants/pages.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';
import getCurrentLanguage from '@/shared/utils/getCurrentLanguage.ts';

import styles from './blogWidgetView.module.scss';

export default class BlogWidgetView {
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
      innerContent: BLOG_DESCRIPTION[getCurrentLanguage()].WIDGET_DESCRIPTIONS,
      tag: 'p',
    });
    return this.description;
  }

  private createPageTitle(): HTMLHeadingElement {
    this.title = createBaseElement({
      cssClasses: [styles.pageTitle],
      innerContent: BLOG_DESCRIPTION[getCurrentLanguage()].WIDGET_TITLE,
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
    window.scrollTo(0, 0);
  }

  public updateLanguage(): boolean {
    this.title.innerText = BLOG_DESCRIPTION[getCurrentLanguage()].WIDGET_TITLE;
    this.description.innerText = BLOG_DESCRIPTION[getCurrentLanguage()].WIDGET_DESCRIPTIONS;
    return true;
  }
}
