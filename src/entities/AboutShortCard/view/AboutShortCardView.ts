import type { AboutData, AboutLabel } from '@/shared/types/validation/aboutData';

import LinkModel from '@/shared/Link/model/LinkModel.ts';
import observeStore, { selectCurrentLanguage, selectCurrentTheme } from '@/shared/Store/observer.ts';
import { LINK_DETAIL } from '@/shared/constants/links.ts';
import SVG_DETAIL from '@/shared/constants/svg.ts';
import changeColor from '@/shared/utils/changeColor.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';
import createSVGUse, { changeFill, changeStroke } from '@/shared/utils/createSVGUse.ts';
import getCurrentAppTheme from '@/shared/utils/getCurrentAppTheme.ts';
import getCurrentLanguage from '@/shared/utils/getCurrentLanguage.ts';

import styles from './aboutShortCardView.module.scss';

class AboutShortCardView {
  protected params: AboutData;

  protected view: HTMLDivElement;

  constructor(params: AboutData) {
    this.params = params;
    this.view = this.createHTML();
  }

  private createAvatar(): LinkModel {
    const avatar = new LinkModel({
      attrs: {
        href: this.params.github.link,
        target: LINK_DETAIL.BLANK,
      },
      classes: [styles.avatar],
    });
    const background = `url(${this.params.avatar})`;
    avatar.getHTML().style.backgroundImage = background;
    return avatar;
  }

  private createCover(): HTMLDivElement {
    const cover = createBaseElement({
      cssClasses: [styles.cover],
      tag: 'div',
    });

    cover.style.backgroundColor = this.params.coverColor[getCurrentAppTheme()].color;

    observeStore(selectCurrentTheme, () => {
      cover.style.backgroundColor = this.params.coverColor[getCurrentAppTheme()].color;
    });
    return cover;
  }

  private createFullName(): HTMLSpanElement {
    const fullName = createBaseElement({
      cssClasses: [styles.fullName],
      innerContent: this.params.userName[getCurrentLanguage()].text,
      tag: 'span',
    });

    const svg = document.createElementNS(SVG_DETAIL.SVG_URL, 'svg');
    svg.append(createSVGUse(SVG_DETAIL.PROFILE));
    changeStroke(svg, this.params.coverColor[getCurrentAppTheme()].color);

    observeStore(selectCurrentTheme, () => {
      changeStroke(svg, this.params.coverColor[getCurrentAppTheme()].color);
    });
    fullName.append(svg);

    observeStore(selectCurrentLanguage, () => {
      const textNode = [...fullName.childNodes].find((child) => child.nodeType === Node.TEXT_NODE);
      if (textNode) {
        textNode.textContent = this.params.userName[getCurrentLanguage()].text;
      }
    });
    return fullName;
  }

  private createGithubName(): LinkModel {
    const githubName = new LinkModel({
      attrs: {
        href: this.params.github.link,
        target: LINK_DETAIL.BLANK,
      },
      classes: [styles.githubName],
      text: this.params.github.name,
    });

    changeColor(githubName.getHTML(), this.params.coverColor[getCurrentAppTheme()].color);

    observeStore(selectCurrentTheme, () => {
      changeColor(githubName.getHTML(), this.params.coverColor[getCurrentAppTheme()].color);
    });

    return githubName;
  }

  private createGithubWrapper(): HTMLDivElement {
    const githubWrapper = createBaseElement({
      cssClasses: [styles.githubWrapper],
      tag: 'div',
    });

    githubWrapper.append(this.createGithubName().getHTML(), this.createAvatar().getHTML());
    return githubWrapper;
  }

  private createHTML(): HTMLDivElement {
    this.view = createBaseElement({
      cssClasses: [styles.card],
      tag: 'div',
    });

    const bottomWrapper = createBaseElement({
      cssClasses: [styles.bottomWrapper],
      tag: 'div',
    });

    bottomWrapper.append(
      this.createFullName(),
      this.createPosition(),
      this.createShortDescription(),
      this.createGithubWrapper(),
    );
    this.view.append(this.createCover(), this.createLabelsList(), bottomWrapper);
    return this.view;
  }

  private createLabel(item: AboutLabel): HTMLLIElement {
    const label = createBaseElement({
      cssClasses: [styles.label],
      tag: 'li',
    });
    const labelName = createBaseElement({
      cssClasses: [styles.labelName],
      innerContent: item.name,
      tag: 'span',
    });

    labelName.style.color = item.color[getCurrentAppTheme()].color;
    label.style.backgroundColor = item.backgroundColor[getCurrentAppTheme()].color;
    label.append(labelName);

    observeStore(selectCurrentTheme, () => {
      labelName.style.color = item.color[getCurrentAppTheme()].color;
      label.style.backgroundColor = item.backgroundColor[getCurrentAppTheme()].color;
    });
    return label;
  }

  private createLabelsList(): HTMLUListElement {
    const labelsList = createBaseElement({
      cssClasses: [styles.labelsList],
      tag: 'ul',
    });

    this.params.labels.forEach((item) => {
      labelsList.append(this.createLabel(item));
    });

    observeStore(selectCurrentLanguage, () => {
      labelsList.innerHTML = '';
      this.params.labels.forEach((item) => {
        labelsList.append(this.createLabel(item));
      });
    });

    return labelsList;
  }

  private createPosition(): HTMLSpanElement {
    const position = createBaseElement({
      cssClasses: [styles.position],
      innerContent: this.params.position[getCurrentLanguage()].text,
      tag: 'span',
    });

    const svg = document.createElementNS(SVG_DETAIL.SVG_URL, 'svg');
    svg.append(createSVGUse(SVG_DETAIL.STAR));
    changeFill(svg, this.params.coverColor[getCurrentAppTheme()].color);

    observeStore(selectCurrentTheme, () => {
      changeFill(svg, this.params.coverColor[getCurrentAppTheme()].color);
    });

    position.append(svg);

    observeStore(selectCurrentLanguage, () => {
      const textNode = [...position.childNodes].find((child) => child.nodeType === Node.TEXT_NODE);
      if (textNode) {
        textNode.textContent = this.params.position[getCurrentLanguage()].text;
      }
    });
    return position;
  }

  private createShortDescription(): HTMLSpanElement {
    const shortDescription = createBaseElement({
      cssClasses: [styles.shortDescription],
      innerContent: this.params.shortDescription[getCurrentLanguage()].text,
      tag: 'span',
    });

    observeStore(selectCurrentLanguage, () => {
      shortDescription.textContent = this.params.shortDescription[getCurrentLanguage()].text;
    });
    return shortDescription;
  }

  public getHTML(): HTMLDivElement {
    return this.view;
  }
}

export default AboutShortCardView;
