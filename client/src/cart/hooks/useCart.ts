import {useCallback, useEffect, useReducer} from 'react';

import {getCartItems} from '../api/cartApi.js';
import {cartReducer} from '../domain/cartReducer.js';
import {loadSelectedCartItemIds, saveSelectedCartItemIds} from '../domain/selectionStorage.js';
import type {CartItem, CartItemId, CartState} from '../domain/types.js';

const initialCartState: CartState = {
  status: 'idle',
  items: [],
  selectedIds: [],
  errorMessage: '',
};

export function useCart() {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);

  const loadCartItems = useCallback(async () => {
    dispatch({type: 'fetchStart'});

    try {
      const cartItems = await getCartItems();
      const selectedIds = getInitialSelectedCartItemIds(cartItems);

      dispatch({type: 'fetchSuccess', payload: {items: cartItems, selectedIds}});
    } catch (error) {
      dispatch({type: 'fetchError', payload: {errorMessage: getCartErrorMessage(error)}});
    }
  }, []);

  useEffect(() => {
    void loadCartItems();
  }, [loadCartItems]);

  useEffect(() => {
    if (state.status !== 'success') return;

    saveSelectedCartItemIds(state.selectedIds);
  }, [state.status, state.selectedIds]);

  const toggleCartItem = useCallback((cartItemId: CartItemId) => {
    dispatch({type: 'toggleCartItem', payload: {cartItemId}});
  }, []);

  const toggleAllCartItems = useCallback(() => {
    dispatch({type: 'toggleAllCartItems'});
  }, []);

  return {
    state,
    loadCartItems,
    toggleCartItem,
    toggleAllCartItems,
  };
}

function getInitialSelectedCartItemIds(cartItems: CartItem[]) {
  const savedSelectedCartItemIds = loadSelectedCartItemIds();

  if (savedSelectedCartItemIds === null) {
    return cartItems.map((cartItem) => cartItem.id);
  }

  return getExistingSelectedCartItemIds(savedSelectedCartItemIds, cartItems);
}

function getExistingSelectedCartItemIds(selectedCartItemIds: CartItemId[], cartItems: CartItem[]) {
  return selectedCartItemIds.filter((selectedCartItemId) => {
    return cartItems.some((cartItem) => cartItem.id === selectedCartItemId);
  });
}

function getCartErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;

  return '장바구니를 불러오지 못했습니다.';
}
