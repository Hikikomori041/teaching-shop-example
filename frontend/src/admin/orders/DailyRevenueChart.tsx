import { useMemo } from 'react';
import type { AdminOrder } from '../../api/orders';

type Props = {
  orders: AdminOrder[];
};

interface DailyRevenue {
  date: string;
  displayDate: string;
  revenue: number;
}

function formatDisplayDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatRevenue(amount: number): string {
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(1)}K`;
  }
  return `$${amount.toFixed(0)}`;
}

function calculateDailyRevenue(orders: AdminOrder[]): DailyRevenue[] {
  const paidOrders = orders.filter(order => order.status === 'paid');

  const revenueByDay = paidOrders.reduce(
    (acc, order) => {
      const date = order.created_at.split('T')[0];
      const price = parseFloat(order.product_price);
      acc[date] = (acc[date] || 0) + price;
      return acc;
    },
    {} as Record<string, number>
  );

  return Object.entries(revenueByDay)
    .map(([date, revenue]) => ({
      date,
      displayDate: formatDisplayDate(date),
      revenue,
    }))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-14); // Last 14 days max
}

export default function DailyRevenueChart({ orders }: Props) {
  const dailyRevenue = useMemo(() => calculateDailyRevenue(orders), [orders]);

  const maxRevenue = useMemo(
    () => Math.max(...dailyRevenue.map(d => d.revenue), 1),
    [dailyRevenue]
  );

  const totalRevenue = useMemo(
    () => dailyRevenue.reduce((sum, d) => sum + d.revenue, 0),
    [dailyRevenue]
  );

  if (dailyRevenue.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Daily Revenue
        </h2>
        <p className="text-gray-500 text-center py-8">No revenue data yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Daily Revenue</h2>
        <p className="text-sm text-gray-500">
          Total:{' '}
          <span className="font-semibold text-gray-800">
            ${totalRevenue.toFixed(2)}
          </span>
        </p>
      </div>

      <div className="flex items-end gap-1 sm:gap-2 h-48">
        {dailyRevenue.map(day => {
          const heightPercent = (day.revenue / maxRevenue) * 100;
          return (
            <div
              key={day.date}
              className="flex-1 flex flex-col items-center min-w-0"
            >
              <div className="w-full flex flex-col items-center justify-end h-40">
                <span className="text-xs text-gray-600 mb-1 hidden sm:block">
                  {formatRevenue(day.revenue)}
                </span>
                <div
                  className="w-full bg-primary hover:bg-primary-hover rounded-t transition-colors cursor-default"
                  style={{ height: `${Math.max(heightPercent, 2)}%` }}
                  title={`${day.displayDate}: $${day.revenue.toFixed(2)}`}
                />
              </div>
              <span className="text-xs text-gray-500 mt-2 truncate w-full text-center">
                {day.displayDate}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
