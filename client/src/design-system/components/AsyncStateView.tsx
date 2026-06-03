import styled from '@emotion/styled';
import type {ReactNode} from 'react';

import {theme} from '../foundation/theme.js';

type AsyncStatus = 'idle' | 'loading' | 'error' | 'empty' | 'success';

type AsyncStateViewProps = {
  children: ReactNode;
  emptyMessage?: string;
  errorMessage?: string;
  loadingMessage?: string;
  status: AsyncStatus;
};

export const AsyncStateView = ({
  children,
  emptyMessage = '표시할 내용이 없습니다.',
  errorMessage = '문제가 발생했습니다.',
  loadingMessage = '불러오는 중입니다.',
  status,
}: AsyncStateViewProps) => {
  if (status === 'loading') {
    return <Message>{loadingMessage}</Message>;
  }

  if (status === 'error') {
    return <Message>{errorMessage}</Message>;
  }

  if (status === 'empty') {
    return <Message>{emptyMessage}</Message>;
  }

  return <>{children}</>;
};

const Message = styled.p`
  margin: 0;
  padding: 32px 24px;
  color: ${theme.colors.gray900};
  text-align: center;
`;
