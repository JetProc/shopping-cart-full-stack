import {act, renderHook, waitFor} from '@testing-library/react';

import {useCart} from './useCart.js';
import type {CartItem} from '../domain/types.js';

const fetchMock = jest.fn();

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

beforeEach(() => {
  localStorage.clear();
  fetchMock.mockReset();
  globalThis.fetch = fetchMock as unknown as typeof fetch;
});

function createResponse(status: number, body?: unknown) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as Response;
}

describe('useCart', () => {
  test('저장된 선택 상태가 없으면 장바구니 조회 후 전체 선택한다', async () => {
    fetchMock.mockResolvedValue(createResponse(200, {body: cartItems}));

    const {result} = renderHook(() => useCart());

    await waitFor(() => {
      expect(result.current.state.status).toBe('success');
    });

    expect(result.current.state.items).toEqual(cartItems);
    expect(result.current.state.selectedIds).toEqual(['cart-1', 'cart-2']);
  });

  test('저장된 빈 선택 상태가 있으면 전체 해제 상태를 유지한다', async () => {
    localStorage.setItem('shopping-cart-selected-cart-item-ids', JSON.stringify([]));
    fetchMock.mockResolvedValue(createResponse(200, {body: cartItems}));

    const {result} = renderHook(() => useCart());

    await waitFor(() => {
      expect(result.current.state.status).toBe('success');
    });

    expect(result.current.state.selectedIds).toEqual([]);
  });

  test('저장된 선택 id 중 삭제된 장바구니 항목 id는 제외한다', async () => {
    localStorage.setItem('shopping-cart-selected-cart-item-ids', JSON.stringify(['cart-2', 'cart-999']));
    fetchMock.mockResolvedValue(createResponse(200, {body: cartItems}));

    const {result} = renderHook(() => useCart());

    await waitFor(() => {
      expect(result.current.state.status).toBe('success');
    });

    expect(result.current.state.selectedIds).toEqual(['cart-2']);
  });

  test('장바구니 조회에 실패하면 에러 상태로 변경한다', async () => {
    fetchMock.mockResolvedValue(createResponse(500, {body: {message: '장바구니를 불러오지 못했습니다.'}}));

    const {result} = renderHook(() => useCart());

    await waitFor(() => {
      expect(result.current.state.status).toBe('error');
    });

    expect(result.current.state.errorMessage).toBe('장바구니를 불러오지 못했습니다.');
  });

  test('장바구니 조회 실패 후 다시 조회하면 성공 상태로 복구한다', async () => {
    fetchMock
      .mockResolvedValueOnce(createResponse(500, {body: {message: '장바구니를 불러오지 못했습니다.'}}))
      .mockResolvedValueOnce(createResponse(200, {body: cartItems}));

    const {result} = renderHook(() => useCart());

    await waitFor(() => {
      expect(result.current.state.status).toBe('error');
    });

    expect(result.current.state.errorMessage).toBe('장바구니를 불러오지 못했습니다.');

    await act(async () => {
      await result.current.loadCartItems();
    });

    await waitFor(() => {
      expect(result.current.state.status).toBe('success');
    });

    expect(result.current.state.items).toEqual(cartItems);
    expect(result.current.state.selectedIds).toEqual(['cart-1', 'cart-2']);
    expect(result.current.state.errorMessage).toBe('');
  });

  test('개별 장바구니 항목 선택을 변경하고 저장한다', async () => {
    fetchMock.mockResolvedValue(createResponse(200, {body: cartItems}));

    const {result} = renderHook(() => useCart());

    await waitFor(() => {
      expect(result.current.state.status).toBe('success');
    });

    act(() => {
      result.current.toggleCartItem('cart-1');
    });

    await waitFor(() => {
      expect(result.current.state.selectedIds).toEqual(['cart-2']);
    });

    expect(localStorage.getItem('shopping-cart-selected-cart-item-ids')).toBe(JSON.stringify(['cart-2']));
  });

  test('전체 장바구니 항목 선택을 변경하고 저장한다', async () => {
    fetchMock.mockResolvedValue(createResponse(200, {body: cartItems}));

    const {result} = renderHook(() => useCart());

    await waitFor(() => {
      expect(result.current.state.status).toBe('success');
    });

    act(() => {
      result.current.toggleAllCartItems();
    });

    await waitFor(() => {
      expect(result.current.state.selectedIds).toEqual([]);
    });

    expect(localStorage.getItem('shopping-cart-selected-cart-item-ids')).toBe(JSON.stringify([]));
  });
});
