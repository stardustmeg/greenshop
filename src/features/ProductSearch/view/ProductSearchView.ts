import RouterModel from '@/app/Router/model/RouterModel.ts';
import InputModel from '@/shared/Input/model/InputModel.ts';
import getStore from '@/shared/Store/Store.ts';
import observeStore, { selectCurrentLanguage } from '@/shared/Store/observer.ts';
import { AUTOCOMPLETE_OPTION } from '@/shared/constants/common.ts';
import { INPUT_TYPE } from '@/shared/constants/forms.ts';
import { SEARCH_PARAMS_FIELD } from '@/shared/constants/product.ts';
import { TEXT } from '@/shared/constants/sorting.ts';
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
      cssClasses: [styles.searchWrapper],
      tag: 'div',
    });

    this.view.append(this.searchField.getHTML());
    return this.view;
  }

  private createSearchField(): InputModel {
    this.searchField = new InputModel({
      autocomplete: AUTOCOMPLETE_OPTION.ON,
      placeholder: TEXT[getStore().getState().currentLanguage].SEARCH,
      type: INPUT_TYPE.SEARCH,
    });

    const initialValue = RouterModel.getSearchParams().get(SEARCH_PARAMS_FIELD.SEARCH);
    if (initialValue) {
      this.searchField.setValue(initialValue);
    }

    observeStore(selectCurrentLanguage, () => {
      this.searchField.getHTML().placeholder = TEXT[getStore().getState().currentLanguage].SEARCH;
    });

    this.searchField.getHTML().classList.add(styles.searchField);

    return this.searchField;
  }

  public getHTML(): HTMLDivElement {
    return this.view;
  }

  public getSearchField(): InputModel {
    return this.searchField;
  }
}

export default ProductSearchView;
