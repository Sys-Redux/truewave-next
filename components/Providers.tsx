'use client';

import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { store } from '@/lib/store/store';
import { initializeAuthListener } from '@/lib/store/authSlice';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize auth listener (listens to Firebase Auth changes)
    // The auth listener handles loading the cart appropriately:
    // - For logged-in users: loads cart from Firestore
    // - For guests: keeps cart empty (or loads from sessionStorage if needed)
    const unsubscribe = initializeAuthListener(store);

    // Cleanup: Unsubscribe from auth listener
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Toaster position="bottom-right" />
        {children}
      </QueryClientProvider>
    </Provider>
  );
}
