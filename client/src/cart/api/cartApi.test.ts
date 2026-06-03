import {deleteCartItem, getCartItems, updateCartItemQuantity} from './cartApi.js';
import type {CartItem} from '../domain/types.js';

const fetchMock = jest.fn();

const cartItems: CartItem[] = [
  {
    id: 'cart-1',
    productInfo: {id: 'product-hoodie', name: '후드 집업', price: 10000, imageUrl: '/hoodie.png'},
    quantity: 2,
  },
];

beforeEach(() => {
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

describe('cartApi', () => {
  test('getCartItems는 장바구니 목록을 조회한다', async () => {
    fetchMock.mockResolvedValue(createResponse(200, {body: cartItems}));

    await expect(getCartItems()).resolves.toEqual(cartItems);
    expect(fetchMock).toHaveBeenCalledWith('https://paradi-easter.up.railway.app/carts', {
      headers: {'Content-Type': 'application/json'},
    });
  });

  test('updateCartItemQuantity는 장바구니 항목 수량을 변경한다', async () => {
    fetchMock.mockResolvedValue(createResponse(200, {body: {id: 'cart-1', quantity: 3}}));

    await expect(updateCartItemQuantity('cart-1', 3)).resolves.toEqual({id: 'cart-1', quantity: 3});
    expect(fetchMock).toHaveBeenCalledWith('https://paradi-easter.up.railway.app/carts/cart-1', {
      headers: {'Content-Type': 'application/json'},
      method: 'PATCH',
      body: JSON.stringify({quantity: 3}),
    });
  });

  test('deleteCartItem은 장바구니 항목을 삭제한다', async () => {
    fetchMock.mockResolvedValue(createResponse(204));

    await expect(deleteCartItem('cart-1')).resolves.toBeUndefined();
    expect(fetchMock).toHaveBeenCalledWith('https://paradi-easter.up.railway.app/carts/cart-1', {
      headers: {'Content-Type': 'application/json'},
      method: 'DELETE',
    });
  });

  test('에러 응답 메시지를 Error로 전달한다', async () => {
    fetchMock.mockResolvedValue(createResponse(400, {body: {message: '수량은 1 이상 99 이하의 정수여야 합니다.'}}));

    await expect(updateCartItemQuantity('cart-1', 100)).rejects.toThrow('수량은 1 이상 99 이하의 정수여야 합니다.');
  });

  test('에러 응답 메시지가 없으면 기본 Error 메시지를 전달한다', async () => {
    fetchMock.mockResolvedValue(createResponse(500, {body: {}}));

    await expect(getCartItems()).rejects.toThrow('장바구니 요청에 실패했습니다.');
  });

  test('에러 응답을 파싱할 수 없으면 기본 Error 메시지를 전달한다', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => {
        throw new Error('Invalid JSON');
      },
    } as unknown as Response);

    await expect(getCartItems()).rejects.toThrow('장바구니 요청에 실패했습니다.');
  });
});
