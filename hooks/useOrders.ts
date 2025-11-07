import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createOrder, getUserOrders, getOrderById } from '@/lib/services/firestoreService';
import type { CreateOrderData } from '@/types/order';

// Fetch All Orders for a Specific User
export const useUserOrders = (userId: string | undefined) => {
    return useQuery({
        queryKey: ['orders', userId],
        queryFn: () => getUserOrders(userId!),
        enabled: !!userId,
    });
};

// Fetch Order by ID
export const useOrder = (orderId: string) => {
    return useQuery({
        queryKey: ['orders', orderId],
        queryFn: () => getOrderById(orderId),
        enabled: !!orderId,
    });
};

// Create New Order
export const useCreateOrder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (orderData: CreateOrderData) => createOrder(orderData),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['orders', variables.userId] });
        },
    });
};