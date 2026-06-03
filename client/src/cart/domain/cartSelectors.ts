import type {CartState} from './types.js';

export const FREE_SHIPPING_THRESHOLD = 100000;
const SHIPPING_FEE = 3000;

function getSelectedCartItems(cartState: CartState) {
  return cartState.items.filter((item) => cartState.selectedIds.includes(item.id));
}

export function getSelectedOrderAmount(cartState: CartState) {
  const selectedItems = getSelectedCartItems(cartState);

  return selectedItems.reduce((orderAmount, item) => {
    return orderAmount + item.productInfo.price * item.quantity;
  }, 0);
}

export function getShippingFee(cartState: CartState) {
  const selectedOrderAmount = getSelectedOrderAmount(cartState);

  if (selectedOrderAmount === 0) return 0;
  if (selectedOrderAmount >= FREE_SHIPPING_THRESHOLD) return 0;

  return SHIPPING_FEE;
}

export function getTotalPrice(cartState: CartState) {
  const selectedOrderAmount = getSelectedOrderAmount(cartState);
  const shippingFee = getShippingFee(cartState);

  return selectedOrderAmount + shippingFee;
}

export function getSelectedItemCount(cartState: CartState) {
  return getSelectedCartItems(cartState).length;
}

export function getSelectedQuantity(cartState: CartState) {
  return getSelectedCartItems(cartState).reduce((selectedQuantity, item) => {
    return selectedQuantity + item.quantity;
  }, 0);
}
