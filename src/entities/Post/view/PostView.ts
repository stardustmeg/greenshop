import type { Post } from '@/shared/types/blog';

import observeStore, { selectCurrentLanguage } from '@/shared/Store/observer.ts';
import { LANGUAGE_CHOICE } from '@/shared/constants/common.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';
import formattedMinutes from '@/shared/utils/formattedTime.ts';
import getCurrentLanguage from '@/shared/utils/getCurrentLanguage.ts';

import styles from './post.module.scss';

export default class PostView {
  private blogPost: HTMLDivElement;

  private callback: (post: PostView) => void;

  private card: HTMLLIElement;

  private post: Post;

  constructor(post: Post, postClickCallback: (post: PostView) => void) {
    this.post = post;
    this.callback = postClickCallback;
    this.card = this.createCardHTML();
    this.blogPost = this.createPostHtml();

    this.card.addEventListener('click', () => this.onPostClick());
    observeStore(selectCurrentLanguage, () => this.updateLanguage());
    window.scrollTo(0, 0);
  }

  private createCardHTML(): HTMLLIElement {
    const li = createBaseElement({
      cssClasses: [styles.cardItem],
      innerContent: this.createCardInfoHTML(),
      tag: 'li',
    });
    li.id = this.post.id;

    return li;
  }

  private createCardInfoHTML(): string {
    const ln = getCurrentLanguage();
    const read =
      ln === LANGUAGE_CHOICE.EN
        ? `Read in ${this.post.time.toString()} minutes`
        : `Читать за ${formattedMinutes(this.post.time)}`;
    const readMore = ln === LANGUAGE_CHOICE.EN ? 'Read more...' : 'Читать далее...';
    const content = `
      <article class=${styles.article}>
        <div class=${styles.wrapImage}>
          <img src="/${this.post.image}" alt="${this.post.title[ln]}" class=${styles.img}></img>
        </div>
          <p class=${styles.dataTime}>${this.post.date[ln]} | ${read}</p>
          <p class=${styles.title}>${this.post.title[ln]}</p>
          <p class=${styles.shortDescription}>${this.post.shortDescription[ln]}</p>
          <p class=${styles.reed}>${readMore}</p>
        </div>
      </article>`;

    return content;
  }

  private onPostClick(): void {
    this.callback(this);
  }

  public createPostHtml(): HTMLDivElement {
    const div = createBaseElement({
      cssClasses: [styles.post],
      innerContent: this.createPostInfoHtml(),
      tag: 'div',
    });

    return div;
  }

  public createPostInfoHtml(): string {
    const ln = getCurrentLanguage();
    this.post.content[ln] = this.post.content[ln].replace(/<p>/g, `<p class=${styles.paragraph}>`);
    this.post.content[ln] = this.post.content[ln].replace(/<h2>/g, `<h4 class=${styles.headText}>`);
    this.post.content[ln] = this.post.content[ln].replace(/<h3>/g, `<h4 class=${styles.headText}>`);
    this.post.content[ln] = this.post.content[ln].replace(/<h4>/g, `<h4 class=${styles.headText}>`);
    this.post.content[ln] = this.post.content[ln].replace(/<h5>/g, `<h4 class=${styles.headText}>`);
    this.post.content[ln] = this.post.content[ln].replace(/<ul>/g, `<h4 class=${styles.list}>`);
    this.post.content[ln] = this.post.content[ln].replace(/<li>/g, `<h4 class=${styles.item}>`);
    const title = `
    <div class=${styles.head}>
      <h1 class=${styles.title}>${this.post.title[ln]}</h1>
      <p class=${styles.shortDescription}>${this.post.shortDescription[ln]}</p>
    </div>
    <img src="/${this.post.image}" alt="${this.post.title[ln]}" class=${styles.img}></img>
    <div class=${styles.info}>
      ${this.post.content[ln]}
    </div>`;
    return title;
  }

  public getCardHTML(short?: boolean): HTMLLIElement {
    if (short) {
      this.card.classList.add(styles.short);
    } else {
      this.card.classList.remove(styles.short);
    }
    return this.card;
  }

  public getPost(): Post {
    return this.post;
  }

  public getPostHTML(): HTMLDivElement {
    return this.blogPost;
  }

  public updateLanguage(): void {
    this.card.innerHTML = this.createCardInfoHTML();
    this.blogPost.innerHTML = this.createPostInfoHtml();
  }
}
