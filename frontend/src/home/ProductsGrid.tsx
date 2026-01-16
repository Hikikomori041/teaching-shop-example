import { useNavigate } from 'react-router-dom';
import { useProducts } from '../contexts/ProductsContext';
import { useAuth } from '../contexts/AuthContext';

export default function ProductsGrid() {
  const { products } = useProducts();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleBuyNow = (productId: number) => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      navigate(`/checkout/${productId}`);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-8 max-w-4xl mx-auto">
      <h2 className="sr-only">Produits</h2>
      {products.map(product => (
        <div
          key={product.id}
          className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col"
        >
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full aspect-square object-cover"
          />
          <div className="p-4 flex flex-col flex-1">
            <span className="block text-lg font-semibold text-gray-800">
              {product.name}
            </span>
            <span className="block text-gray-600">{product.description}</span>
            <span className="block text-gray-800 font-bold">
              ${product.price.toFixed(2)}
            </span>
            <button
              onClick={() => handleBuyNow(product.id)}
              className="mt-auto pt-3 w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light"
            >
              Buy Now
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
