import AppModel from '@/app/App/model/AppModel.ts';
import '@/styles.scss';

// import type {
// AddCartItem,
// DeleteCartItem
// } from './shared/types/product.ts';

// import getCustomerModel from './shared/API/customer/model/CustomerModel.ts';
// import getCartModel from './shared/API/cart/model/CartModel.ts';

const myApp = new AppModel();
myApp.start();

// const cart = await getCartModel().getCart();
// console.log(cart);
// const addItem: AddCartItem = {
//   cart,
//   productId: '80430fed-35ff-4d11-9b90-86796dd6c8ec',
//   quantity: 1,
//   variantId: 1,
// }

// await getCartModel().addProductToCart(addItem);

// const delItem: DeleteCartItem = {
//   cart,
//   product: cart.products[0]
// }
// const del = await getCartModel().deleteProductFromCart(delItem);
// console.log(del);
