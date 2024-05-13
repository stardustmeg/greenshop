import type BlogPostView from '@/pages/Blog/Post/view/PostView';

import getStore from '@/shared/Store/Store.ts';
import { BLOG_DESCRIPTION } from '@/shared/constants/pages.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';
import { img } from '@/shared/utils/tags.ts';

import styles from './postListView.module.scss';

export default class PostListView {
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
    const imgLogo = img({ alt: 'blog logo', className: styles.blogLogo, src: 'img/webp/blog-logo.webp' });
    wrap.append(imgLogo.getNode(), this.title, this.description);
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
      innerContent: BLOG_DESCRIPTION[getStore().getState().currentLanguage].LIST_TITTLE,
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
  }

  public updateLanguage(): boolean {
    const ln = getStore().getState().currentLanguage;
    this.title.innerText = BLOG_DESCRIPTION[ln].LIST_TITTLE;
    this.description.innerText = BLOG_DESCRIPTION[ln].LIST_DESCRIPTION;
    return true;
  }
}
