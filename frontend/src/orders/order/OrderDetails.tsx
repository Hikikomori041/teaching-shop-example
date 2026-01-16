import type { Order } from '../../api/orders'

type Props = {
    order: Order
}

export default function OrderDetails({ order }: Props) {
    return (
        <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
            <img src={order.product_image} alt={order.product_name} className="w-full h-48 object-cover" />
            <div className="p-4 text-left">
                <h2 className="text-lg font-semibold text-gray-800">{order.product_name}</h2>
                <p className="text-gray-600">Order #{order.id}</p>
                <p className="text-gray-600">Card ending in {order.card_last_four}</p>
                <p className="text-xl font-bold text-gray-900 mt-2">${parseFloat(order.product_price).toFixed(2)}</p>
                <p className="text-sm text-gray-500 mt-1">{new Date(order.created_at).toLocaleDateString()}</p>
            </div>
        </div>
    )
}
