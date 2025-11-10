'use client';

import { Package, DollarSign, ShoppingCart, TrendingUp, Calendar, User } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, query, orderBy as fbOrderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Order } from '@/types/order';
import { formatDate } from '@/lib/utils/dateHelpers';
import { useRouter } from 'next/navigation';

export const OrderManagement = () => {
    const router = useRouter();

    // Fetch All Orders
    const { data: orders, isLoading } = useQuery({
        queryKey: ['admin-orders'],
        queryFn: async () => {
            const ordersRef = collection(db, 'orders');
            const q = query(ordersRef, fbOrderBy('createdAt', 'desc'), limit(50));
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
                updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
            })) as Order[];
        },
    });

    const metrics = {
        totalOrders: orders?.length || 0,
        totalRevenue: orders?.reduce((sum, order) => sum + order.totalAmount, 0) || 0,
        averageOrderValue: orders?.length
            ? (orders.reduce((sum, order) => sum + order.totalAmount, 0) / orders.length)
            : 0,
        pendingOrders: orders?.filter(order => order.status === 'pending').length || 0,
    };

    if (isLoading) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <div className='animate-spin rounded-full w-12 h-12 border-4 border-accent border-t-transparent' />
            </div>
        );
    }


    return (
        <div className='space-y-6'>
            {/* Metrics Cards */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                <div className='bg-bg-elevated border border-border rounded-xl p-6'>
                    <div className='flex items-center justify-between mb-2'>
                        <Package className='w-8 h-8 text-accent' />
                        <TrendingUp className='w-5 h-5 text-success' />
                    </div>
                    <p className='text-text-muted text-sm mb-1'>Total Orders</p>
                    <p className='text-3xl font-bold text-text-primary'>{metrics.totalOrders}</p>
                </div>

                <div className='bg-bg-elevated border border-border rounded-xl p-6'>
                    <div className='flex items-center justify-between mb-2'>
                        <DollarSign className='w-8 h-8 text-success' />
                        <TrendingUp className='w-5 h-5 text-success' />
                    </div>
                    <p className='text-text-muted text-sm mb-1'>Total Revenue</p>
                    <p className='text-3xl font-bold text-text-primary'>
                        ${metrics.totalRevenue.toFixed(2)}
                    </p>
                </div>

                <div className='bg-bg-elevated border border-border rounded-xl p-6'>
                    <div className='flex items-center justify-between mb-2'>
                        <ShoppingCart className='w-8 h-8 text-accent' />
                    </div>
                    <p className='text-text-muted text-sm mb-1'>Avg. Order Value</p>
                    <p className='text-3xl font-bold text-text-primary'>
                        ${metrics.averageOrderValue.toFixed(2)}
                    </p>
                </div>

                <div className='bg-bg-elevated border border-border rounded-xl p-6'>
                    <div className='flex items-center justify-between mb-2'>
                        <Package className='w-8 h-8 text-accent' />
                    </div>
                    <p className='text-text-muted text-sm mb-1'>Pending Orders</p>
                    <p className='text-3xl font-bold text-text-primary'>{metrics.pendingOrders}</p>
                </div>
            </div>

            {/* Recent Orders Table */}
            <div className='bg-bg-secondary border border-border rounded-xl overflow-hidden'>
                <div className='p-6 border-b border-border'>
                    <h2 className='text-2xl font-bold text-text-primary'>Recent Orders</h2>
                    <p className='text-text-muted text-sm mt-1'>Last 50 orders placed</p>
                </div>

                <div className='overflow-x-auto'>
                    <table className='w-full'>
                        <thead className='bg-bg-elevated border-b border-border'>
                            <tr>
                                <th className='px-6 py-4 text-left text-xs font-medium text-text-muted
                                    uppercase tracking wider'>
                                    Order ID
                                </th>
                                <th className='px-6 py-4 text-left text-xs font-medium text-text-muted
                                    uppercase tracking wider'>
                                    Customer
                                </th>
                                <th className='px-6 py-4 text-left text-xs font-medium text-text-muted
                                    uppercase tracking wider'>
                                    Date
                                </th>
                                <th className='px-6 py-4 text-left text-xs font-medium text-text-muted
                                    uppercase tracking wider'>
                                    Items
                                </th>
                                <th className='px-6 py-4 text-left text-xs font-medium text-text-muted
                                    uppercase tracking wider'>
                                    Total
                                </th>
                                <th className='px-6 py-4 text-left text-xs font-medium text-text-muted
                                    uppercase tracking wider'>
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-border'>
                            {orders && orders.length > 0 ? (
                                orders.map((order) => (
                                    <tr
                                        key={order.id}
                                        onClick={() => router.push(`/orders/${order.id}?from=admin`)}
                                        className='hover:bg-bg-elevated cursor-pointer transition-colors'
                                    >
                                        <td className='px-6 py-4 whitespace-nowrap'>
                                            <span className='text-text-primary font-mono text-sm'>
                                                #{order.id.slice(-8).toUpperCase()}
                                            </span>
                                        </td>
                                        <td className='px-6 py-4'>
                                            <div className='flex items-center gap-2'>
                                                <User className='w-4 h-4 text-text-muted' />
                                                <span className='text-text-primary text-sm truncate max-w-[200px]'>
                                                    {order.userEmail}
                                                </span>
                                            </div>
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap'>
                                            <div className='flex items-center gap-2 text-text-muted text-sm'>
                                                <Calendar className='w-4 h-4' />
                                                {formatDate(order.createdAt)}
                                            </div>
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap'>
                                            <span className='text-text-primary font-medium'>
                                                {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                                            </span>
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap'>
                                            <span className='text-accent font-bold'>
                                                ${order.totalAmount.toFixed(2)}
                                            </span>
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap'>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                order.status === 'delivered' ? 'bg-success/10 text-success' :
                                                order.status === 'shipped' ? 'bg-accent/10 text-accent' :
                                                order.status === 'processing' ? 'bg-warning/10 text-warning' :
                                                order.status === 'cancelled' ? 'bg-error/10 text-error' :
                                                'bg-text-muted/10 text-text-muted'
                                            }`}>
                                                {order.status.toUpperCase()}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className='px-6 py-12 text-center text-text-muted'>
                                        No orders found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};