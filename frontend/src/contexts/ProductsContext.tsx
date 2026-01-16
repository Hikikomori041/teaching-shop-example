import { createContext, use, useEffect, useState, type PropsWithChildren } from 'react'
import toast from 'react-hot-toast'
import { fetchProducts, type Product } from '../api/products'

type ProductsContextValue = { loading: boolean; products: Product[] }

const ProductsContext = createContext<ProductsContextValue | undefined>(undefined)

export function ProductsContextProvider({ children }: PropsWithChildren) {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchProducts()
            .then((products) => {
                setProducts(products)
            })
            .catch(() => {
                toast.error('Failed to load products')
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])

    return <ProductsContext.Provider value={{ products, loading }}>{children}</ProductsContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useProducts() {
    const ctx = use(ProductsContext)
    if (!ctx) {
        throw new Error('useProducts must be used within a ProductsContextProvider')
    }
    return ctx
}
