const API_BASE = 'http://localhost:8000/api'

export interface Order {
    id: number
    product: number
    product_name: string
    product_price: string
    product_image: string
    card_last_four: string
    status: 'pending' | 'paid' | 'failed'
    created_at: string
}

interface CreateOrderResponse extends Order {}

interface OrderError {
    error: string
    order_id?: number
}

export async function createOrder(token: string, productId: number, cardNumber: string): Promise<CreateOrderResponse> {
    const response = await fetch(`${API_BASE}/orders/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
            product_id: productId,
            card_number: cardNumber,
        }),
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error((data as OrderError).error || 'Order creation failed')
    }

    return data as CreateOrderResponse
}

export async function getOrders(token: string): Promise<Order[]> {
    const response = await fetch(`${API_BASE}/orders/`, {
        headers: {
            Authorization: `Token ${token}`,
        },
    })

    if (!response.ok) {
        throw new Error('Failed to fetch orders')
    }

    return response.json()
}

export async function getOrder(token: string, orderId: number): Promise<Order> {
    const response = await fetch(`${API_BASE}/orders/${orderId}/`, {
        headers: {
            Authorization: `Token ${token}`,
        },
    })

    if (!response.ok) {
        throw new Error('Failed to fetch order')
    }

    return response.json()
}

export interface AdminOrder extends Order {
    user: number
    username: string
    user_email: string
}

export async function getAdminOrders(token: string): Promise<AdminOrder[]> {
    const response = await fetch(`${API_BASE}/admin/orders/`, {
        headers: {
            Authorization: `Token ${token}`,
        },
    })

    if (!response.ok) {
        if (response.status === 403) {
            throw new Error('Access denied. Admin privileges required.')
        }
        throw new Error('Failed to fetch orders')
    }

    return response.json()
}
