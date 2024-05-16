import InputModel from '@/shared/Input/model/InputModel.ts';
import { AUTOCOMPLETE_OPTION } from '@/shared/constants/common.ts';
import { INPUT_TYPE } from '@/shared/constants/forms.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';

import styles from './productSearchView.module.scss';

class ProductSearchView {
  private searchField: InputModel;

  private view: HTMLDivElement;

  constructor() {
    this.searchField = this.createSearchField();
    this.view = this.createHTML();
  }

  private createHTML(): HTMLDivElement {
    this.view = createBaseElement({
      cssClasses: [styles.style],
      tag: 'div',
    });

    this.view.append(this.searchField.getHTML());
    return this.view;
  }

  private createSearchField(): InputModel {
    this.searchField = new InputModel({
      autocomplete: AUTOCOMPLETE_OPTION.ON,
      placeholder: 'Search',
      type: INPUT_TYPE.SEARCH,
    });

    return this.searchField;
  }

  public getHTML(): HTMLDivElement {
    return this.view;
  }

  public getsearchField(): InputModel {
    return this.searchField;
  }
}

export default ProductSearchView;
