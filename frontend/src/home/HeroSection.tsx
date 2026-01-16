import { useProducts } from '../contexts/ProductsContext'
import Spinner from './Spinner'

export default function HeroSection() {
    const { loading, products } = useProducts()

    return (
        <header className="mb-12 grid grid-cols-2 items-center h-screen">
            <div className="text-center space-y-8">
                <h1 className="text-4xl font-bold text-gray-800">Boutique Couture</h1>
                <p>Boutique premium de textile pour bébé 😎</p>
                <a href="#main" className="inline-block bg-gray-800 text-white px-6 py-3 rounded-md shadow-md hover:bg-gray-700 transition text-center h-12 w-60">
                    <div className="flex items-center justify-center h-full">{(loading && <Spinner className="text-white" />) || (products.length && 'Voir les produits') || 'Aucun produit'}</div>
                </a>
            </div>
            <img src="/hero2.jpg" alt="Boutique Couture" className="w-full h-screen block object-cover shadow-md" />
        </header>
    )
}
