import type { SizesType } from '@/shared/constants/sizes.ts';

import LoaderView from '../view/LoaderView.ts';

class LoaderModel {
  private view: LoaderView;

  constructor(size: SizesType) {
    this.view = new LoaderView(size);
  }

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }
}

export default LoaderModel;
