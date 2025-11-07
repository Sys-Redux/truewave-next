'use client';

import { useRouter } from 'next/navigation';
import { Package, Calendar, DollarSign, ChevronRight, ShoppingBag } from 'lucide-react';
import { useAppSelector } from '@/hooks/store';
import { selectCurrentUser } from '@/lib/store/authSlice';
import { useUserOrders } from '@/hooks/useOrders';
import { formatDate } from '@/lib/utils/dateHelpers';

export default function OrdersPage() {
    const router = useRouter();
    const user = useAppSelector(selectCurrentUser);
    const { data: orders, isLoading, error } = useUserOrders(user?.uid);

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

    if (error) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <div className='text-center'>
                    <p className='text-error text-lg'>Failed to load orders</p>
                    <button onClick={() => router.push('/')} className='mt-4 text-accent hover:underline'>
                        Return Home
                    </button>
                </div>
            </div>
        );
    }


    return (
        <div className='min-h-screen py-12 px-4'>
            <div className='max-w-4xl mx-auto'>
                {/* Header */}
                <div className='mb-8'>
                    <h1 className='text-3xl font-bold mb-2'>
                        <span className='text-text-primary'>Order </span>
                        <span className='text-gradient-cyber'>History</span>
                    </h1>
                    <p className='text-text-muted font-mono text-sm'>
                        {'// Review your past orders'}
                    </p>
                </div>

                {/* Orders List */}
                {!orders || orders.length === 0 ? (
                    <div className='flex flex-col items-center justify-center py-20'>
                        <div className='w-24 h-24 bg-bg-elevated rounded-full flex items-center
                            justify-center border-2 border-border mb-6'>
                            <ShoppingBag className='w-12 h-12 text-text-muted' />
                        </div>
                        <h2 className='text-2xl font-bold text-text-primary mb-2'>No Orders Yet</h2>
                        <p className='text-text-muted mb-6'>You have not placed any orders yet.</p>
                        <button
                            onClick={() => router.push('/')}
                            className='px-6 py-3 bg-gradient-cyber text-bg-primary rounded-lg
                                hover:shadow-cyan transition-all font-bold'
                        >
                            Browse Products
                        </button>
                    </div>
                ) : (
                    <div className='space-y-4'>
                        {orders.map((order) => (
                            <div
                                key={order.id}
                                onClick={() => router.push(`/orders/${order.id}`)}
                                className='bg-bg-secondary border border-border rounded-xl p-6
                                    hover:border-accent transition-all duration-200 cursor-pointer group'
                            >
                                <div className='flex items-start justify-between mb-4'>
                                    <div className='flex items-center gap-3'>
                                        <div className='w-12 h-12 bg-gradient-cyber rounded-lg flex items-center
                                            justify-center shadow-cyan'>
                                            <Package className='w-6 h-6 text-bg-primary' />
                                        </div>
                                        <div>
                                            <h3 className='text-text-primary font-bold text-lg
                                                group-hover:text-accent transition-colors'>
                                                Order #{order.id.slice(-8).toUpperCase()}
                                                </h3>
                                                <p className='text-text-muted text-sm flex items-center gap-2'>
                                                    <Calendar className='w-4 h-4' />
                                                    {formatDate(order.createdAt)}
                                                </p>
                                        </div>
                                    </div>
                                    <ChevronRight className='w-6 h-6 text-text-muted group-hover:text-accent transition-colors' />
                                </div>

                                <div className='flex items-center justify-between pt-4 border-t border-border'>
                                    <div className='flex items-center gap-6'>
                                        <div>
                                            <p className='text-text-muted text-xs uppercase tracking-wide mb-1'>Items</p>
                                            <p className='text-text-primary font-mono font-bold'>{order.items.length}</p>
                                        </div>
                                        <div>
                                            <p className='text-text-muted text-xs uppercase tracking-wide mb-1'>Status</p>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                order.status === 'delivered' ? 'bg-success/10 text-success' :
                                                order.status === 'shipped' ? 'bg-accent/10 text-accent' :
                                                order.status === 'processing' ? 'bg-warning/10 text-warning' :
                                                order.status === 'cancelled' ? 'bg-error/10 text-error' :
                                                'bg-text-muted/10 text-text-muted'
                                            }`}>
                                                {order.status.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                    <div className='text-right'>
                                        <p className='text-text-muted text-xs uppercase tracking-wide mb-1'>Total</p>
                                        <p className='text-accent font-bold text-xl flex items-center gap-1'>
                                            <DollarSign className='w-5 h-5' />
                                            {order.totalAmount.toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};