import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header, ProtectedLayout, AdminLayout } from './layouts';
import HomePage from './home/page';
import LoginPage from './auth/login/page';
import RegisterPage from './auth/register/page';
import CheckoutPage from './checkout/page';
import OrderConfirmationPage from './orders/order/page';
import MyOrdersPage from './orders/page';
import AdminOrdersPage from './admin/orders/page';

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<ProtectedLayout />}>
          <Route path="/checkout/:productId" element={<CheckoutPage />} />
          <Route path="/order/:orderId" element={<OrderConfirmationPage />} />
          <Route path="/orders" element={<MyOrdersPage />} />
        </Route>
        <Route path="/admin-panel" element={<AdminLayout />}>
          <Route index element={<AdminOrdersPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
