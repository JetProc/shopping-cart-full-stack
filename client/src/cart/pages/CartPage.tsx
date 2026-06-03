import styled from '@emotion/styled';

import {AsyncStateView} from '../../design-system/components/AsyncStateView.js';
import {Typo} from '../../design-system/components/Typo.js';
import {theme} from '../../design-system/foundation/theme.js';

import {Header} from '../components/Header.js';
import {useCart} from '../hooks/useCart.js';
import type {CartState} from '../domain/types.js';

export const CartPage = () => {
  const {state} = useCart();
  const status = getCartPageStatus(state);

  return (
    <>
      <Header title='SHOP' />
      <Main>
        <Typo as='h1' variant='display' weight='bold'>
          장바구니
        </Typo>
        <AsyncStateView
          emptyMessage='장바구니에 담긴 상품이 없습니다.'
          errorMessage={state.errorMessage}
          status={status}
        >
          <Typo as='p' color='gray900'>
            현재 {state.items.length}종류의 상품이 담겨있습니다.
          </Typo>
        </AsyncStateView>
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

const Main = styled.main`
  padding: ${theme.spacing[24]};
`;
