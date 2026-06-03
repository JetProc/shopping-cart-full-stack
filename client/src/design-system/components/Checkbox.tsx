import styled from '@emotion/styled';
import type {InputHTMLAttributes, ReactNode} from 'react';

import {theme} from '../foundation/theme.js';
import {typography} from '../foundation/typography.js';

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label?: ReactNode;
};

export const Checkbox = ({label, ...props}: CheckboxProps) => {
  return (
    <Label>
      <Input type='checkbox' {...props} />
      <Box aria-hidden='true' />
      {label && <LabelText>{label}</LabelText>}
    </Label>
  );
};

const Label = styled.label`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing[8]};
  cursor: pointer;
`;

const Input = styled.input`
  position: absolute;
  width: 20px;
  height: 20px;
  margin: 0;
  opacity: 0;

  &:checked + span {
    border-color: ${theme.colors.black};
    background: ${theme.colors.black};
  }

  &:checked + span::after {
    display: block;
  }

  &:focus-visible + span {
    outline: 2px solid ${theme.colors.textPrimary};
    outline-offset: 2px;
  }
`;

const Box = styled.span`
  position: relative;
  width: 24px;
  height: 24px;
  border: 1px solid ${theme.colors.blackAlpha10};
  border-radius: ${theme.radius[8]};
  background: ${theme.colors.white};

  &::after {
    position: absolute;
    top: 4px;
    left: 8px;

    display: none;
    width: 6px;
    height: 12px;

    border-right: 2px solid ${theme.colors.white};
    border-bottom: 2px solid ${theme.colors.white};
    content: '';
    transform: rotate(45deg);
  }
`;

const LabelText = styled.span`
  color: ${theme.colors.textPrimary};
  font-size: ${typography.body.fontSize};
  line-height: ${typography.body.lineHeight};
`;
