import { useSelector, useDispatch } from 'react-redux';
import { ShoppingBag, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { CartItem } from './CartItem';
import { clearCart, selectCartItems, selectCartTotal, selectCartItemCount } from '@/lib/store/cartSlice';
import type { RootState } from '@/lib/store/store';
import { Toaster } from 'react-hot-toast';
import { successToast, errorToast } from '@/lib/utils/toasts';
import { useCreateOrder } from '@/hooks/useOrders';
import { useAppSelector } from '@/hooks/store';
import { selectCurrentUser } from '@/lib/store/authSlice';
import type { OrderItem } from '@/types/order';
import type { CartItem as CartItemType } from '@/lib/utils/storage';

export const ShoppingCart = () => {
    const dispatch = useDispatch();
    const user = useAppSelector(selectCurrentUser);
    const cartItems = useSelector((state: RootState) => selectCartItems(state));
    const subTotal = useSelector((state: RootState) => selectCartTotal(state));
    const itemCount = useSelector((state: RootState) => selectCartItemCount(state));
    const createOrderMutation = useCreateOrder();

    // Taxes
    const TAX_RATE = 0.0725; // 7.25%
    const tax = subTotal * TAX_RATE;
    const total = subTotal + tax;

    const handleCheckout = async () => {
        if (!user) {
            errorToast('❌ Please log in to proceed to checkout');
            return;
        }

        // Confirm Checkout
        if (!window.confirm(`Proceed to checkout with total amount $${total.toFixed(2)}?`)) {
            return;
        }

        try {
            // Convert Cart Items to Order Items
            const orderItems: OrderItem[] = cartItems.map((item: CartItemType) => ({
                productId: item.product.id,
                title: item.product.title,
                price: item.product.price,
                quantity: item.quantity,
                imageURL: item.product.imageURL,
            }));

            // Create Order in Firestore
            const orderId = await createOrderMutation.mutateAsync({
                userId: user?.uid || '',
                userEmail: user?.email || '',
                items: orderItems,
                totalAmount: total,
                status: 'pending',
            });

            // Clear Cart After Successful Checkout
            dispatch(clearCart());
            successToast(`🎉 Order placed successfully! Total: $${total.toFixed(2)}`);
            console.log('Order ID:', orderId);
        } catch (error) {
            console.error('Checkout Error:', error);
            errorToast('❌ Checkout failed. Please try again.');
        }
    };

    const handleClearCart = () => {
        if (window.confirm('Are you sure you want to clear the cart?')) {
            dispatch(clearCart());
        }
    };

    // If cart is empty
    if (cartItems.length === 0) {
        return (
            <div className='flex flex-col items-center justify-center py-20'>
                <div className='w-24 h-24 bg-bg-elevated rounded-full flex items-center mb-6
                    justify-center border-2 border-border'>
                    <ShoppingBag className='w-12 h-12 text-text-muted' />
                </div>
                <h3 className='text-2xl font-bold text-text-primary mb-2'>
                    Your Cart is Empty
                </h3>
                <p className='text-text-secondary mb-6'>
                    Looks like you haven&apos;t added any items to your cart yet
                </p>
                <Link
                    href='/'
                    className='bg-accent hover:bg-accent-hover text-bg-primary px-6 py-3
                        rounded-lg font-medium transition-all hover:shadow-cyan'
                >
                    Continue Shopping
                </Link>
                <Toaster />
            </div>
        );
    }


    return (
        <div className='max-w-4xl mx-auto'>
            {/* Cart Header */}
            <div className='flex items-center justify-between mb-6'>
                <div>
                    <h3 className='text-xl font-bold text-text-primary'>
                        Your Cart
                        <span className='text-accent ml-2 font-mono'>
                            ({itemCount} {itemCount === 1 ? 'item' : 'items'})
                        </span>
                    </h3>
                </div>

                {/* Clear Cart Button */}
                <button
                    onClick={handleClearCart}
                    className='flex items-center gap-2 text-text-secondary
                        hover:text-error transition-colors text-sm'
                >
                    <Trash2 className='w-4 h-4' />
                    Clear Cart
                </button>
            </div>

            {/* Cart Items */}
            <div className='space-y-4 mb-8'>
                {cartItems.map((item: CartItemType) => (
                    <CartItem key={item.product.id} item={item} />
                ))}
            </div>

            {/* Cart Summary */}
            <div className='bg-bg-secondary border-2 border-border
                rounded-lg p-6 sticky bottom-4'>
                <div className='space-y-4'>
                    {/* Subtotal */}
                    <div className='flex justify-between items-center'>
                        <span className='text-text-secondary text-lg'>
                            Subtotal:
                        </span>
                        <span className='text-text-primary text-2xl font-mono font-bold'>
                            ${subTotal.toFixed(2)}
                        </span>
                    </div>
                    {/* Taxes */}
                    <div className='flex justify-between items-center'>
                        <span className='text-text-secondary text-lg'>
                            Taxes:
                            <span className='text-text-muted text-xs ml-2 font-mono font-bold'>
                                ({(TAX_RATE * 100).toFixed(2)}%)
                            </span>
                        </span>
                        <span className='text-text-primary text-xl font-mono font-semibold'>
                            ${tax.toFixed(2)}
                        </span>
                    </div>

                    {/* Divider */}
                    <div className='border-t border-border' />

                    {/* Total */}
                    <div className='flex justify-between items-center'>
                        <span className='text-text-primary text-xl font-semibold'>
                            Total:
                        </span>
                        <span className='text-accent-light text-3xl font-mono font-bold'>
                            ${total.toFixed(2)}
                        </span>
                    </div>

                    {/* Checkout Button */}
                    <button
                        onClick={handleCheckout}
                        className='w-full bg-linear-to-r from-accent to-secondary hover:shadow-cyan
                            text-bg-primary py-4 rounded-lg font-bold text-lg transition-all
                            duration-200 mt-4'
                    >
                        Proceed to Checkout
                    </button>

                    {/* Info Text */}
                    <p className='text-text-muted text-xs text-center font-mono'>
                        Demo Checkout - No real charges will be made
                    </p>
                </div>
            </div>
        </div>
    );
};