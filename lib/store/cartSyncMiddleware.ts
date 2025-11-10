import type { Middleware } from '@reduxjs/toolkit';
import { addToCart, updateQuantity, removeFromCart, saveCartToFirestoreThunk } from './cartSlice';

// Middleware to Automatically Sync Cart Changes to Firestore
export const cartSyncMiddleware: Middleware = (store) => (next) => (action) => {
    const result = next(action);

    // Get Current State After Action
    const state = store.getState();
    const user = state.auth.user;

    if (user && typeof action === 'object' && action !== null && 'type' in action) {
        const actionType = action.type as string;
        const cartActions: string[] = [
            addToCart.type,
            updateQuantity.type,
            removeFromCart.type,
        ];

        if (cartActions.includes(actionType)) {
            // Debounce: Save After a Short Delay to Avoid too Many Writes
            setTimeout(() => {
                // Get fresh cart items from state at the time of save
                const currentState = store.getState();
                const cartItems = currentState.cart.items;
                void (store.dispatch as (action: unknown) => unknown)(
                    saveCartToFirestoreThunk({ userId: user.uid, items: cartItems })
                );
            }, 500);
        }
    }
    return result;
}