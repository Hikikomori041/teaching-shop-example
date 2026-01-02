import { useProducts } from '../contexts/ProductsContext';
import Spinner from "../Spinner";

export default function HomePage() {
  const { products } = useProducts();

  return (
    <div className="min-h-screen bg-gray-100 pb-6">
      <header className="mb-12 grid grid-cols-2 items-center h-screen">
        <div className="text-center space-y-8">
          <h1 className="text-4xl font-bold text-gray-800">Boutique Couture</h1>
          <p>Boutique premium de textile pour bébé 😎</p>
          <a
            href="#main"
            className="inline-block bg-gray-800 text-white px-6 py-3 rounded-md shadow-md hover:bg-gray-700 transition text-center h-12 w-60"
          >
            <div className="flex items-center justify-center h-full">

            {
              products.length > 0 ? "Voir les produits" : <Spinner className="text-white" />
            }
            </div>
          </a>
        </div>
        <img
          src="/hero2.jpg"
          alt="Boutique Couture"
          className="w-full h-screen block object-cover shadow-md"
        />
      </header>
      <main id="main">
        <div className="text-center text-lg text-gray-600 mb-8">
          <p className="text-center text-lg text-gray-600">
            Découvrez notre sélection de bavoirs pour bébés.
          </p>
          <p className="text-center text-lg text-gray-600">
            Chaque bavoir est conçu en France 🇫🇷
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-8 max-w-4xl mx-auto">
          <h2 className="sr-only">Produits</h2>
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
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
          ))}
        </div>
        <div className="text-gray-600 mt-12 space-y-4 px-4 bg-white py-8">
          <div className="flex gap-6">
            <img src="/hero.jpg" alt="Nos valeurs" className="w-1/2 mx-auto rounded-md shadow-md" />
            <div className="w-1/2 flex flex-col justify-center leading-8">
              <h2 className="text-xl font-bold mb-4">Les valeurs de notre marque premium</h2>
              <p>Chaque produit est conçu avec soin et attention aux détails.</p>
              <p>Tous les tissus sont certifiés Oeko-Tex, garantissant l'absence de substances nocives.</p>
              <p>Nos tissus de haute qualité sont sélectionnés avec soin pour assurer le confort et la sécurité de votre bébé.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
