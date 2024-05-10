import type { Post } from '@/shared/constants/blog';

import styles from './blogPost.module.scss';

export default class BlogPostView {
  private card: string;

  private content: string;

  private post: Post;

  constructor(post: Post, content: string) {
    this.post = post;
    this.content = content;
    this.card = this.createCardHTML();
  }

  private createCardHTML(): string {
    return `
    <li class=${styles.cardItem}>
      <a href="#" class=${styles.link}>
        <div class=${styles.wrapImage}>
          <img src=${this.post.image} alt=${this.post.tittle} class=${styles.img}></img>
        </div>
          <p class=${styles.dataTime}>${this.post.date} | Read in ${this.post.time.toString()} minutes</p>
          <p class=${styles.title}>${this.post.tittle}</p>
          <p class=${styles.shortDescription}>${this.post.shortDescription}</p>
          <p class=${styles.reed}>Read more...</p>
        </div>
      </a>
    </li>`;
  }

  public getCardHTML(): string {
    return this.card;
  }

  public getPostHTML(): string {
    return this.content;
  }
}
