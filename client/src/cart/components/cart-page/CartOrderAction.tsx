import {Button, FixedBottomAction} from '../../../design-system/index.js';

type CartOrderActionProps = {
  disabled: boolean;
  onClick?: () => void;
};

export const CartOrderAction = ({disabled, onClick}: CartOrderActionProps) => {
  return (
    <FixedBottomAction>
      <Button disabled={disabled} onClick={onClick}>
        주문 확인
      </Button>
    </FixedBottomAction>
  );
};
