import styled from '@emotion/styled';

import {AsyncStateView} from '../../design-system/components/AsyncStateView.js';
import {Checkbox} from '../../design-system/components/Checkbox.js';
import {Typo} from '../../design-system/components/Typo.js';
import {theme} from '../../design-system/foundation/theme.js';

import {CartItemRow} from '../components/CartItemRow.js';
import {Header} from '../components/Header.js';
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
      </AsyncStateView>
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
  padding: ${theme.spacing[36]} ${theme.spacing[24]};
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
