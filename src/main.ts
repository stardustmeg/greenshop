import AppModel from '@/app/App/model/AppModel.ts';
import '@/styles.scss';

// import type { AddCartItem } from './shared/types/product.ts';

// import getCustomerModel from './shared/API/customer/model/CustomerModel.ts';
import getCartModel from './shared/API/cart/model/CartModel.ts';

const myApp = new AppModel();
myApp.start();

await getCartModel().getCart();
// const addItem: AddCartItem = {
//   cart,
//   productId: '48f483cc-043f-4662-9dc2-e3f6a2af2ade',
//   quantity: 1,
//   variantId: 1,
// }

// await getCustomerModel().addProductToCart(addItem);
