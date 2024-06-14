import type ButtonModel from '@/shared/Button/model/ButtonModel.ts';
import type { Product } from '@/shared/types/product.ts';
import type { ShoppingList, ShoppingListProduct } from '@/shared/types/shopping-list.ts';

import getShoppingListModel from '@/shared/API/shopping-list/model/ShoppingListModel.ts';
import EventMediatorModel from '@/shared/EventMediator/model/EventMediatorModel.ts';
import getStore from '@/shared/Store/Store.ts';
import { LANGUAGE_CHOICE } from '@/shared/constants/common.ts';
import MEDIATOR_EVENT from '@/shared/constants/events.ts';
import { productAddedToWishListMessage, productRemovedFromWishListMessage } from '@/shared/utils/messageTemplates.ts';
import { showErrorMessage, showSuccessMessage } from '@/shared/utils/userMessage.ts';

import WishlistButtonView from '../view/WishlistButtonView.ts';

class WishlistButtonModel {
  private params: Product;

  private view = new WishlistButtonView();

  constructor(params: Product) {
    this.params = params;
    this.init();
  }

  private addProductToWishListHandler(): void {
    getShoppingListModel()
      .addProduct(this.params.id)
      .then(() => {
        showSuccessMessage(
          productAddedToWishListMessage(
            this.params.name[Number(getStore().getState().currentLanguage === LANGUAGE_CHOICE.RU)].value,
          ),
        );
        this.view.switchStateWishListButton(true);
        EventMediatorModel.getInstance().notify(MEDIATOR_EVENT.CHANGE_WISHLIST_BUTTON, '');
      })
      .catch(showErrorMessage);
  }

  private deleteProductToWishListHandler(productInWishList: ShoppingListProduct): void {
    getShoppingListModel()
      .deleteProduct(productInWishList)
      .then(() => {
        showSuccessMessage(
          productRemovedFromWishListMessage(
            this.params.name[Number(getStore().getState().currentLanguage === LANGUAGE_CHOICE.RU)].value,
          ),
        );
        this.view.switchStateWishListButton(false);
        EventMediatorModel.getInstance().notify(MEDIATOR_EVENT.CHANGE_WISHLIST_BUTTON, this.params.key);
      })
      .catch(showErrorMessage);
  }

  private hasProductInWishList(shoppingList: ShoppingList): void {
    const result = shoppingList.products.find((product) => product.productId === this.params.id);
    this.view.switchStateWishListButton(Boolean(result));
  }

  private init(): void {
    getShoppingListModel()
      .getShoppingList()
      .then((shoppingList) => {
        this.hasProductInWishList(shoppingList);
        this.setButtonHandler();
      })
      .catch(showErrorMessage);
  }

  private setButtonHandler(): void {
    const switchToWishListButton = this.view.getHTML();
    switchToWishListButton.getHTML().addEventListener('click', async () => {
      const shoppingList = await getShoppingListModel().getShoppingList();
      const productInWishList = shoppingList.products.find((product) => product.productId === this.params.id);
      if (productInWishList) {
        this.deleteProductToWishListHandler(productInWishList);
      } else {
        this.addProductToWishListHandler();
      }
    });
  }

  public getHTML(): ButtonModel {
    return this.view.getHTML();
  }

  public getView(): WishlistButtonView {
    return this.view;
  }
}

export default WishlistButtonModel;
