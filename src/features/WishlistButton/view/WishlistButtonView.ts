import ButtonModel from '@/shared/Button/model/ButtonModel.ts';
import SVG_DETAIL from '@/shared/constants/svg.ts';
import createSVGUse from '@/shared/utils/createSVGUse.ts';

import styles from './wishlistButtonView.module.scss';

class WishlistButtonView {
  private switchToWishListButton: ButtonModel;

  constructor() {
    this.switchToWishListButton = this.createHTML();
  }

  private createHTML(): ButtonModel {
    this.switchToWishListButton = new ButtonModel({
      classes: [styles.switchToWishListButton],
    });

    const svg = document.createElementNS(SVG_DETAIL.SVG_URL, 'svg');
    svg.append(createSVGUse(SVG_DETAIL.HEART));
    this.switchToWishListButton.getHTML().append(svg);

    return this.switchToWishListButton;
  }

  public getHTML(): ButtonModel {
    return this.switchToWishListButton;
  }

  public switchStateWishListButton(hasProductInWishList: boolean): void {
    this.switchToWishListButton.getHTML().classList.toggle(styles.inWishList, hasProductInWishList);
  }
}

export default WishlistButtonView;
