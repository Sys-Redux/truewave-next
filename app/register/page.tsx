'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User as UserIcon, Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/store';
import { register, selectAuthStatus, selectAuthError } from '@/lib/store/authSlice';
import { errorToast, successToast } from '@/lib/utils/toasts';

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectAuthStatus);
  const error = useAppSelector(selectAuthError);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      errorToast('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      errorToast('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      errorToast('Password must be at least 6 characters');
      return;
    }

    try {
      await dispatch(register({ email, password, displayName: name })).unwrap();
      successToast('🎉 Account created successfully!');
      router.push('/');
    } catch (err) {
      errorToast((err as string) || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-bg-secondary border-2 border-border rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-cyber p-6 text-center">
            <h1 className="text-3xl font-bold text-bg-primary">Join TrueWave</h1>
            <p className="text-bg-primary/80 mt-2 font-mono text-sm">{'// Create your account'}</p>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-text-primary font-medium mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-bg-elevated border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-text-primary placeholder:text-text-muted transition-all"
                    placeholder="John Doe"
                    disabled={status === 'loading'}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-text-primary font-medium mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-bg-elevated border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-text-primary placeholder:text-text-muted transition-all"
                    placeholder="you@example.com"
                    disabled={status === 'loading'}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-text-primary font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-bg-elevated border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-text-primary placeholder:text-text-muted transition-all"
                    placeholder="At least 6 characters"
                    disabled={status === 'loading'}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-text-primary font-medium mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-bg-elevated border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-text-primary placeholder:text-text-muted transition-all"
                    placeholder="Confirm your password"
                    disabled={status === 'loading'}
                  />
                </div>
              </div>

              {error && (
                <div className="bg-error/10 border border-error/50 rounded-lg p-3">
                  <p className="text-error text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-gradient-cyber text-bg-primary font-bold py-3 rounded-lg hover:shadow-cyan transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <span>Create Account</span>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-text-muted">
                Already have an account?{' '}
                <button
                  onClick={() => router.push('/login')}
                  className="text-accent hover:underline font-medium"
                >
                  Login
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
