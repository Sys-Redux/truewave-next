'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Package, Calendar, DollarSign, User, Mail } from 'lucide-react';
import Image from 'next/image';
import { useAppSelector } from '@/hooks/store';
import { selectCurrentUser } from '@/lib/store/authSlice';
import { useOrder } from '@/hooks/useOrders';
import { formatDate } from '@/lib/utils/dateHelpers';

export default function OrderDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const user = useAppSelector(selectCurrentUser);
    const orderId = params.orderId as string;
    const { data: order, isLoading, error } = useOrder(orderId);

    // Check if user came from admin/order management page
    const fromAdmin = searchParams.get('from') === 'admin';

    // Redirect if not Logged In
    if (!user) {
        router.push('/login');
        return null;
    }

    if (isLoading) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <div className='animate-spin rounded-full w-12 h-12 border-4 border-accent border-t-transparent' />
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <div className='text-center'>
                    <p className='text-error text-lg mb-4'>Order not found</p>
                    <button onClick={() => router.push('/orders')} className='text-accent hover:underline'>
                        Return to Orders
                    </button>
                </div>
            </div>
        );
    }

    // Verify User Owns This Order
    if (order.userId !== user.uid && !user.isAdmin) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <div className='text-center'>
                    <p className='text-error text-lg mb-4'>You do not have permission to view this order</p>
                    <button onClick={() => router.push('/orders')} className='text-accent hover:underline'>
                        Return to Orders
                    </button>
                </div>
            </div>
        );
    }


    return (
        <div className='min-h-screen py-12 px-4'>
            <div className='max-w-4xl mx-auto'>
                {/* Back Button */}
                <button
                    onClick={() => {
                        if (fromAdmin) {
                            router.push('/admin');
                        } else {
                            router.push('/orders');
                        }
                    }}
                    className='flex items-center gap-2 text-text-muted hover:text-accent
                        transition-colors mb-6'
                >
                    <ArrowLeft className='w-5 h-5' />
                    {fromAdmin ? 'Back to Order Management' : 'Back to Orders'}
                </button>

                {/* Header */}
                <div className='bg-bg-secondary border border-border rounded-xl p-6 mb-6'>
                    <div className='flex items-start justify-between mb-6'>
                        <div className='flex items-center gap-4'>
                            <div className='w-16 h-16 bg-gradient-cyber rounded-xl flex items-center
                                justify-center shadow-cyan'>
                                <Package className='w-8 h-8 text-bg-primary' />
                            </div>
                            <div>
                                <h1 className='text-2xl font-bold text-text-primary'>
                                    Order #{order.id.slice(-8).toUpperCase()}
                                </h1>
                                <p className='text-text-muted text-sm flex items-center gap-2 mt-1'>
                                    <Calendar className='w-4 h-4' />
                                    {formatDate(order.createdAt)}
                                </p>
                            </div>
                        </div>
                        <span className={`px-4 py-2 rounded-lg text-sm font-medium ${
                            order.status === 'delivered' ? 'bg-success/10 text-success' :
                            order.status === 'shipped' ? 'bg-accent/10 text-accent' :
                            order.status === 'processing' ? 'bg-warning/10 text-warning' :
                            'bg-error/10 text-error'
                        }`}>
                            {order.status.toUpperCase()}
                        </span>
                    </div>

                    {/* Customer Info */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-border'>
                        <div className='flex items-center gap-3'>
                            <Mail className='w-5 h-5 text-text-accent' />
                            <div>
                                <p className='text-text-muted text-xs'>Email</p>
                                <p className='text-text-primary font-medium'>{order.userEmail}</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-3'>
                            <User className='w-5 h-5 text-text-accent' />
                            <div>
                                <p className='text-text-muted text-xs'>Customer ID</p>
                                <p className='text-text-primary font-medium font-mono'>
                                    {order.userId.slice(0, 12)}...
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Order Items */}
                <div className='bg-bg-secondary border border-border rounded-xl p-6 mb-6'>
                    <h2 className='text-xl font-bold text-text-primary mb-4'>Order Items</h2>
                    <div className='space-y-4'>
                        {order.items.map((item, index) => (
                            <div
                                key={`${item.productId}-${index}`}
                                className='flex items-center gap-4 bg-bg-elevated border border-border
                                    rounded-lg p-4'
                            >
                                <div className='relative w-20 h-20 bg-bg-primary rounded-xl overflow-hidden shrink-0'>
                                    <Image
                                        src={item.imageURL}
                                        alt={item.title}
                                        fill
                                        className='object-contain p-2'
                                        sizes='80px'
                                    />
                                </div>
                                <div className='flex-1 min-w-0'>
                                    <h3 className='text-text-primary font-semibold truncate'>{item.title}</h3>
                                    <p className='text-text-muted text-sm'>
                                        ${item.price.toFixed(2)} * {item.quantity}
                                    </p>
                                </div>
                                <div className='text-right'>
                                    <p className='text-accent font-bold'>
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Order Summary */}
                <div className='bg-bg-secondary border border-border rounded-xl p-6'>
                    <h2 className='text-xl font-bold text-text-primary mb-4'>Order Summary</h2>
                    <div className='space-y-3'>
                        <div className='flex justify-between text-text-muted'>
                            <span>Subtotal: ({order.items.length} items)</span>
                            <span>${order.totalAmount.toFixed(2)}</span>
                        </div>
                        <div className='flex justify-between text-text-muted'>
                            <span>Tax (included)</span>
                            <span>Calculated at checkout</span>
                        </div>
                        <div className='flex justify-between text-text-primary font-bold text-lg'>
                            <span>Total:</span>
                            <span className='text-accent flex items-center gap-1'>
                                <DollarSign className='w-5 h-5' />
                                {order.totalAmount.toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};