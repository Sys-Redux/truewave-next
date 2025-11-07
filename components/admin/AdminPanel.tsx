'use client';

import { useState } from 'react';
import { Plus, Package, AlertCircle } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { ProductForm } from '@/components/admin/ProductForm';
import { ProductManagementList } from '@/components/admin/ProductManagementList';
import { useAppSelector } from '@/hooks/store';
import { selectCurrentUser } from '@/lib/store/authSlice';

export const AdminPanel = () => {
    const [showProductForm, setShowProductForm] = useState<boolean>(false);
    const [editingProductId, setEditingProductId] = useState<string | null>(null);
    const user = useAppSelector(selectCurrentUser);
    const { data: products, isLoading, error } = useProducts();

    if (!user?.isAdmin) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <div className='text-center'>
                    <AlertCircle className='w-16 h-16 text-error mx-auto mb-4' />
                    <h1 className='text-2xl font-bold text-text-primary mb-2'>Access Denied</h1>
                    <p className='text-text-muted'>You do not have permission to access this page.</p>
                </div>
            </div>
        );
    }

    const handleAddProduct = () => {
        setEditingProductId(null);
        setShowProductForm(true);
    };

    const handleEditProduct = (productId: string) => {
        setEditingProductId(productId);
        setShowProductForm(true);
    };

    const handleCloseForm = () => {
        setShowProductForm(false);
        setEditingProductId(null);
    };

    return (
        <div className='min-h-screen bg-bg-primary py-8'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex items-center justify-between mb-8'>
                    <div>
                        <h1 className='text-3xl font-bold text-gradient-cyber flex items-center gap-3'>
                            <Package className='w-8 h-8' />
                            Admin Dashboard
                        </h1>
                        <p className='text-text-muted mt-2 font-mono'>
                            Manage products • Upload images • Monitor inventory
                        </p>
                    </div>
                    <button
                        onClick={handleAddProduct}
                        className='flex items-center gap-2 bg-gradient-cyber text-bg-primary px-6 py-3
                            rounded-lg hover:shadow-cyan transition-all duration-200 font-bold'
                    >
                        <Plus className='w-5 h-5' />
                        Add Product
                    </button>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
                    <div className='bg-bg-secondary border border-border rounded-xl p-6'>
                        <p className='text-text-muted text-sm font-medium'>Total Products</p>
                        <p className='text-3xl font-bold text-text-primary mt-2'>
                            {products?.length || 0}
                        </p>
                    </div>
                    <div className='bg-bg-secondary border border-border rounded-xl p-6'>
                        <p className='text-text-muted text-sm font-medium'>Categories</p>
                        <p className='text-3xl font-bold text-text-primary mt-2'>
                            {products ? new Set(products.map(p => p.category)).size : 0}
                        </p>
                    </div>
                    <div className='bg-bg-secondary border border-border rounded-xl p-6'>
                        <p className='text-text-muted text-sm font-medium'>Average Rating</p>
                        <p className='text-3xl font-bold text-text-primary mt-2'>
                            {products && products.length > 0
                                ? (products.reduce((acc, p) => acc + p.rating, 0) / products.length).toFixed(1)
                                : '0.0'}
                        </p>
                    </div>
                </div>

                {showProductForm && (
                    <ProductForm
                        productId={editingProductId}
                        onClose={handleCloseForm}
                    />
                )}

                {isLoading ? (
                    <div className='flex justify-center items-center py-20'>
                        <div className='animate-spin rounded-full w-12 h-12 border-4 border-accent border-t-transparent' />
                    </div>
                ) : error ? (
                    <div className='text-center py-20'>
                        <AlertCircle className='w-16 h-16 text-error mx-auto mb-4' />
                        <p className='text-text-muted'>Failed to load products. Please try again later.</p>
                    </div>
                ) : (
                    <ProductManagementList
                        products={products || []}
                        onEdit={handleEditProduct}
                    />
                )}
            </div>
        </div>
    );
};
