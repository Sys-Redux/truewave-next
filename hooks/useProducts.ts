import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getAllProducts,
    getProductsByCategory,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} from '@/lib/services/firestoreService';
import type { ProductFormData } from '@/types/product';

// Fetch All Products
export const useProducts = () => {
    return useQuery({
        queryKey: ['products'],
        queryFn: getAllProducts,
        staleTime: 5 * 60 * 1000,
    });
};

// Fetch Products by Category
export const useProductsByCategory = (category: string) => {
    return useQuery({
        queryKey: ['products', 'category', category],
        queryFn: () => getProductsByCategory(category),
        enabled: !!category,
        staleTime: 5 * 60 * 1000,
    });
};

// Fetch Product by ID
export const useProduct = (productId: string) => {
    return useQuery({
        queryKey: ['products', productId],
        queryFn: () => getProductById(productId),
        staleTime: 5 * 60 * 1000,
    });
};

// Fetch All Categories
export const useCategories = () => {
    return useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const products = await getAllProducts();
            // Filter out any products without a category and remove duplicates
            const categories = [...new Set(products
                .map(p => p.category)
                .filter(Boolean))] as string[];
            return categories.sort();
        },
        staleTime: 10 * 60 * 1000,
    });
};

// Create New Product
export const useCreateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (productData: ProductFormData) => createProduct(productData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });
};

// Update Existing Product
export const useUpdateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            productId,
            productData,
        }: {
            productId: string;
            productData: Partial<ProductFormData>;
        }) => updateProduct(productId, productData),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['products', variables.productId] });
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });
};

// Delete Product
export const useDeleteProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (productId: string) => deleteProduct(productId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });
};
