import styled from '@emotion/styled';

import {Checkbox} from '../../design-system/components/Checkbox.js';
import {CartItemRow} from './CartItemRow.js';
import type {CartItem, CartItemId} from '../domain/types.js';

type CartItemListProps = {
  items: CartItem[];
  selectedIds: CartItemId[];
  isAllSelected: boolean;
  onChangeQuantity: (cartItemId: CartItemId, quantity: CartItem['quantity']) => void | Promise<void>;
  onDelete: (cartItemId: CartItemId) => void | Promise<void>;
  onToggleAll: () => void;
  onToggleItem: (cartItemId: CartItemId) => void;
};

export const CartItemList = ({
  items,
  selectedIds,
  isAllSelected,
  onChangeQuantity,
  onDelete,
  onToggleAll,
  onToggleItem,
}: CartItemListProps) => {
  return (
    <>
      <SelectAllArea>
        <Checkbox checked={isAllSelected} label='전체 선택' onChange={onToggleAll} />
      </SelectAllArea>
      <ItemListArea>
        {items.map((cartItem) => (
          <CartItemRow
            key={cartItem.id}
            cartItem={cartItem}
            checked={selectedIds.includes(cartItem.id)}
            onChangeQuantity={onChangeQuantity}
            onDelete={onDelete}
            onToggle={onToggleItem}
          />
        ))}
      </ItemListArea>
    </>
  );
};

const SelectAllArea = styled.div`
  margin-top: 36px;
`;

const ItemListArea = styled.div`
  margin-top: 20px;
`;
