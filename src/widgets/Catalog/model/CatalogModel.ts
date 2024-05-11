import ProductCardModel from '@/entities/ProductCard/model/ProductCardModel.ts';
import getProductModel from '@/shared/API/product/model/ProductModel.ts';
import addFilter from '@/shared/API/product/utils/filter.ts';
import { FilterFields, type OptionsRequest } from '@/shared/API/types/type.ts';
import serverMessageModel from '@/shared/ServerMessage/model/ServerMessageModel.ts';
import getStore from '@/shared/Store/Store.ts';
import { MESSAGE_STATUS, SERVER_MESSAGE } from '@/shared/constants/messages.ts';
import { SIZE } from '@/shared/types/product.ts';

import CatalogView from '../view/CatalogView.ts';

class CatalogModel {
  private view = new CatalogView();

  constructor() {
    this.getProductItems();
  }

  private getProductItems(): void {
    const productList = this.view.getItemsList();

    const options: OptionsRequest = {
      filter: [addFilter(FilterFields.SIZE, 'S')],
      limit: 5,
      sort: {
        direction: 'asc',
        field: 'name',
        locale: 'en',
      },
    };

    getProductModel()
      .getProducts(options)
      .then((data) => {
        if (data) {
          data.forEach((productData) => {
            productList.append(new ProductCardModel(productData, SIZE.S).getHTML());
          });
        }
      })
      .catch(() =>
        serverMessageModel.showServerMessage(
          SERVER_MESSAGE[getStore().getState().currentLanguage].BAD_REQUEST,
          MESSAGE_STATUS.ERROR,
        ),
      );
  }

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }
}

export default CatalogModel;
