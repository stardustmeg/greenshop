import type { CooperationData } from '@/shared/types/validation/cooperationData';

import getStore from '@/shared/Store/Store.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';

import styles from './cooperationPageView.module.scss';

class CooperationPageView {
  private page: HTMLDivElement;

  private parent: HTMLDivElement;

  private wrapper: HTMLDivElement;

  constructor(parent: HTMLDivElement) {
    this.parent = parent;
    this.parent.innerHTML = '';
    this.wrapper = this.createCooperationWrapper();
    this.page = this.createHTML();
    window.scrollTo(0, 0);
  }

  private createCooperationWrapper(): HTMLDivElement {
    this.wrapper = createBaseElement({
      cssClasses: [styles.cooperationWrapper],
      tag: 'div',
    });

    return this.wrapper;
  }

  private createDescription(description: string): HTMLParagraphElement {
    const descriptionElement = createBaseElement({
      cssClasses: [styles.cooperationDescription],
      tag: 'p',
    });
    descriptionElement.textContent = description;
    return descriptionElement;
  }

  private createHTML(): HTMLDivElement {
    this.page = createBaseElement({
      cssClasses: [styles.cooperationPage],
      tag: 'div',
    });

    this.page.append(this.wrapper);
    this.parent.append(this.page);

    return this.page;
  }

  private createItem(text: string): HTMLLIElement {
    const listItem = createBaseElement({
      cssClasses: [styles.cooperationListItem],
      innerContent: text,
      tag: 'li',
    });
    return listItem;
  }

  private createItemList(): HTMLUListElement {
    const itemList = createBaseElement({
      cssClasses: [styles.cooperationItemList],
      tag: 'ul',
    });
    return itemList;
  }

  private createSubtitle(subtitle: string): HTMLHeadingElement {
    const subtitleElement = createBaseElement({
      cssClasses: [styles.cooperationSubtitle],
      tag: 'h3',
    });
    subtitleElement.textContent = subtitle;
    return subtitleElement;
  }

  private createTitle(title: string): HTMLHeadingElement {
    const titleElement = createBaseElement({
      cssClasses: [styles.cooperationTitle],
      tag: 'h2',
    });
    titleElement.textContent = title;
    return titleElement;
  }

  public drawCooperationInfo(data: CooperationData[]): void {
    data.forEach((item) => {
      const section = createBaseElement({
        cssClasses: [styles.cooperationSection],
        tag: 'div',
      });
      const currentTitle = item[getStore().getState().currentLanguage].title;
      const currentDescription = item[getStore().getState().currentLanguage].description;
      const currentSubtitle = item[getStore().getState().currentLanguage].subtitle;
      const currentItems = item[getStore().getState().currentLanguage].items;
      if (currentTitle) {
        const title = this.createTitle(currentTitle);
        section.append(title);
      }

      if (currentDescription) {
        const title = this.createDescription(currentDescription);
        section.append(title);
      }

      if (currentSubtitle) {
        const title = this.createSubtitle(currentSubtitle);
        section.append(title);
      }

      if (currentItems) {
        const createItemList = this.createItemList();
        currentItems.forEach((item) => {
          const listItem = this.createItem(item.text);
          createItemList.append(listItem);
        });
        section.append(createItemList);
      }

      this.wrapper.append(section);
    });
  }

  public getHTML(): HTMLDivElement {
    return this.page;
  }

  public redrawCooperationInfo(data: CooperationData[]): void {
    this.wrapper.innerHTML = '';
    this.drawCooperationInfo(data);
  }
}

export default CooperationPageView;
