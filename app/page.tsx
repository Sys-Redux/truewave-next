'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/hooks/store';
import { selectCurrentUser } from '@/lib/store/authSlice';
import { useProducts, useProductsByCategory } from '@/hooks/useProducts';
import { ProductList } from '@/components/products/ProductList';
import { CategoryFilter } from '@/components/products/CategoryFilter';
import { addToCart } from '@/lib/store/cartSlice';
import { errorToast } from '@/lib/utils/toasts';
import type { Product } from '@/types/product';

export default function HomePage() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const user = useAppSelector(selectCurrentUser);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    // Use different hooks based on whether a category is selected
    const allProductsQuery = useProducts();
    const categoryProductsQuery = useProductsByCategory(selectedCategory || '');

    // Choose which query to use based on category selection
    const { data: products, isLoading, error } = selectedCategory
        ? categoryProductsQuery
        : allProductsQuery;

    const handleAddToCart = (product: Product) => {
        if (!user) {
            errorToast('❌ Please log in to add items to your cart');
            router.push('/login');
            return;
        }
        // Dispatch Redux action to add product to cart
        dispatch(addToCart(product));
    };


    return (
        <div className='py-8 px-4 sm:px-6 lg:px-8'>
            <div className='max-w-7xl mx-auto'>

                {/* Hero Header */}
                <div className='mb-8 relative'>
                    <div className='absolute inset-0 bg-linear-to-r from-accent/10 via-secondary/10 to-accent/10 blur-3xl' />
                    <div className='relative z-10'>
                        {/* Personalized greeting */}
                        {user && (
                            <div className='mb-4 flex items-center gap-2'>
                                <div className='w-2 h-2 bg-success rounded-full animate-pulse' />
                                <p className='text-text-muted text-sm font-mono'>
                                    Welcome back, <span className='text-accent font-bold'>
                                        {user.displayName || user.email.split('@')[0]}
                                    </span>!
                                </p>
                            </div>
                        )}

                        <h2 className='text-4xl font-bold mb-3'>
                            <span className='text-text-primary'>Featured </span>
                            <span className='text-gradient-cyber'>Products</span>
                        </h2>
                        <p className='text-text-secondary text-lg'>
                            Discover our collection of premium products
                            <span className='text-accent font-mono ml-2'>
                                Latest Arrivals
                            </span>
                        </p>
                    </div>

                    {/* Auth CTA Banner - Only Show if not Logged In */}
                    {!user && (
                        <div className='mt-6 mb-4 p-4 bg-linear-to-r from-accent/10 to-secondary/10
                            border border-accent/30 rounded-xl backdrop-blur-sm'>
                            <div className='flex items-center justify-between gap-4 flex-wrap'>
                                <div>
                                    <p className='text-text-primary font-bold text-lg mb-1'>
                                        🎉 New here? Create an account!
                                    </p>
                                    <p className='text-text-muted font-mono text-sm'>
                                        Sign up now to enjoy exclusive benefits and offers.
                                    </p>
                                </div>
                                <div className='flex gap-3'>
                                    <button
                                        onClick={() => router.push('/login')}
                                        className='px-4 py-2 border border-border hover:border-accent
                                            rounded-lg transition-all font-medium'
                                    >
                                        Log In
                                    </button>
                                    <button
                                        onClick={() => router.push('/register')}
                                        className='px-4 py-2 bg-gradient-cyber text-bg-primary
                                            rounded-lg hover:shadow-cyan transition-all font-bold'
                                    >
                                        Sign Up
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Category Filter */}
                    <div className='mb-8'>
                        <CategoryFilter
                            selectedCategory={selectedCategory}
                            onCategoryChange={setSelectedCategory}
                        />
                    </div>

                    {/* Product Section */}
                    {isLoading ? (
                        <div className='flex flex-col items-center justify-center py-20'>
                            <div className='relative'>
                                <div className='w-16 h-16 border-4 border-bg-elevated
                                    border-t-accent rounded-full animate-spin shadow-cyan' />
                                <div className='absolute inset-0 w-16 h-16 border-4 border-transparent
                                    border-b-secondary rounded-full animate-spin'
                                        style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
                            </div>
                            <p className='text-text-secondary mt-6 text-lg'>Loading Products...</p>
                            <p className='text-text-muted mt-2 text-sm font-mono'>
                                Please wait while we fetch the latest products for you.
                            </p>
                        </div>
                    ) : error ? (
                        <div className='flex flex-col items-center justify-center py-20'>
                            <div className='bg-bg-secondary border-2 border-error
                                rounded-lg p-8 max-w-md'>
                                <p className='text-error text-xl font-bold mb-2'>⚠️ Connection Error</p>
                                <p className='text-text-secondary'>Failed to load products from the server</p>
                                <p className='text-text-muted text-sm mt-3 font-mono'>Please try again later</p>
                            </div>
                        </div>
                    ) : (
                        <ProductList products={products || []} onAddToCart={handleAddToCart} />
                    )}
                </div>
            </div>
        </div>
    );
}
