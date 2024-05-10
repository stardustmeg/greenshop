import type BlogPostView from '@/widgets/BlogPost/view/blogPostView';

import getStore from '@/shared/Store/Store.ts';
// import { Post } from '@/shared/constants/blog';
import { PAGE_DESCRIPTION } from '@/shared/constants/pages.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';

import styles from './blogPageView.module.scss';

export default class BlogPageView {
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

    // this.postItems.forEach((post) => {
    //   const newElement = createBaseElement({
    //     cssClasses: [styles.blog],
    //     innerContent: post.getCardHTML(),
    //     tag: 'div',
    //   });
    //   // newElement.innerHTML = post;
    //   this.postList.append(newElement);
    // });

    this.page = this.createHTML();
  }

  private createHTML(): HTMLDivElement {
    this.page = createBaseElement({
      cssClasses: [styles.blog],
      tag: 'div',
    });

    this.page.append(this.title, this.postList);
    this.parent.append(this.page);

    return this.page;
  }

  private createPageTitle(): HTMLHeadingElement {
    this.title = createBaseElement({
      cssClasses: [styles.pageTitle],
      innerContent: PAGE_DESCRIPTION[getStore().getState().currentLanguage].BLOG,
      tag: 'h1',
    });
    return this.title;
  }

  private createPostList(): HTMLUListElement {
    this.postList = createBaseElement({
      cssClasses: [styles.postList],
      innerContent: this.postItems.map((post) => post.getCardHTML()).join(' '),
      tag: 'ul',
    });
    return this.postList;
  }

  public getHTML(): HTMLDivElement {
    return this.page;
  }

  public setPageTittle(): HTMLParagraphElement {
    this.title.innerText = PAGE_DESCRIPTION[getStore().getState().currentLanguage].BLOG;
    return this.title;
  }
}
