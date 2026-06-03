import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {CartItemRow} from './CartItemRow.js';
import type {CartItem} from '../domain/types.js';

const cartItem: CartItem = {
  id: 'cart-1',
  productInfo: {id: 'product-hoodie', name: '후드 집업', price: 10000, imageUrl: '/hoodie.png'},
  quantity: 2,
};

const defaultProps = {
  cartItem,
  checked: true,
  onChangeQuantity: jest.fn(),
  onDelete: jest.fn(),
  onToggle: jest.fn(),
};

beforeEach(() => {
  jest.restoreAllMocks();
});

describe('CartItemRow', () => {
  test('삭제를 확인하면 장바구니 항목 삭제를 요청한다', async () => {
    const user = userEvent.setup();
    const onDelete = jest.fn();

    jest.spyOn(window, 'confirm').mockReturnValue(true);

    render(<CartItemRow {...defaultProps} onDelete={onDelete} />);

    await user.click(screen.getByRole('button', {name: '삭제'}));

    expect(window.confirm).toHaveBeenCalledWith('상품을 삭제하시겠습니까?');
    expect(onDelete).toHaveBeenCalledWith('cart-1');
  });

  test('삭제를 취소하면 장바구니 항목 삭제를 요청하지 않는다', async () => {
    const user = userEvent.setup();
    const onDelete = jest.fn();

    jest.spyOn(window, 'confirm').mockReturnValue(false);

    render(<CartItemRow {...defaultProps} onDelete={onDelete} />);

    await user.click(screen.getByRole('button', {name: '삭제'}));

    expect(window.confirm).toHaveBeenCalledWith('상품을 삭제하시겠습니까?');
    expect(onDelete).not.toHaveBeenCalled();
  });
});
