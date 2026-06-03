import {render, screen, waitFor, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {CartPage} from './CartPage.js';
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
    productInfo: {id: 'product-denim', name: '데님 팬츠', price: 100000, imageUrl: '/denim-pants.png'},
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

describe('CartPage', () => {
  test('선택한 장바구니 상품 기준으로 결제 요약과 하단 결제 버튼을 보여준다', async () => {
    const user = userEvent.setup();

    fetchMock.mockResolvedValue(createResponse(200, {body: cartItems}));

    render(<CartPage />);

    await screen.findByText('현재 2종류의 상품이 담겨있습니다.');

    const paymentSummary = screen.getByRole('region', {name: '결제 요약'});

    expect(within(paymentSummary).getByText('총 주문 금액이 100,000원 이상일 경우 무료 배송됩니다.')).toBeInTheDocument();
    expect(within(paymentSummary).getByText('주문 금액')).toBeInTheDocument();
    expect(within(paymentSummary).getByText('배송비')).toBeInTheDocument();
    expect(within(paymentSummary).getByText('0원')).toBeInTheDocument();
    expect(within(paymentSummary).getByText('총 결제 금액')).toBeInTheDocument();
    expect(within(paymentSummary).getAllByText('120,000원')).toHaveLength(2);
    expect(screen.getByRole('button', {name: '주문 확인'})).toBeEnabled();

    await user.click(screen.getByLabelText('전체 선택'));

    await waitFor(() => {
      expect(screen.getByRole('button', {name: '주문 확인'})).toBeDisabled();
    });

    expect(within(paymentSummary).getAllByText('0원')).toHaveLength(3);
  });
});
