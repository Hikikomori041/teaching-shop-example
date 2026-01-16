import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { getOrder, type Order } from '../../api/orders'
import { LoadingSpinner, PageContainer } from '../../components'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid'
import OrderDetails from './OrderDetails'

export default function OrderConfirmationPage() {
    const { orderId } = useParams<{ orderId: string }>()
    const { token } = useAuth()
    const [order, setOrder] = useState<Order | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchOrder() {
            if (!token || !orderId) return

            try {
                const orderData = await getOrder(token, Number(orderId))
                setOrder(orderData)
            } catch {
                setError('Failed to load order')
            } finally {
                setLoading(false)
            }
        }

        fetchOrder()
    }, [token, orderId])

    if (loading) {
        return <LoadingSpinner />
    }

    if (error || !order) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-600">{error || 'Order not found'}</p>
            </div>
        )
    }

    const isSuccess = order.status === 'paid'

    return (
        <PageContainer maxWidth="md">
            <div className="text-center">
                {isSuccess ? <CheckCircleIcon className="mx-auto h-16 w-16 text-success" /> : <XCircleIcon className="mx-auto h-16 w-16 text-error" />}

                <h1 className="mt-4 text-3xl font-bold text-gray-900">{isSuccess ? 'Order Confirmed!' : 'Order Failed'}</h1>

                <p className="mt-2 text-gray-600">{isSuccess ? 'Thank you for your purchase. Your order has been confirmed.' : 'Your payment was declined. Please try again with a different card.'}</p>

                <OrderDetails order={order} />

                <div className="mt-6 space-x-4">
                    <Link to="/" className="inline-block py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-hover">
                        Continue Shopping
                    </Link>
                    <Link to="/orders" className="inline-block py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                        View All Orders
                    </Link>
                </div>
            </div>
        </PageContainer>
    )
}
