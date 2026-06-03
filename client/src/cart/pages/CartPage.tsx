import styled from '@emotion/styled';

import {AsyncStateView} from '../../design-system/components/AsyncStateView.js';
import {Button} from '../../design-system/components/Button.js';
import {Checkbox} from '../../design-system/components/Checkbox.js';
import {FixedBottomAction} from '../../design-system/components/FixedBottomAction.js';
import {Typo} from '../../design-system/components/Typo.js';
import {theme} from '../../design-system/foundation/theme.js';
import {fontWeights, typography} from '../../design-system/foundation/typography.js';

import {CartItemRow} from '../components/CartItemRow.js';
import {Header} from '../components/Header.js';
import {
  getSelectedOrderAmount,
  FREE_SHIPPING_THRESHOLD,
  getShippingFee,
  getTotalPrice,
} from '../domain/cartSelectors.js';
import {useCart} from '../hooks/useCart.js';
import type {CartState} from '../domain/types.js';

export const CartPage = () => {
  return (
    <>
      <Header title='SHOP' />
      <Main>
        <TitleArea>
          <Typo as='h1' variant='display' weight='bold'>
            장바구니
          </Typo>
        </TitleArea>
        <CartContent />
      </Main>
    </>
  );
};

const CartContent = () => {
  const {changeCartItemQuantity, removeCartItem, state, toggleAllCartItems, toggleCartItem} = useCart();
  const status = getCartPageStatus(state);
  const isAllSelected = isEveryCartItemSelected(state);
  const selectedOrderAmount = getSelectedOrderAmount(state);
  const shippingFee = getShippingFee(state);
  const totalPrice = getTotalPrice(state);
  const isPaymentButtonDisabled = totalPrice === 0;

  return (
    <>
      {status === 'success' && (
        <ItemCountText as='p' color='gray900' variant='caption' weight='medium'>
          현재 {state.items.length}종류의 상품이 담겨있습니다.
        </ItemCountText>
      )}
      <AsyncStateView emptyMessage='장바구니에 담긴 상품이 없습니다.' errorMessage={state.errorMessage} status={status}>
        <SelectAllArea>
          <Checkbox
            checked={isAllSelected}
            label='전체 선택'
            onChange={() => {
              toggleAllCartItems();
            }}
          />
        </SelectAllArea>
        <ItemList>
          {state.items.map((cartItem) => (
            <CartItemRow
              key={cartItem.id}
              cartItem={cartItem}
              checked={state.selectedIds.includes(cartItem.id)}
              onChangeQuantity={changeCartItemQuantity}
              onDelete={removeCartItem}
              onToggle={toggleCartItem}
            />
          ))}
        </ItemList>
        <PaymentSummary selectedOrderAmount={selectedOrderAmount} shippingFee={shippingFee} totalPrice={totalPrice} />
      </AsyncStateView>
      {status === 'success' && (
        <FixedBottomAction>
          <Button disabled={isPaymentButtonDisabled}>주문 확인</Button>
        </FixedBottomAction>
      )}
    </>
  );
};

type PaymentSummaryProps = {
  selectedOrderAmount: number;
  shippingFee: number;
  totalPrice: number;
};

const PaymentSummary = ({selectedOrderAmount, shippingFee, totalPrice}: PaymentSummaryProps) => {
  return (
    <SummaryArea aria-label='결제 요약'>
      <FreeShippingNotice>
        <NoticeIcon aria-hidden='true'>i</NoticeIcon>
        <NoticeText as='p' variant='caption' weight='medium'>
          총 주문 금액이 {formatPrice(FREE_SHIPPING_THRESHOLD)}원 이상일 경우 무료 배송됩니다.
        </NoticeText>
      </FreeShippingNotice>
      <SummaryDivider />
      <SummaryRow>
        <SummaryLabel>주문 금액</SummaryLabel>
        <SummaryAmount>{formatPrice(selectedOrderAmount)}원</SummaryAmount>
      </SummaryRow>
      <SummaryRow>
        <SummaryLabel>배송비</SummaryLabel>
        <SummaryAmount>{formatPrice(shippingFee)}원</SummaryAmount>
      </SummaryRow>
      <SummaryDivider />
      <TotalSummaryRow>
        <SummaryLabel>총 결제 금액</SummaryLabel>
        <SummaryAmount>{formatPrice(totalPrice)}원</SummaryAmount>
      </TotalSummaryRow>
    </SummaryArea>
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

function formatPrice(price: number) {
  return price.toLocaleString('ko-KR');
}

const Main = styled.main`
  padding: ${theme.spacing[36]} ${theme.spacing[24]};
  padding-bottom: calc(64px + ${theme.spacing[32]});
`;

const TitleArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[16]};
`;

const ItemCountText = styled(Typo)`
  margin-top: ${theme.spacing[16]};
`;

const SelectAllArea = styled.div`
  margin-top: ${theme.spacing[36]};
`;

const ItemList = styled.div`
  margin-top: ${theme.spacing[20]};
`;

const SummaryArea = styled.section`
  margin-top: ${theme.spacing[32]};
`;

const FreeShippingNotice = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[8]};
`;

const NoticeIcon = styled.span`
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;

  width: 20px;
  height: 20px;

  border: 2px solid ${theme.colors.black};
  border-radius: ${theme.radius[999]};

  color: ${theme.colors.black};
  font-size: ${typography.caption.fontSize};
  font-weight: ${fontWeights.bold};
  line-height: 1;
`;

const NoticeText = styled(Typo)`
  flex: 1;
  min-width: 0;
`;

const SummaryRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing[16]};

  & + & {
    margin-top: ${theme.spacing[24]};
  }
`;

const SummaryDivider = styled.hr`
  height: 1px;
  margin: ${theme.spacing[24]} 0;
  border: 0;
  background: ${theme.colors.gray100};
`;

const SummaryLabel = styled.span`
  color: ${theme.colors.textPrimary};
  font-size: ${typography.body.fontSize};
  font-weight: ${fontWeights.bold};
  line-height: ${typography.body.fontSize};
  vertical-align: middle;
`;

const SummaryAmount = styled.span`
  color: ${theme.colors.black};
  font-size: ${typography.display.fontSize};
  font-weight: ${fontWeights.bold};
  line-height: ${typography.display.lineHeight};
  text-align: right;
  vertical-align: middle;
  white-space: nowrap;
`;

const TotalSummaryRow = styled(SummaryRow)`
  margin-top: 0;
`;
