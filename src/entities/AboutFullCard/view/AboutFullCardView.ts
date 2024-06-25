import type { AboutData, AboutFeedback } from '@/shared/types/validation/aboutData';

import AboutShortCardView from '@/entities/AboutShortCard/view/AboutShortCardView.ts';
import LinkModel from '@/shared/Link/model/LinkModel.ts';
import observeStore, { selectCurrentLanguage, selectCurrentTheme } from '@/shared/Store/observer.ts';
import ABOUT_TEXT from '@/shared/constants/about.ts';
import { LINK_DETAIL } from '@/shared/constants/links.ts';
import changeColor from '@/shared/utils/changeColor.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';
import getCurrentAppTheme from '@/shared/utils/getCurrentAppTheme.ts';
import getCurrentLanguage from '@/shared/utils/getCurrentLanguage.ts';
import hexToRgba from '@/shared/utils/hexToRgba.ts';

import styles from './aboutFullCardView.module.scss';

class AboutFullCardView extends AboutShortCardView {
  constructor(params: AboutData) {
    super(params);
    this.view.classList.add(styles.aboutFullCard);
    this.view.append(this.createChecklist(), this.createFeedbackList());
  }

  private createCheckItem(item: { text: string }): HTMLLIElement {
    const listItem = createBaseElement({
      cssClasses: [styles.checklistItem],
      tag: 'li',
    });
    const label = createBaseElement({
      cssClasses: [styles.label],
      innerContent: item.text,
      tag: 'label',
    });

    listItem.append(label);
    return listItem;
  }

  private createChecklist(): HTMLUListElement {
    const list = createBaseElement({
      cssClasses: [styles.checklist],
      tag: 'ul',
    });

    const title = createBaseElement({
      cssClasses: [styles.title],
      innerContent: ABOUT_TEXT[getCurrentLanguage()].CHECKLIST,
      tag: 'h3',
    });

    changeColor(title, this.params.coverColor[getCurrentAppTheme()].color);
    list.append(title);
    this.params.checklist[getCurrentLanguage()].forEach((item) => {
      list.append(this.createCheckItem(item));
    });

    observeStore(selectCurrentLanguage, () => {
      list.innerHTML = '';
      title.innerText = ABOUT_TEXT[getCurrentLanguage()].CHECKLIST;
      list.append(title);
      this.params.checklist[getCurrentLanguage()].forEach((item) => {
        list.append(this.createCheckItem(item));
      });
    });

    observeStore(selectCurrentTheme, () => {
      changeColor(title, this.params.coverColor[getCurrentAppTheme()].color);
    });
    return list;
  }

  private createFeedbackItem(item: AboutFeedback): HTMLLIElement {
    const listItem = createBaseElement({ cssClasses: [styles.feedbackListItem], tag: 'li' });
    const label = createBaseElement({
      cssClasses: [styles.label, styles.feedbackLabel],
      innerContent: `— ${item.text[getCurrentLanguage()].text}`,
      tag: 'label',
    });

    label.style.backgroundColor = hexToRgba(this.params.coverColor[getCurrentAppTheme()].color, 0.2);

    const href = `https://github.com/${item.from}`;
    const background = `url(${`/img/png/${item.from}Avatar.png`})`;
    const from = new LinkModel({
      attrs: { href, target: LINK_DETAIL.BLANK },
      classes: [styles.from],
      text: item.from,
    });

    const avatar = new LinkModel({ attrs: { href, target: LINK_DETAIL.BLANK }, classes: [styles.avatar] });

    avatar.getHTML().style.backgroundImage = background;
    from.getHTML().append(avatar.getHTML());

    changeColor(from.getHTML(), this.params.coverColor[getCurrentAppTheme()].color);

    observeStore(selectCurrentLanguage, () => {
      label.innerText = `— ${item.text[getCurrentLanguage()].text}`;
    });

    observeStore(selectCurrentTheme, () => {
      changeColor(from.getHTML(), this.params.coverColor[getCurrentAppTheme()].color);
      label.style.backgroundColor = hexToRgba(this.params.coverColor[getCurrentAppTheme()].color, 0.2);
    });

    listItem.append(from.getHTML(), label);
    return listItem;
  }

  private createFeedbackList(): HTMLUListElement {
    const list = createBaseElement({
      cssClasses: [styles.feedbackList],
      tag: 'ul',
    });

    const title = createBaseElement({
      cssClasses: [styles.title],
      innerContent: ABOUT_TEXT[getCurrentLanguage()].FEEDBACK,
      tag: 'h3',
    });

    changeColor(title, this.params.coverColor[getCurrentAppTheme()].color);
    list.append(title);
    this.params.feedback.forEach((item) => {
      list.append(this.createFeedbackItem(item));
    });

    observeStore(selectCurrentLanguage, () => {
      title.innerText = ABOUT_TEXT[getCurrentLanguage()].FEEDBACK;
    });

    observeStore(selectCurrentTheme, () => {
      changeColor(title, this.params.coverColor[getCurrentAppTheme()].color);
    });
    return list;
  }
}

export default AboutFullCardView;
