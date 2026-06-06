import type {CartItem, CartItemId, CartState} from './types.js';

type FetchSuccessPayload = Pick<CartState, 'items' | 'selectedIds'>;
type FetchErrorPayload = Pick<CartState, 'errorMessage'>;
type CartItemIdPayload = {cartItemId: CartItemId};
type SelectedIdsPayload = Pick<CartState, 'selectedIds'>;
type UpdateCartItemQuantityPayload = CartItemIdPayload & {quantity: CartItem['quantity']};

type CartAction =
  | {type: 'fetchStart'}
  | {type: 'fetchSuccess'; payload: FetchSuccessPayload}
  | {type: 'fetchError'; payload: FetchErrorPayload}
  | {type: 'changeSelectedCartItemIds'; payload: SelectedIdsPayload}
  | {type: 'updateCartItemQuantity'; payload: UpdateCartItemQuantityPayload}
  | {type: 'deleteCartItem'; payload: CartItemIdPayload};

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'fetchStart': {
      return startFetchingCart(state);
    }
    case 'fetchSuccess': {
      return completeFetchingCart(state, action.payload);
    }
    case 'fetchError': {
      return failFetchingCart(state, action.payload);
    }
    case 'changeSelectedCartItemIds': {
      return changeSelectedCartItemIds(state, action.payload);
    }
    case 'updateCartItemQuantity': {
      return updateCartItemQuantity(state, action.payload);
    }
    case 'deleteCartItem': {
      return deleteCartItem(state, action.payload.cartItemId);
    }
  }
}

// Fetch state functions

function startFetchingCart(state: CartState): CartState {
  return {
    ...state,
    status: 'loading',
    errorMessage: '',
  };
}

function completeFetchingCart(state: CartState, payload: FetchSuccessPayload): CartState {
  return {
    ...state,
    status: 'success',
    items: payload.items,
    selectedIds: payload.selectedIds,
    errorMessage: '',
  };
}

function failFetchingCart(state: CartState, payload: FetchErrorPayload): CartState {
  return {
    ...state,
    status: 'error',
    errorMessage: payload.errorMessage,
  };
}

// Selection state functions

function changeSelectedCartItemIds(state: CartState, payload: SelectedIdsPayload): CartState {
  return {
    ...state,
    selectedIds: payload.selectedIds,
  };
}

// Item state functions

function updateCartItemQuantity(state: CartState, payload: UpdateCartItemQuantityPayload): CartState {
  const updatedCartItems = state.items.map((cartItem) => {
    if (cartItem.id !== payload.cartItemId) return cartItem;

    return {...cartItem, quantity: payload.quantity};
  });

  return {
    ...state,
    items: updatedCartItems,
  };
}

function deleteCartItem(state: CartState, cartItemId: CartItemId): CartState {
  const remainingCartItems = state.items.filter((cartItem) => cartItem.id !== cartItemId);
  const remainingSelectedIds = state.selectedIds.filter((selectedCartItemId) => selectedCartItemId !== cartItemId);

  return {
    ...state,
    items: remainingCartItems,
    selectedIds: remainingSelectedIds,
  };
}
