import styled from '@emotion/styled';

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

export const CartItemRow = ({cartItem, checked, onChangeQuantity, onDelete, onToggle}: CartItemRowProps) => {
  const {id, productInfo, quantity} = cartItem;

  const handleDeleteClick = () => {
    const isDeleteConfirmed = window.confirm('상품을 삭제하시겠습니까?');

    if (!isDeleteConfirmed) return;

    void onDelete(id);
  };

  return (
    <Row>
      <ActionArea>
        <Checkbox aria-label='선택' checked={checked} onChange={() => onToggle(id)} />
        <DeleteButton aria-label='삭제' onClick={handleDeleteClick} type='button'>
          삭제
        </DeleteButton>
      </ActionArea>
      <Content>
        <ProductImage alt={productInfo.name} src={productInfo.imageUrl} />
        <ProductInfo>
          <TextGroup>
            <Typo as='strong' variant='caption' weight='medium'>
              {productInfo.name}
            </Typo>
            <Typo as='strong' color='black' variant='display' weight='bold'>
              {productInfo.price.toLocaleString('ko-KR')}원
            </Typo>
          </TextGroup>
          <NumericSpinner
            max={99}
            min={1}
            onChange={(nextQuantity) => {
              void onChangeQuantity(id, nextQuantity);
            }}
            value={quantity}
          />
        </ProductInfo>
      </Content>
    </Row>
  );
};

const Row = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px 0 20px;
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
  gap: 24px;
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
  gap: 4px;
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
  padding: 4px 8px;
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
