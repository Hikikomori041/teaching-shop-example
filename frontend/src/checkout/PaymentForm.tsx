import { useState } from 'react'
import type { FormEvent } from 'react'

type Props = {
    onSubmit: (cardNumber: string) => void
    loading: boolean
    price: number
}

export default function PaymentForm({ onSubmit, loading, price }: Props) {
    const [cardNumber, setCardNumber] = useState('')

    const formatCardNumber = (value: string) => {
        return value.replace(/(\d{4})(?=\d)/g, '$1 ')
    }

    const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/\D/g, '').slice(0, 16)
        setCardNumber(raw)
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        onSubmit(cardNumber)
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Details</h3>

            <div className="mb-4">
                <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Card Number
                </label>
                <input
                    id="cardNumber"
                    type="text"
                    maxLength={19}
                    required
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-light focus:border-primary-light"
                    value={formatCardNumber(cardNumber)}
                    onChange={handleCardChange}
                />
                <p className="mt-1 text-xs text-gray-500">Enter any 16-digit number. Cards starting with 0000 will be declined.</p>
            </div>

            <button
                type="submit"
                disabled={loading || cardNumber.length !== 16}
                className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light disabled:opacity-50"
            >
                {loading ? 'Processing...' : `Pay $${price.toFixed(2)}`}
            </button>
        </form>
    )
}
