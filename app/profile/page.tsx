'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/hooks/store';
import { selectCurrentUser, selectAuthStatus } from '@/lib/store/authSlice';
import { Loader2 } from 'lucide-react';
import { Profile } from '@/components/Profile';

export default function ProfilePage() {
  const router = useRouter();
  const user = useAppSelector(selectCurrentUser);
  const status = useAppSelector(selectAuthStatus);

  useEffect(() => {
    if (status === 'idle' && !user) {
      router.push('/login');
    }
  }, [user, status, router]);

  if (status === 'loading' || !user) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-accent mx-auto mb-4" />
          <p className="text-text-muted font-mono">{'// Loading profile...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            <span className="text-gradient-cyber">My Profile</span>
          </h1>
          <p className="text-text-muted font-mono">{'// Manage your account'}</p>
        </div>

        <Profile />
      </div>
    </div>
  );
}
