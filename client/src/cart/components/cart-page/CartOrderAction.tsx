import {Button} from '../../../design-system/components/Button.js';
import {FixedBottomAction} from '../../../design-system/components/FixedBottomAction.js';

type CartOrderActionProps = {
  disabled: boolean;
};

export const CartOrderAction = ({disabled}: CartOrderActionProps) => {
  return (
    <FixedBottomAction>
      <Button disabled={disabled}>주문 확인</Button>
    </FixedBottomAction>
  );
};
