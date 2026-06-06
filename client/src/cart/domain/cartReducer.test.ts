import {cartReducer} from './cartReducer.js';
import type {CartItem, CartState} from './types.js';

const cartItems: CartItem[] = [
  {
    id: 'cart-1',
    productInfo: {id: 'product-hoodie', name: '후드 집업', price: 10000, imageUrl: '/hoodie.png'},
    quantity: 2,
  },
  {
    id: 'cart-2',
    productInfo: {id: 'product-denim', name: '데님 팬츠', price: 30000, imageUrl: '/denim-pants.png'},
    quantity: 1,
  },
];

const cartState: CartState = {
  status: 'success',
  items: cartItems,
  selectedIds: ['cart-1'],
  errorMessage: '',
};

describe('cartReducer', () => {
  test('fetchStart는 로딩 상태로 변경하고 에러 메시지를 초기화한다', () => {
    const state = {...cartState, errorMessage: '에러'};

    const result = cartReducer(state, {type: 'fetchStart'});

    expect(result.status).toBe('loading');
    expect(result.errorMessage).toBe('');
  });

  test('fetchSuccess는 장바구니 상품과 선택 id를 저장하고 에러 메시지를 초기화한다', () => {
    const state = {...cartState, errorMessage: '이전 에러'};

    const result = cartReducer(state, {
      type: 'fetchSuccess',
      payload: {items: cartItems, selectedIds: ['cart-1', 'cart-2']},
    });

    expect(result.status).toBe('success');
    expect(result.items).toEqual(cartItems);
    expect(result.selectedIds).toEqual(['cart-1', 'cart-2']);
    expect(result.errorMessage).toBe('');
  });

  test('fetchError는 에러 상태와 에러 메시지를 저장한다', () => {
    const result = cartReducer(cartState, {
      type: 'fetchError',
      payload: {errorMessage: '장바구니를 불러오지 못했습니다.'},
    });

    expect(result.status).toBe('error');
    expect(result.errorMessage).toBe('장바구니를 불러오지 못했습니다.');
  });

  test('changeSelectedCartItemIds는 선택 id 목록을 변경한다', () => {
    const result = cartReducer(cartState, {
      type: 'changeSelectedCartItemIds',
      payload: {selectedIds: ['cart-2']},
    });

    expect(result.selectedIds).toEqual(['cart-2']);
  });

  test('updateCartItemQuantity는 해당 상품의 수량만 변경한다', () => {
    const result = cartReducer(cartState, {
      type: 'updateCartItemQuantity',
      payload: {cartItemId: 'cart-1', quantity: 5},
    });

    expect(result.items[0].quantity).toBe(5);
    expect(result.items[1].quantity).toBe(1);
  });

  test('deleteCartItem은 상품과 선택 id를 함께 제거한다', () => {
    const state = {...cartState, selectedIds: ['cart-1', 'cart-2']};

    const result = cartReducer(state, {
      type: 'deleteCartItem',
      payload: {cartItemId: 'cart-1'},
    });

    expect(result.items).toEqual([cartItems[1]]);
    expect(result.selectedIds).toEqual(['cart-2']);
  });
});
