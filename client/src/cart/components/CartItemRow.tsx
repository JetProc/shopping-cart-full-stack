import styled from '@emotion/styled';
import {memo, useCallback} from 'react';

import {Checkbox} from '../../design-system/components/Checkbox.js';
import {NumericSpinner} from '../../design-system/components/NumericSpinner.js';
import {Typo} from '../../design-system/components/Typo.js';
import {theme} from '../../design-system/foundation/theme.js';
import {fontWeights, typography} from '../../design-system/foundation/typography.js';
import type {CartItem, CartItemId} from '../domain/types.js';

type CartItemRowProps = {
  cartItem: CartItem;
  checked: boolean;
  onChangeQuantity: (cartItemId: CartItemId, quantity: CartItem['quantity']) => void | Promise<void>;
  onDelete: (cartItemId: CartItemId) => void | Promise<void>;
  onToggle: (cartItemId: CartItemId) => void;
};

export const CartItemRow = memo(function CartItemRow({
  cartItem,
  checked,
  onChangeQuantity,
  onDelete,
  onToggle,
}: CartItemRowProps) {
  const {id, productInfo, quantity} = cartItem;

  const toggleCartItem = useCallback(() => {
    onToggle(id);
  }, [id, onToggle]);

  const deleteCartItem = useCallback(() => {
    void onDelete(id);
  }, [id, onDelete]);

  const changeCartItemQuantity = useCallback(
    (nextQuantity: CartItem['quantity']) => {
      void onChangeQuantity(id, nextQuantity);
    },
    [id, onChangeQuantity]
  );

  return (
    <Row>
      <CartItemActions
        checked={checked}
        onDelete={deleteCartItem}
        onToggle={toggleCartItem}
        productName={productInfo.name}
      />
      <Content>
        <ProductSummary productInfo={productInfo} />
        <ProductInfo>
          <ProductText productInfo={productInfo} />
          <CartItemQuantity onChange={changeCartItemQuantity} quantity={quantity} />
        </ProductInfo>
      </Content>
    </Row>
  );
});

type CartItemActionsProps = {
  checked: boolean;
  onDelete: () => void;
  onToggle: () => void;
  productName: string;
};

const CartItemActions = memo(function CartItemActions({
  checked,
  onDelete,
  onToggle,
  productName,
}: CartItemActionsProps) {
  return (
    <ActionArea>
      <Checkbox aria-label={`${productName} 선택`} checked={checked} onChange={onToggle} />
      <DeleteButton aria-label={`${productName} 삭제`} onClick={onDelete} type='button'>
        삭제
      </DeleteButton>
    </ActionArea>
  );
});

const ProductSummary = memo(function ProductSummary({productInfo}: Pick<CartItem, 'productInfo'>) {
  return <ProductImage alt={productInfo.name} src={productInfo.imageUrl} />;
});

const ProductText = memo(function ProductText({productInfo}: Pick<CartItem, 'productInfo'>) {
  return (
    <TextGroup>
      <Typo as='strong' variant='caption' weight='medium'>
        {productInfo.name}
      </Typo>
      <Typo as='strong' color='black' variant='display' weight='bold'>
        {productInfo.price.toLocaleString('ko-KR')}원
      </Typo>
    </TextGroup>
  );
});

type CartItemQuantityProps = {
  onChange: (quantity: CartItem['quantity']) => void;
  quantity: CartItem['quantity'];
};

const CartItemQuantity = memo(function CartItemQuantity({onChange, quantity}: CartItemQuantityProps) {
  return <NumericSpinner max={99} min={1} onChange={onChange} value={quantity} />;
});

const Row = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[12]};
  padding: ${theme.spacing[12]} 0 ${theme.spacing[20]};
  border-top: 1px solid ${theme.colors.gray100};
`;

const ActionArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: 112px minmax(0, 1fr);
  gap: ${theme.spacing[24]};
  align-items: center;
`;

const ProductInfo = styled.div`
  display: flex;
  min-width: 0;
  height: 112px;
  flex-direction: column;
  justify-content: space-around;
`;

const TextGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[4]};
`;

const ProductImage = styled.img`
  display: block;
  width: 112px;
  height: 112px;
  border-radius: ${theme.radius[8]};
  background: ${theme.colors.gray100};
  object-fit: cover;
`;

const DeleteButton = styled.button`
  padding: ${theme.spacing[4]} ${theme.spacing[8]};
  border: 1px solid ${theme.colors.blackAlpha10};
  border-radius: ${theme.radius[4]};
  background: ${theme.colors.white};
  color: ${theme.colors.gray900};
  cursor: pointer;
  font: inherit;
  font-size: ${typography.caption.fontSize};
  font-weight: ${fontWeights.medium};
  line-height: ${typography.caption.lineHeight};
  white-space: nowrap;
`;
