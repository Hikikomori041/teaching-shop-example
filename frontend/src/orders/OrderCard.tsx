import { Link } from 'react-router-dom'
import { StatusBadge } from '../components'
import type { Order } from '../api/orders'

type Props = {
    order: Order
    linkable?: boolean
}

export default function OrderCard({ order, linkable = true }: Props) {
    const content = (
        <div className="flex">
            <img src={order.product_image} alt={order.product_name} className="w-24 h-24 object-cover" />
            <div className="p-4 flex-1">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">{order.product_name}</h2>
                        <p className="text-sm text-gray-500">Order #{order.id}</p>
                    </div>
                    <StatusBadge status={order.status} />
                </div>
                <p className="text-gray-900 font-bold mt-1">${parseFloat(order.product_price).toFixed(2)}</p>
                <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
            </div>
        </div>
    )

    if (linkable) {
        return (
            <Link to={`/order/${order.id}`} className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {content}
            </Link>
        )
    }

    return <div className="bg-white rounded-lg shadow-md overflow-hidden">{content}</div>
}
