import HeroSection from './HeroSection'
import ProductsGrid from './ProductsGrid'
import BrandValues from './BrandValues'

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gray-100 pb-6">
            <HeroSection />
            <main id="main">
                <div className="text-center text-lg text-gray-600 mb-8">
                    <p className="text-center text-lg text-gray-600">Découvrez notre sélection de bavoirs pour bébés.</p>
                    <p className="text-center text-lg text-gray-600">Chaque bavoir est conçu en France 🇫🇷</p>
                </div>
                <ProductsGrid />
                <BrandValues />
            </main>
        </div>
    )
}
