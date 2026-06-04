import {useCallback, useEffect, useReducer} from 'react';

import {deleteCartItem, getCartItems, updateCartItemQuantity} from '../api/cartApi.js';
import {cartReducer} from '../domain/cartReducer.js';
import {loadSelectedCartItemIds, saveSelectedCartItemIds} from '../domain/selectionStorage.js';
import type {CartItem, CartItemId, CartState} from '../domain/types.js';

const initialCartState: CartState = {
  status: 'loading',
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
      const selectedIds = createInitialSelectedCartItemIds(cartItems);

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

  const changeCartItemQuantity = useCallback(async (cartItemId: CartItemId, quantity: CartItem['quantity']) => {
    try {
      const updatedCartItem = await updateCartItemQuantity(cartItemId, quantity);

      dispatch({
        type: 'updateCartItemQuantity',
        payload: {
          cartItemId: updatedCartItem.id,
          quantity: updatedCartItem.quantity,
        },
      });
    } catch (error) {
      dispatch({type: 'fetchError', payload: {errorMessage: getCartErrorMessage(error)}});
    }
  }, []);

  const removeCartItem = useCallback(async (cartItemId: CartItemId) => {
    try {
      await deleteCartItem(cartItemId);

      dispatch({type: 'deleteCartItem', payload: {cartItemId}});
    } catch (error) {
      dispatch({type: 'fetchError', payload: {errorMessage: getCartErrorMessage(error)}});
    }
  }, []);

  return {
    state,
    loadCartItems,
    toggleCartItem,
    toggleAllCartItems,
    changeCartItemQuantity,
    removeCartItem,
  };
}

function createInitialSelectedCartItemIds(cartItems: CartItem[]) {
  const savedSelectedCartItemIds = loadSelectedCartItemIds();
  const currentCartItemIds = cartItems.map((cartItem) => cartItem.id);

  if (savedSelectedCartItemIds === null) {
    //이전에 선택된 정보가 없다면(첫 진입) 전체 선택이 기본값
    return currentCartItemIds;
  }

  return savedSelectedCartItemIds.filter((selectedCartItemId) => currentCartItemIds.includes(selectedCartItemId));
}

function getCartErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;

  return '장바구니를 불러오지 못했습니다.';
}
