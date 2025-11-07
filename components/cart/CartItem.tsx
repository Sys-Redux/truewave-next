import { Minus, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { updateQuantity, removeFromCart } from '@/lib/store/cartSlice';
import type { CartItem as CartItemType } from '@/lib/utils/storage';
import { Toaster } from 'react-hot-toast';

interface CartItemProps {
    item: CartItemType;
};

export const CartItem = ({ item }: CartItemProps) => {
    const dispatch = useDispatch();
    const { product, quantity } = item;

    const handleIncrement = () => {
        dispatch(updateQuantity({
            productId: product.id,
            quantity: quantity + 1,
        }));
    };

    const handleDecrement = () => {
        dispatch(updateQuantity({
            productId: product.id,
            quantity: quantity - 1,
        }));
    };

    const handleRemove = () => {
        dispatch(removeFromCart(product.id));
    };

    const itemTotal = (product.price * quantity).toFixed(2);


    return (
        <div className='bg-bg-secondary border border-border rounded-lg p-4
            hover:border-accent transition-all duration-200 group'>
            <div className='flex gap-4'>
                {/* Product Image */}
                <div className='relative w-24 h-24 bg-bg-elevated rounded-md shrink-0 overflow-hidden'>
                    <Image
                        src={product.imageURL}
                        alt={product.title}
                        fill
                        className='object-contain p-2'
                        sizes="96px"
                        onError={(e) => {
                            e.currentTarget.src = `https://via.placeholder.com/100x100/1e293b/06b6d4?text=product`;
                        }}
                    />
                </div>

                {/* Product Details */}
                <div className='flex-1 min-2-0'>
                    <div className='flex justify-between items-start gap-4 mb-2'>
                        {/* Title and Category */}
                        <div className='flex-1 min-w-0'>
                            <h3 className='text-text-primary font-semibold text-base mb-1 line-clamp-2
                                group-hover:text-accent-light transition-colors'>
                                {product.title}
                            </h3>
                            <span className='text-xs text-secondary uppercase tracking-wider font-mono'>
                                {product.category}
                            </span>
                        </div>

                        {/* Remove Button */}
                        <button
                            onClick={() => {
                                handleRemove();
                            }}
                            className='text-text-muted hover:text-error transition-colors p-2
                                rounded-md hover:bg-bg-elevated'
                            aria-label={`Remove ${product.title} from cart`}
                        >
                            <Trash2 className='w-5 h-5' />
                        </button>
                        <Toaster />
                    </div>

                    {/* Price and Quantity Controls */}
                    <div className='flex items-center justify-between mt-4'>
                        <div className='flex items-center gap-2'>
                            <button
                                onClick={handleDecrement}
                                className='w-8 h-8 flex items-center justify-center bg-bg-elevated
                                    hover:bg-bg-hover border border-boder hover:border-accent
                                    rounded-md transition-all'
                                aria-label='Decrease Quantity'
                            >
                                <Minus className='w-4 h-4 text-text-secondary' />
                            </button>
                            <span className='w-12 text-center text-text-primary font-mono font-semibold'>
                                {quantity}
                            </span>
                            <button
                                onClick={handleIncrement}
                                className='w-8 h-8 flex items-center justify-center bg-bg-elevated
                                    hover:bg-bg-hover border border-border hover:border-accent
                                    rounded-md transition-all'
                                aria-label='Increase Quantity'
                            >
                                <Plus className='w-4 h-4 text-text-secondary' />
                            </button>
                        </div>
                        <div className='text-right'>
                            <div className='text-text-muted text-xs mb-1'>
                                ${product.price.toFixed(2)} each
                            </div>
                            <div className='text-accent-light text-xl font-bold font-mono'>
                                ${itemTotal}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};