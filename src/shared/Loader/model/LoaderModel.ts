import type { LoaderSizeType } from '@/shared/constants/sizes.ts';

import LoaderView from '../view/LoaderView.ts';

class LoaderModel {
  private view: LoaderView;

  constructor(size: LoaderSizeType) {
    this.view = new LoaderView(size);
  }

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }

  public setAbsolutePosition(): void {
    this.view.setAbsolutePosition();
  }
}

export default LoaderModel;
