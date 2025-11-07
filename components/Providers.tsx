'use client';

import { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { makeStore } from '@/lib/store/store';
import { initializeAuthListener } from '@/lib/store/authSlice';
import { initializeCart } from '@/lib/store/cartSlice';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [store] = useState(() => makeStore());

  useEffect(() => {
    // Initialize auth listener (listens to Firebase Auth changes)
    const unsubscribe = initializeAuthListener(store.dispatch);

    // Initialize cart from sessionStorage
    store.dispatch(initializeCart());

    // Cleanup: Unsubscribe from auth listener
    return () => {
      unsubscribe();
    };
  }, [store]);

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Toaster position="bottom-right" />
        {children}
      </QueryClientProvider>
    </Provider>
  );
}
