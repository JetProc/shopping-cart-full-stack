import type {CartItem, CartItemId, CartState} from './types.js';

export type CartAction =
  | {type: 'fetchStart'}
  | {type: 'fetchSuccess'; payload: {items: CartItem[]; selectedIds: CartItemId[]}}
  | {type: 'fetchError'; payload: {errorMessage: string}}
  | {type: 'toggleCartItem'; payload: {cartItemId: CartItemId}}
  | {type: 'toggleAllCartItems'}
  | {type: 'updateCartItemQuantity'; payload: {cartItemId: CartItemId; quantity: number}}
  | {type: 'deleteCartItem'; payload: {cartItemId: CartItemId}};

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'fetchStart': {
      return {
        ...state,
        status: 'loading',
        errorMessage: '',
      };
    }
    case 'fetchSuccess': {
      return {
        ...state,
        status: 'success',
        items: action.payload.items,
        selectedIds: action.payload.selectedIds,
        errorMessage: '',
      };
    }
    case 'fetchError': {
      return {
        ...state,
        status: 'error',
        errorMessage: action.payload.errorMessage,
      };
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

function toggleCartItem(state: CartState, cartItemId: CartItemId): CartState {
  if (state.selectedIds.includes(cartItemId)) {
    const selectedIds = state.selectedIds.filter((selectedCartItemId) => {
      return selectedCartItemId !== cartItemId;
    });

    return {
      ...state,
      selectedIds,
    };
  }

  const selectedIds = [...state.selectedIds, cartItemId];

  return {
    ...state,
    selectedIds,
  };
}

function toggleAllCartItems(state: CartState): CartState {
  const cartItemIds = state.items.map((cartItem) => cartItem.id);

  const isAllSelected = cartItemIds.every((cartItemId) => {
    return state.selectedIds.includes(cartItemId);
  });

  if (isAllSelected) {
    return {...state, selectedIds: []};
  }

  return {...state, selectedIds: cartItemIds};
}

function updateCartItemQuantity(state: CartState, payload: {cartItemId: CartItemId; quantity: number}): CartState {
  return {
    ...state,
    items: state.items.map((cartItem) => {
      if (cartItem.id !== payload.cartItemId) return cartItem;

      return {...cartItem, quantity: payload.quantity};
    }),
  };
}

function deleteCartItem(state: CartState, cartItemId: CartItemId): CartState {
  return {
    ...state,
    items: state.items.filter((cartItem) => cartItem.id !== cartItemId),
    selectedIds: state.selectedIds.filter((selectedCartItemId) => {
      return selectedCartItemId !== cartItemId;
    }),
  };
}
