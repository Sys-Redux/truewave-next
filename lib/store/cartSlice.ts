import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '@/types/product';
import { type CartItem, saveCartToStorage, loadCartFromStorage, clearCartFromStorage } from '@/lib/utils/storage';
import {
    saveCartToFirestore,
    loadCartFromFirestore,
    clearCartFromFirestore,
    mergeGuestCartWithUserCart
} from '@/lib/services/firestoreService';
import { removeFromCartToast, addToCartToast } from '@/lib/utils/toasts';

interface CartState {
    items: CartItem[];
    loading: boolean;
    syncing: boolean;
}

// Load initial state from sessionStorage
const initialState: CartState = {
    items: [],
    loading: false,
    syncing: false,
};

// ==================================================================================
// Async Thunks for Firestore Operations
// ==================================================================================

// Load Cart From Firestore
export const loadCartFromFirestoreThunk = createAsyncThunk<
    CartItem[],
    string,
    { rejectValue: string }
>(
    'cart/loadFromFirestore',
    async (userId, { rejectWithValue }) => {
        try {
            const items = await loadCartFromFirestore(userId);
            return items;
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Failed to load cart from Firestore';
            return rejectWithValue(message);
        }
    }
);

// Save Cart to Firestore
export const saveCartToFirestoreThunk = createAsyncThunk<
    void,
    { userId: string; items: CartItem[] },
    { rejectValue: string }
>(
    'cart/saveToFirestore',
    async ({ userId, items }, { rejectWithValue }) => {
        try {
            await saveCartToFirestore(userId, items);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Failed to save cart to Firestore';
            return rejectWithValue(message);
        }
    }
);

// Merge Guest Cart with User Cart on Login
export const mergeGuestCartWithUserCartThunk = createAsyncThunk<
    CartItem[],
    { userId: string; guestItems: CartItem[] },
    { rejectValue: string }
>(
    'cart/mergeGuestCart',
    async ({ userId, guestItems }, { rejectWithValue }) => {
        try {
            return await mergeGuestCartWithUserCart(userId, guestItems);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Failed to merge guest cart with user cart';
            return rejectWithValue(message);
        }
    }
);

// Clear Cart from Firestore
export const clearCartFromFirestoreThunk = createAsyncThunk<
    void,
    string,
    { rejectValue: string }
>(
    'cart/clearFromFirestore',
    async (userId, { rejectWithValue }) => {
        try {
            await clearCartFromFirestore(userId);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Failed to clear cart from Firestore';
            return rejectWithValue(message);
        }
    }
);

// ==================================================================================
// Redux Slice
// ==================================================================================

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        // Initialize cart from storage (call this on client-side only)
        initializeCart: (state) => {
            state.items = loadCartFromStorage();
        },
        // Add product to cart
        addToCart: (state, action: PayloadAction<Product>) => {
            const product = action.payload;
            const existingItem = state.items.find(
                (item) => item.product.id === product.id
            );
            if (existingItem) {
                // Product exists, increment quantity
                existingItem.quantity += 1;
            } else {
                // New product, add to cart
                state.items.push({ product, quantity: 1 });
                addToCartToast(product.title);
            }

            // Save updated cart to storage
            saveCartToStorage(state.items);
        },

        // Update quantity of a product
        updateQuantity: (
            state,
            action: PayloadAction<{ productId: string; quantity: number }>
        ) => {
            const { productId, quantity } = action.payload;
            const item = state.items.find((item) => item.product.id === productId);

            if (item) {
                // Remove item if quantity is 0 or less
                if (quantity <= 0) {
                    state.items = state.items.filter(
                        (item) => item.product.id !== productId);
                    removeFromCartToast(item.product.title);
                } else {
                    item.quantity = quantity;
                }

                // Save updated cart to storage
                saveCartToStorage(state.items);
            }
        },

        // Remove item from cart
        removeFromCart: (state, action: PayloadAction<string>) => {
            const productId = action.payload;
            const item = state.items.find((item) => item.product.id === productId);
            if (!item) return;

            state.items = state.items.filter(
                (item) => item.product.id !== productId);
            removeFromCartToast(item.product.title);
            // Save updated cart to storage
            saveCartToStorage(state.items);
        },

        // Clear the cart
        clearCart: (state) => {
            state.items = [];
            clearCartFromStorage();
        },

        // Set Cart Items Directly (Used After Firestore Load)
        setCartItems: (state, action: PayloadAction<CartItem[]>) => {
            state.items = action.payload;
        },
    },
    extraReducers: (builder) => {
        // Load From Firestore
        builder
            .addCase(loadCartFromFirestoreThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(loadCartFromFirestoreThunk.fulfilled, (state, action) => {
                state.items = action.payload;
                state.loading = false;
            })
            .addCase(loadCartFromFirestoreThunk.rejected, (state) => {
                state.loading = false;
            });

        // Save to Firestore
        builder
            .addCase(saveCartToFirestoreThunk.pending, (state) => {
                state.syncing = true;
            })
            .addCase(saveCartToFirestoreThunk.fulfilled, (state) => {
                state.syncing = false;
            })
            .addCase(saveCartToFirestoreThunk.rejected, (state) => {
                state.syncing = false;
            });

        // Merge Guest Cart
        builder
            .addCase(mergeGuestCartWithUserCartThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(mergeGuestCartWithUserCartThunk.fulfilled, (state, action) => {
                state.items = action.payload;
                state.loading = false;
                clearCartFromStorage(); // Clear guest cart from storage
            })
            .addCase(mergeGuestCartWithUserCartThunk.rejected, (state) => {
                state.loading = false;
            });

        // Clear From Firestore
        builder
            .addCase(clearCartFromFirestoreThunk.fulfilled, (state) => {
                state.items = [];
            });
        },
});

export const {
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    initializeCart,
    setCartItems,
} = cartSlice.actions;
export default cartSlice.reducer;

// Selectors (helpers to access cart data)
export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectIsCartLoading = (state: { cart: CartState }) => state.cart.loading;
export const selectIsCartSyncing = (state: { cart: CartState }) => state.cart.syncing;

export const selectCartTotal = (state: { cart: CartState }) => {
    return state.cart.items.reduce(
        (total, item) => total + item.product.price * item.quantity, 0
    );
};

export const selectCartItemCount = (state: { cart: CartState }) => {
    return state.cart.items.reduce((count, item) => count + item.quantity, 0);
};
