'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useAppSelector } from '@/hooks/store';
import { Header } from './Header';
import { selectCartItemCount } from '@/lib/store/cartSlice';

export function ClientLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();

    // Get cart item count from Redux store
    const cartItemCount = useAppSelector(selectCartItemCount);

    const handleCartClick = () => {
        if (pathname !== '/cart') {
            router.push('/cart');
        }
    };

    return (
        <div className='min-h-screen flex flex-col'>
            {/* Header */}
            <Header cartItemCount={cartItemCount} onCartClick={handleCartClick} />

            {/* Main content area */}
            <main className='flex-1'>
                {children}
            </main>

            {/* Footer */}
            <footer className='border-t border-border bg-bg-secondary py-6 mt-auto'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
                        <p className='text-text-muted text-sm'>
                            &copy; {new Date().getFullYear()} TrueWave. All rights reserved.
                        </p>
                        <p className='text-text-muted text-sm'>
                            Built with <span className='text-accent font-medium'>Next.js </span>
                            & <span className='text-accent font-medium'>TypeScript</span>
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
