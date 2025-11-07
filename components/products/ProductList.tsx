import { ProductCard } from "./ProductCard";
import type { Product } from "../../types/product";

interface ProductListProps {
    products: Product[];
    onAddToCart: (product: Product) => void;
};

export const ProductList = ({ products, onAddToCart }: ProductListProps) => {
    if (products.length === 0) {
        return (
            <div className='flex flex-col items-center justify-center py-20'>
                <div className='text-6xl mb-4 opacity-30'>🔍</div>
                <p className='text-text-secondary text-xl mb-2'>
                    No products found.
                </p>
                <p className='text-text-muted text-sm'>
                    Try selecting a different category
                </p>
            </div>
        );
    };


    return (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={onAddToCart}
                />
            ))}
        </div>
    );
};