export interface Product {
    id: number
    name: string
    price: number
    description: string
    imageUrl: string
}

interface RawProduct {
    id: number
    name: string
    price: string
    description: string
}

export async function fetchProducts(): Promise<Product[]> {
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate network delay
    // const response = [{
    //     id: 1,
    //     name: "Bavoir Hippopotame",
    //     price: 79.99,
    //     description: "Craquez pour le bavoir hippopotame !",
    //     imageUrl: "/bavoir1.jpg"
    // }, {
    //     id: 2,
    //     name: "Bavoir Renard",
    //     price: 39.99,
    //     description: "Le motif renard de ce bavoir est trop mignon !",
    //     imageUrl: "/bavoir2.jpg"
    // }, {
    //     id: 3,
    //     name: "Bavoir Jungle",
    //     price: 59.99,
    //     description: "La savane illustre parfaitement la jungle créative de votre bébé !",
    //     imageUrl: "/bavoir3.jpg"
    // }];
    const response = await fetch('http://localhost:8000/api/products/').then((res) =>
        res.json().then((data) =>
            data.map((p: RawProduct) => ({
                ...p,
                price: parseFloat(p.price),
            }))
        )
    )
    return response
}
