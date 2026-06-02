import type {CartState} from './types.js';

const FREE_SHIPPING_THRESHOLD = 100000;
const SHIPPING_FEE = 3000;

function getSelectedCartItems(state: CartState) {
  return state.items.filter((item) => state.selectedIds.includes(item.id));
}

export function getOrderAmount(state: CartState) {
  const selectedItems = getSelectedCartItems(state);

  return selectedItems.reduce((total, item) => {
    return total + item.productInfo.price * item.quantity;
  }, 0);
}

export function getShippingFee(state: CartState) {
  const orderAmount = getOrderAmount(state);

  if (orderAmount === 0) return 0;
  if (orderAmount >= FREE_SHIPPING_THRESHOLD) return 0;

  return SHIPPING_FEE;
}

export function getTotalPayment(state: CartState) {
  const orderAmount = getOrderAmount(state);
  const shippingFee = getShippingFee(state);

  return orderAmount + shippingFee;
}

export function getSelectedItemCount(state: CartState) {
  return getSelectedCartItems(state).length;
}

export function getSelectedQuantity(state: CartState) {
  return getSelectedCartItems(state).reduce((total, item) => {
    return total + item.quantity;
  }, 0);
}
