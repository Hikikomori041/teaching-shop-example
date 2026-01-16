import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getAdminOrders, type AdminOrder } from '../../api/orders';
import { LoadingSpinner, EmptyState, PageContainer } from '../../components';
import AdminOrderCard from './AdminOrderCard';
import DailyRevenueChart from './DailyRevenueChart';

export default function AdminOrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      if (!token) return;

      try {
        const ordersData = await getAdminOrders(token);
        setOrders(ordersData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [token]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <PageContainer maxWidth="4xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Admin Panel - All Orders
      </h1>

      <div className="mb-8">
        <DailyRevenueChart orders={orders} />
      </div>

      {orders.length === 0 ? (
        <EmptyState message="No orders found." />
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <AdminOrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </PageContainer>
  );
}
