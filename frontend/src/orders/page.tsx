import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { getOrders, type Order } from '../api/orders'
import { LoadingSpinner, EmptyState, PageContainer } from '../components'
import OrderCard from './OrderCard'

export default function MyOrdersPage() {
    const { token } = useAuth()
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchOrders() {
            if (!token) return

            try {
                const ordersData = await getOrders(token)
                setOrders(ordersData)
            } finally {
                setLoading(false)
            }
        }

        fetchOrders()
    }, [token])

    if (loading) {
        return <LoadingSpinner />
    }

    return (
        <PageContainer>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

            {orders.length === 0 ? (
                <EmptyState message="You haven't placed any orders yet." ctaText="Start Shopping" ctaLink="/" />
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <OrderCard key={order.id} order={order} />
                    ))}
                </div>
            )}
        </PageContainer>
    )
}
