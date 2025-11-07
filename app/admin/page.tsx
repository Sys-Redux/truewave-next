'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/hooks/store';
import { selectCurrentUser, selectAuthStatus } from '@/lib/store/authSlice';
import { Loader2 } from 'lucide-react';
import { AdminPanel } from '@/components/admin/AdminPanel';

export default function AdminPage() {
  const router = useRouter();
  const user = useAppSelector(selectCurrentUser);
  const status = useAppSelector(selectAuthStatus);

  useEffect(() => {
    if (status === 'idle') {
      if (!user) {
        router.push('/login');
      } else if (!user.isAdmin) {
        router.push('/');
      }
    }
  }, [user, status, router]);

  if (status === 'loading' || !user) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-accent mx-auto mb-4" />
          <p className="text-text-muted font-mono">{'// Loading admin panel...'}</p>
        </div>
      </div>
    );
  }

  if (!user.isAdmin) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-error mb-4">Access Denied</h1>
          <p className="text-text-muted">You don&apos;t have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            <span className="text-gradient-cyber">Admin Panel</span>
          </h1>
          <p className="text-text-muted font-mono">{'// Manage products and orders'}</p>
        </div>

        <AdminPanel />
      </div>
    </div>
  );
}
