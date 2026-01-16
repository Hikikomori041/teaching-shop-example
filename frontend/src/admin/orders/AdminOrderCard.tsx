import { StatusBadge } from '../../components'
import type { AdminOrder } from '../../api/orders'

type Props = {
    order: AdminOrder
}

export default function AdminOrderCard({ order }: Props) {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="flex">
                <img src={order.product_image} alt={order.product_name} className="w-24 h-24 object-cover" />
                <div className="p-4 flex-1">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">{order.product_name}</h2>
                            <p className="text-sm text-gray-500">Order #{order.id}</p>
                            <p className="text-sm text-gray-600">
                                Customer: {order.username} ({order.user_email})
                            </p>
                        </div>
                        <StatusBadge status={order.status} />
                    </div>
                    <div className="flex justify-between items-center mt-2">
                        <p className="text-gray-900 font-bold">${parseFloat(order.product_price).toFixed(2)}</p>
                        <p className="text-xs text-gray-500">
                            Card: ****{order.card_last_four} | {new Date(order.created_at).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
