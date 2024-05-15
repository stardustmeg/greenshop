import AppModel from '@/app/App/model/AppModel.ts';
import '@/styles.scss';

// import type {
// AddCartItem,
// } from './shared/types/cart.ts';

// import getCustomerModel from './shared/API/customer/model/CustomerModel.ts';
// import getCartModel from './shared/API/cart/model/CartModel.ts';
// import getStore from './shared/Store/Store.ts';

const myApp = new AppModel();
myApp.start();

// console.log('start', getStore().getState().anonymousCartId);

// const cart = await getCartModel().getCart();
// console.log(cart);

// console.log('after', getStore().getState().anonymousCartId);
// const addItem: AddCartItem = {
//   productId: 'f947dfa9-9485-46ff-9957-0a0a156840dd',
//   quantity: 15,
//   variantId: 1,
// }

// console.log(await getCartModel().addProductToCart(addItem));

// const delItem: DeleteCartItem = {
//   cart,
//   product: cart.products[0]
// }
// const del = await getCartModel().deleteProductFromCart(delItem);
// console.log(del);
