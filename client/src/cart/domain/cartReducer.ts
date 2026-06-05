import type {CartItem, CartItemId, CartState} from './types.js';

type FetchSuccessPayload = Pick<CartState, 'items' | 'selectedIds'>;
type FetchErrorPayload = Pick<CartState, 'errorMessage'>;
type CartItemIdPayload = {cartItemId: CartItemId};
type UpdateCartItemQuantityPayload = CartItemIdPayload & {quantity: CartItem['quantity']};

type CartAction =
  | {type: 'fetchStart'}
  | {type: 'fetchSuccess'; payload: FetchSuccessPayload}
  | {type: 'fetchError'; payload: FetchErrorPayload}
  | {type: 'toggleCartItem'; payload: CartItemIdPayload}
  | {type: 'toggleAllCartItems'}
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
    case 'toggleCartItem': {
      return toggleCartItem(state, action.payload.cartItemId);
    }
    case 'toggleAllCartItems': {
      return toggleAllCartItems(state);
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

function toggleCartItem(state: CartState, cartItemId: CartItemId): CartState {
  const isAlreadySelected = state.selectedIds.includes(cartItemId);

  // 이미 해당 상품이 체크되어 있다면
  if (isAlreadySelected) {
    const selectedIds = state.selectedIds.filter((selectedId) => selectedId !== cartItemId);

    return {
      ...state,
      selectedIds,
    };
  }

  // 체크해야 한다면
  return {
    ...state,
    selectedIds: [...state.selectedIds, cartItemId],
  };
}

function toggleAllCartItems(state: CartState): CartState {
  const cartItemIds = state.items.map((cartItem) => cartItem.id);

  const isAllSelected = cartItemIds.every((cartItemId) => state.selectedIds.includes(cartItemId));

  if (isAllSelected) {
    return {...state, selectedIds: []};
  }

  return {...state, selectedIds: cartItemIds};
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
