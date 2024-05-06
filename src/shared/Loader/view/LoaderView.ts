import type { SizesType } from '@/shared/constants/sizes.ts';

import { SIZES } from '@/shared/constants/sizes.ts';
import TAG_NAME from '@/shared/constants/tags.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';

import styles from './loaderView.module.scss';

class LoaderView {
  private loader: HTMLDivElement;

  constructor(size: SizesType) {
    this.loader = this.createHTML(size);
  }

  private createHTML(size: SizesType): HTMLDivElement {
    this.loader = createBaseElement({
      cssClasses: [styles.loader],
      tag: TAG_NAME.DIV,
    });

    this.selectSize(size);

    return this.loader;
  }

  private selectSize(size: SizesType): void {
    switch (size) {
      case SIZES.SMALL:
        this.setSmallStyle();
        break;
      case SIZES.MEDIUM:
        this.setMediumStyle();
        break;
      case SIZES.LARGE:
        this.setLargeStyle();
        break;
      default:
        this.setSmallStyle();
        break;
    }
  }

  private setLargeStyle(): void {
    this.loader.classList.add(styles.large);
  }

  private setMediumStyle(): void {
    this.loader.classList.add(styles.medium);
  }

  private setSmallStyle(): void {
    this.loader.classList.add(styles.small);
  }

  public getHTML(): HTMLDivElement {
    return this.loader;
  }
}

export default LoaderView;
