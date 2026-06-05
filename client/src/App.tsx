import {Navigate, Route, Routes} from 'react-router-dom';

import {PhoneView} from './cart/components/layout/PhoneView.js';
import {CartProvider} from './cart/hooks/useCart.js';
import {CartPage} from './cart/pages/CartPage.js';
import {OrderConfirmPage} from './cart/pages/OrderConfirmPage.js';

export const App = () => {
  return (
    <CartProvider>
      <PhoneView>
        <Routes>
          <Route path='/' element={<Navigate replace to='/cart' />} />
          <Route path='/cart' element={<CartPage />} />
          <Route path='/order-confirm' element={<OrderConfirmPage />} />
        </Routes>
      </PhoneView>
    </CartProvider>
  );
};
