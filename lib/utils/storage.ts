import type { Product } from '@/types/product';

export interface CartItem {
    product: Product;
    quantity: number;
}

const CART_STORAGE_KEY = 'truewave_cart';

// Save cart to sessionStorage
export const saveCartToStorage = (items: CartItem[]): void => {
    if (typeof window !== 'undefined') {
        sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
};

// Load cart from sessionStorage
export const loadCartFromStorage = (): CartItem[] => {
    if (typeof window === 'undefined') {
        return [];
    }

    const storedCart = sessionStorage.getItem(CART_STORAGE_KEY);
    return storedCart ? JSON.parse(storedCart) : [];
};

// Clear cart from sessionStorage
export const clearCartFromStorage = (): void => {
    if (typeof window !== 'undefined') {
        sessionStorage.removeItem(CART_STORAGE_KEY);
    }
};
