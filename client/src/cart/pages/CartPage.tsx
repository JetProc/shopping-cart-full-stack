import styled from '@emotion/styled';
import {useNavigate} from 'react-router-dom';

import {AsyncStateView} from '../../design-system/index.js';

import {CartItemList} from '../components/cart-item/CartItemList.js';
import {CartEmptyView} from '../components/cart-page/CartEmptyView.js';
import {CartErrorView} from '../components/cart-page/CartErrorView.js';
import {CartLoadingView} from '../components/cart-page/CartLoadingView.js';
import {CartOrderAction} from '../components/cart-page/CartOrderAction.js';
import {CartPageHeader} from '../components/cart-page/CartPageHeader.js';
import {PaymentSummary} from '../components/cart-page/PaymentSummary.js';
import {Header} from '../components/layout/Header.js';

import {useCart} from '../hooks/useCart.js';
import {getSelectedOrderAmount, getShippingFee, getTotalPrice} from '../domain/cartSelectors.js';
import type {CartState} from '../domain/types.js';

export const CartPage = () => {
  const navigate = useNavigate();
  const {changeCartItemQuantity, loadCartItems, removeCartItem, state, toggleAllCartItems, toggleCartItem} = useCart();
  const status = getCartPageStatus(state);
  const isAllSelected = isEveryCartItemSelected(state);
  const selectedOrderAmount = getSelectedOrderAmount(state);
  const shippingFee = getShippingFee(state);
  const totalPrice = getTotalPrice(state);

  const isPaymentButtonDisabled = totalPrice === 0;
  const isOrderActionVisible = status === 'success' || status === 'empty';

  return (
    <>
      <Header title='SHOP' />
      <Main>
        <CartPageHeader itemCount={status === 'success' ? state.items.length : null} />
        <AsyncStateView
          emptyFallback={<CartEmptyView />}
          errorFallback={<CartErrorView errorMessage={state.errorMessage} onRetry={loadCartItems} />}
          errorMessage={state.errorMessage}
          loadingFallback={<CartLoadingView />}
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
        {isOrderActionVisible && (
          <CartOrderAction disabled={isPaymentButtonDisabled} onClick={() => navigate('/order-confirm')} />
        )}
      </Main>
    </>
  );
};

function getCartPageStatus(state: CartState) {
  if (state.status === 'success' && state.items.length === 0) return 'empty';

  return state.status;
}

function isEveryCartItemSelected(state: CartState) {
  if (state.items.length === 0) return false;

  return state.items.every((cartItem) => state.selectedIds.includes(cartItem.id));
}

const Main = styled.main`
  display: flex;
  min-height: calc(100dvh - 64px);
  box-sizing: border-box;
  flex-direction: column;
  padding: 36px 24px;
  padding-bottom: calc(64px + 32px);
`;
