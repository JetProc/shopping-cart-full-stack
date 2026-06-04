import styled from '@emotion/styled';
import type {ReactNode} from 'react';

import {theme} from '../foundation/theme.js';

type AsyncStatus = 'loading' | 'error' | 'empty' | 'success';

type AsyncStateViewProps = {
  children: ReactNode;
  emptyFallback?: ReactNode;
  emptyMessage?: string;
  errorFallback?: ReactNode;
  errorMessage?: string;
  loadingFallback?: ReactNode;
  loadingMessage?: string;
  status: AsyncStatus;
};

export const AsyncStateView = ({
  children,
  emptyFallback,
  emptyMessage = '표시할 내용이 없습니다.',
  errorFallback,
  errorMessage = '문제가 발생했습니다.',
  loadingFallback,
  loadingMessage = '불러오는 중입니다.',
  status,
}: AsyncStateViewProps) => {
  if (status === 'loading') {
    if (loadingFallback !== undefined) return <>{loadingFallback}</>;

    return <Message>{loadingMessage}</Message>;
  }

  if (status === 'error') {
    if (errorFallback !== undefined) return <>{errorFallback}</>;

    return <Message>{errorMessage}</Message>;
  }

  if (status === 'empty') {
    if (emptyFallback !== undefined) return <>{emptyFallback}</>;

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
