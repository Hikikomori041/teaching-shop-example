import { Product } from '../api/products';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-full aspect-square object-cover"
      />
      <p className="p-4">
        <span className="block text-lg font-semibold text-gray-800">
          {product.name}
        </span>
        <span className="block text-gray-600">
          {product.description}
        </span>
        <span className="block text-gray-800 font-bold">
          ${product.price.toFixed(2)}
        </span>
      </p>
    </div>
  );
}
