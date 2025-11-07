import { useState } from 'react';
import Image from 'next/image';
import type { Product } from '@/types/product';
import { Star } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

interface ProductCardProps {
    product: Product;
    onAddToCart: (product: Product) => void;
}

export const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

    const handleImageError = () => {
        setImageError(true);
        setImageLoading(false);
    };

    const handleImageLoad = () => {
        setImageLoading(false);
    };

    // Fallback placeholder
    const placeholderImage =
        `https://via.placeholder.com/300x300/1e293b/06b6d4?text=${encodeURIComponent(product.title.slice(0, 20))}`;


    return (
        <div className='bg-bg-secondary rounded-lg overflow-hidden border
            border-border hover:border-accent hover:shadow-cyan transition-all
            duration-300 flex flex-col h-full group'>
            {/* Image Container */}
            <div className='relative aspect-square bg-bg-elevated overflow-hidden'>
                {imageLoading && (
                    <div className='absolute inset-0 flex items-center justify-center z-10'>
                        <div className='w-8 h-8 border-4 border-accent border-b-transparent
                            rounded-full animate-spin' />
                    </div>
                )}
                <Image
                    src={imageError ? placeholderImage : product.imageURL}
                    alt={product.title}
                    fill
                    onError={handleImageError}
                    onLoad={handleImageLoad}
                    className='object-contain p-4 group-hover:scale-110
                        transition-transform duration-300'
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />
            </div>

            {/* Product Info */}
            <div className='p-4 flex flex-col grow'>
                {/* Category Badge */}
                <span className='text-xs text-text-secondary uppercase tracking-wider mb-2 font-mono'>
                    {product.category}
                </span>
                {/* Title */}
                <h3 className='text-text-primary font-semibold text-base mb-2 line-clamp-2
                    grow group-hover:text-accent-light transition-colors'>
                    {product.title}
                </h3>
                {/* Description */}
                <p className='text-text-primary text-sm mb-4 line-clamp-2'>
                    {product.description}
                </p>
                {/* Rating */}
                <div className='flex items-center gap-2 mb-4'>
                    <div className='flex items-center bg-bg-elevated px-2 py-1
                        rounded-md border border-border'>
                        <Star className='w-4 h-4 text-accent fill-accent' />
                        <span className='text-text-primary text-sm ml-1 font-mono'>
                            {product.rating.toFixed(1)}
                        </span>
                    </div>
                    <span className='text-text-muted text-sm'>
                        ({product.ratingCount} reviews)
                    </span>
                </div>
                {/* Price and Add to Cart */}
                <div className='flex items-center justify-between mt-auto gap-3'>
                    <span className='text-2xl font-bold text-accent-light font-mono'>
                        ${product.price.toFixed(2)}
                    </span>
                    <button
                        onClick={() => (onAddToCart(product))}
                        className='bg-accent hover:bg-accent-hover text-bg-primary
                            px-4 py-2 rounded-md transition-all duration-200 font-medium text-sm
                            hover:shadow-cyan shrink-0 relative'
                    >
                        Add to Cart
                    </button>
                    <Toaster />
                </div>
            </div>
        </div>
    );
};