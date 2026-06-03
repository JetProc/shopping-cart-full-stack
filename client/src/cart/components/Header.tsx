import styled from '@emotion/styled';
import {memo} from 'react';

import {Typo} from '../../design-system/components/Typo.js';
import {theme} from '../../design-system/foundation/theme.js';

type HeaderProps = {
  title: string;
};

export const Header = memo(function Header({title}: HeaderProps) {
  return (
    <Container>
      <Typo as='span' color='white' variant='headline' weight='bold'>
        {title}
      </Typo>
    </Container>
  );
});

const Container = styled.header`
  display: flex;
  align-items: center;
  min-height: 64px;
  padding: 0 ${theme.spacing[24]};
  background: ${theme.colors.black};
`;
