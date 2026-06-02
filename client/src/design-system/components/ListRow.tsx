import styled from '@emotion/styled';
import type {HTMLAttributes, ReactNode} from 'react';

import {theme} from '../foundation/theme.js';

type ListRowProps = HTMLAttributes<HTMLDivElement> & {
  border?: boolean;
  contents: ReactNode;
  left?: ReactNode;
  right?: ReactNode;
};

export const ListRow = ({border = true, contents, left, right, ...props}: ListRowProps) => {
  return (
    <Container $border={border} {...props}>
      <Slot>{left}</Slot>
      <Contents>{contents}</Contents>
      <Slot>{right}</Slot>
    </Container>
  );
};

const Container = styled.div<{
  $border: boolean;
}>`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: ${theme.spacing[12]};
  padding: ${theme.spacing[16]} 0;
  border-bottom: ${({$border}) => ($border ? `1px solid ${theme.colors.gray100}` : 0)};
`;

const Contents = styled.div`
  min-width: 0;
`;

const Slot = styled.div`
  display: flex;
  align-items: center;
`;
