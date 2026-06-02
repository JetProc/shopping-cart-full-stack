import styled from '@emotion/styled';

import {theme} from '../foundation/theme.js';
import {fontWeights, typography} from '../foundation/typography.js';

type NumericSpinnerProps = {
  disabled?: boolean;
  max: number;
  min: number;
  onChange: (value: number) => void;
  value: number;
};

export const NumericSpinner = ({disabled = false, max, min, onChange, value}: NumericSpinnerProps) => {
  const isDecreaseDisabled = disabled || value <= min;
  const isIncreaseDisabled = disabled || value >= max;

  return (
    <Container aria-label='숫자 변경' role='group'>
      <ControlButton
        aria-label='숫자 감소'
        disabled={isDecreaseDisabled}
        onClick={() => onChange(value - 1)}
        type='button'
      >
        -
      </ControlButton>
      <ValueText aria-live='polite'>{value}</ValueText>
      <ControlButton
        aria-label='숫자 증가'
        disabled={isIncreaseDisabled}
        onClick={() => onChange(value + 1)}
        type='button'
      >
        +
      </ControlButton>
    </Container>
  );
};

const Container = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing[16]};
`;

const ControlButton = styled.button`
  width: 24px;
  height: 24px;
  border: 1px solid ${theme.colors.blackAlpha10};
  border-radius: ${theme.radius[8]};
  background: ${theme.colors.white};
  color: ${theme.colors.gray900};
  cursor: pointer;
  font-size: ${typography.body.fontSize};
  line-height: ${typography.body.lineHeight};

  &:disabled {
    color: ${theme.colors.gray300};
    cursor: not-allowed;
  }
`;

const ValueText = styled.span`
  color: ${theme.colors.textPrimary};
  font-size: ${typography.caption.fontSize};
  font-weight: ${fontWeights.medium};
  line-height: ${typography.caption.lineHeight};
  text-align: center;
`;
