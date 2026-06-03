import styled from '@emotion/styled';

import {AsyncStateView} from '../../design-system/components/AsyncStateView.js';

import {CartItemList} from '../components/CartItemList.js';
import {CartOrderAction} from '../components/CartOrderAction.js';
import {CartPageHeader} from '../components/CartPageHeader.js';
import {Header} from '../components/Header.js';
import {PaymentSummary} from '../components/PaymentSummary.js';
import {getSelectedOrderAmount, getShippingFee, getTotalPrice} from '../domain/cartSelectors.js';
import {useCart} from '../hooks/useCart.js';
import type {CartState} from '../domain/types.js';

export const CartPage = () => {
  const {changeCartItemQuantity, removeCartItem, state, toggleAllCartItems, toggleCartItem} = useCart();
  const status = getCartPageStatus(state);
  const isAllSelected = isEveryCartItemSelected(state);
  const selectedOrderAmount = getSelectedOrderAmount(state);
  const shippingFee = getShippingFee(state);
  const totalPrice = getTotalPrice(state);

  const isPaymentButtonDisabled = totalPrice === 0;

  return (
    <>
      <Header title='SHOP' />
      <Main>
        <CartPageHeader itemCount={status === 'success' ? state.items.length : null} />
        <AsyncStateView
          emptyMessage='장바구니에 담긴 상품이 없습니다.'
          errorMessage={state.errorMessage}
          status={status}
        >
          <CartItemList
            items={state.items}
            selectedIds={state.selectedIds}
            isAllSelected={isAllSelected}
            onChangeQuantity={changeCartItemQuantity}
            onDelete={removeCartItem}
            onToggleAll={toggleAllCartItems}
            onToggleItem={toggleCartItem}
          />
          <PaymentSummary selectedOrderAmount={selectedOrderAmount} shippingFee={shippingFee} totalPrice={totalPrice} />
        </AsyncStateView>
        {status === 'success' && <CartOrderAction disabled={isPaymentButtonDisabled} />}
      </Main>
    </>
  );
};

function getCartPageStatus(state: CartState) {
  if (state.status === 'idle') return 'loading';
  if (state.status === 'loading') return 'loading';
  if (state.status === 'error') return 'error';
  if (state.status === 'success' && state.items.length === 0) return 'empty';

  return 'success';
}

function isEveryCartItemSelected(state: CartState) {
  if (state.items.length === 0) return false;

  return state.items.every((cartItem) => state.selectedIds.includes(cartItem.id));
}

const Main = styled.main`
  padding: 36px 24px;
  padding-bottom: calc(64px + 32px);
`;
