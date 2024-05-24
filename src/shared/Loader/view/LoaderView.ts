import type { LoaderSizeType } from '@/shared/constants/sizes.ts';

import { LOADER_SIZE } from '@/shared/constants/sizes.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';

import styles from './loaderView.module.scss';

class LoaderView {
  private loader: HTMLDivElement;

  constructor(size: LoaderSizeType) {
    this.loader = this.createHTML(size);
  }

  private createHTML(size: LoaderSizeType): HTMLDivElement {
    this.loader = createBaseElement({
      cssClasses: [styles.loader],
      tag: 'div',
    });

    this.selectSize(size);

    return this.loader;
  }

  private selectSize(size: LoaderSizeType): void {
    switch (size) {
      case LOADER_SIZE.SMALL:
        this.setSmallStyle();
        break;
      case LOADER_SIZE.MEDIUM:
        this.setMediumStyle();
        break;
      case LOADER_SIZE.LARGE:
        this.setLargeStyle();
        break;
      case LOADER_SIZE.EXTRA_LARGE:
        this.setExtraLargeStyle();
        break;
      case LOADER_SIZE.EXTRA_SMALL:
        this.setExtraSmallStyle();
        break;
      default:
        this.setSmallStyle();
        break;
    }
  }

  private setExtraLargeStyle(): void {
    this.loader.classList.add(styles.extraLarge);
  }

  private setExtraSmallStyle(): void {
    this.loader.classList.add(styles.extraSmall);
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

  public setAbsolutePosition(): void {
    this.loader.classList.add(styles.absolute);
  }
}

export default LoaderView;
