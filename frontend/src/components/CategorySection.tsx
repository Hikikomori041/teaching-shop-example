import { Product } from '../api/products';
import ProductCard from './ProductCard';

interface CategorySectionProps {
  category: string;
  products: Product[];
}

export default function CategorySection({ category, products }: CategorySectionProps) {
  if (products.length === 0) return null;

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 px-8 max-w-4xl mx-auto capitalize">
        {category}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-8 max-w-4xl mx-auto">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
