import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useProducts } from '../contexts/ProductsContext';
import { createOrder } from '../api/orders';
import toast from 'react-hot-toast';
import { PageContainer } from '../components';
import ProductPreview from './ProductPreview';
import PaymentForm from './PaymentForm';

export default function CheckoutPage() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { products } = useProducts();
  const [loading, setLoading] = useState(false);

  const product = products.find(p => p.id === Number(productId));

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Product not found</p>
      </div>
    );
  }

  const handlePayment = async (cardNumber: string) => {
    if (!token) return;

    setLoading(true);

    try {
      const order = await createOrder(token, product.id, cardNumber);
      toast.success('Order placed successfully!');
      navigate(`/order/${order.id}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Order failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer maxWidth="md">
      <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
        Checkout
      </h1>
      <ProductPreview product={product} />
      <PaymentForm
        onSubmit={handlePayment}
        loading={loading}
        price={product.price}
      />
    </PageContainer>
  );
}
