import {render, screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';

import {App} from './App.js';

describe('App', () => {
  test('초기 화면을 렌더링한다', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText('장바구니 앱 준비 완료')).toBeInTheDocument();
  });
});
