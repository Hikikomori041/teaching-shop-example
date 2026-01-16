type Product = {
    id: number
    name: string
    description: string
    price: number
    imageUrl: string
}

type Props = {
    product: Product
}

export default function ProductPreview({ product }: Props) {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover" />
            <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
                <p className="text-gray-600">{product.description}</p>
                <p className="text-xl font-bold text-gray-900 mt-2">${product.price.toFixed(2)}</p>
            </div>
        </div>
    )
}
