import cart from './handlers/cart.ts';
import category from './handlers/category.ts';
import customer from './handlers/customer.ts';
import discount from './handlers/discount.ts';
import product from './handlers/product.ts';
import project from './handlers/project.ts';
import shoppingList from './handlers/shopping-list.ts';
import token from './handlers/token.ts';

const handlers = [...token, ...category, ...product, ...cart, ...customer, ...discount, ...shoppingList, ...project];

export default handlers;
