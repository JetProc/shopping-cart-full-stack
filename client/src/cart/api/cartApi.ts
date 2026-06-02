import type {CartItem, CartItemId} from '../domain/types.js';

const API_BASE_URL = 'http://localhost:3000';
const DEFAULT_CART_API_ERROR_MESSAGE = '장바구니 요청에 실패했습니다.';

type ApiResponse<T> = {
  body: T;
};

type UpdatedCartItemQuantity = Pick<CartItem, 'id' | 'quantity'>;

export async function getCartItems(): Promise<CartItem[]> {
  return requestCartApi('/carts');
}

export async function updateCartItemQuantity(
  cartItemId: CartItemId,
  quantity: number
): Promise<UpdatedCartItemQuantity> {
  return requestCartApi(`/carts/${cartItemId}`, {
    method: 'PATCH',
    body: JSON.stringify({quantity}),
  });
}

export async function deleteCartItem(cartItemId: CartItemId): Promise<void> {
  await requestCartApiWithoutBody(`/carts/${cartItemId}`, {
    method: 'DELETE',
  });
}

async function requestCartApi<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await requestCartResponse(path, options);
  const data = (await response.json()) as ApiResponse<T>;

  return data.body;
}

async function requestCartApiWithoutBody(path: string, options: RequestInit = {}): Promise<void> {
  await requestCartResponse(path, options);
}

async function requestCartResponse(path: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {'Content-Type': 'application/json'},
    ...options,
  });

  if (!response.ok) {
    throw new Error(await getCartApiErrorMessage(response));
  }

  return response;
}

async function getCartApiErrorMessage(response: Response) {
  try {
    const data = (await response.json()) as ApiResponse<{message?: string}>;

    return data.body?.message ?? DEFAULT_CART_API_ERROR_MESSAGE;
  } catch {
    return DEFAULT_CART_API_ERROR_MESSAGE;
  }
}
