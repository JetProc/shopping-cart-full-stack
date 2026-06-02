import {Route, Routes} from 'react-router-dom';

export const App = () => {
  return (
    <Routes>
      <Route path='/' element={<div>장바구니 앱 준비 완료</div>} />
    </Routes>
  );
};
