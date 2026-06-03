import {Navigate, Route, Routes} from 'react-router-dom';

import {PhoneView} from './cart/components/PhoneView.js';
import {CartPage} from './cart/pages/CartPage.js';

export const App = () => {
  return (
    <PhoneView>
      <Routes>
        <Route path='/' element={<Navigate replace to='/cart' />} />
        <Route path='/cart' element={<CartPage />} />
      </Routes>
    </PhoneView>
  );
};
