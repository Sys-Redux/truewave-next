'use client';

import { ShoppingCart, Home as HomeIcon, Sun, Moon, User, LogOut, Settings, Package, Receipt } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/hooks/store';
import { selectCurrentUser, logout } from '@/lib/store/authSlice';
import { successToast } from '@/lib/utils/toasts';

interface HeaderProps {
  cartItemCount: number;
  onCartClick: () => void;
}

export const Header = ({ cartItemCount, onCartClick }: HeaderProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    // Lazy initializer - only runs once on mount
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
      if (savedTheme) {
        document.documentElement.classList.toggle('light', savedTheme === 'light');
        return savedTheme;
      }
    }
    return 'dark';
  });

  const isCartPage = pathname === '/cart';
  const isProfilePage = pathname === '/profile';
  const isAuthPage = pathname === '/login' || pathname === '/register';

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('light', newTheme === 'light');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    await dispatch(logout());
    successToast('👋 Logged out successfully');
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border backdrop-blur-lg bg-bg-primary bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <div className="flex items-center justify-between h-16">
          <button onClick={() => router.push('/')} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-cyber rounded-lg flex items-center justify-center shadow-cyan">
                <span className="text-bg-primary font-bold text-xl">T</span>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold"><span className="text-gradient-cyber">TrueWave</span></h1>
              <p className="text-text-muted text-xs font-mono">{'// Cyber Store'}</p>
            </div>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className='flex items-center justify-center bg-bg-elevated w-10 h-10 hover:bg-bg-hover border
                border-border rounded-lg hover:border-accent transition-all duration-200'>
              {theme === 'light' ? <Moon className='w-5 h-5 text-text-secondary' /> : <Sun className='w-5 h-5 text-accent' />}
            </button>

            {(isCartPage || isProfilePage) && (
              <button
                onClick={() => router.push('/')}
                className="flex items-center gap-2 bg-bg-elevated hover:bg-bg-hover border border-border
                  hover:border-accent px-4 py-2 rounded-lg transition-all duration-200 group">
                <HomeIcon className="w-5 h-5 text-text-secondary group-hover:text-accent transition-colors" />
                <span className="text-text-primary font-medium hidden lg:inline">Continue Shopping</span>
              </button>
            )}

            <button
              onClick={onCartClick}
              className={`relative flex items-center gap-2 bg-bg-elevated hover:bg-bg-hover border px-4 py-2 rounded-lg transition-all
                duration-200 group ${isCartPage ? 'border-accent shadow-cyan' : 'border-border hover:border-accent'}`}>
              <ShoppingCart className={`w-5 h-5 transition-colors ${isCartPage ? 'text-accent' : 'text-text-secondary group-hover:text-accent'}`} />
              <span className="text-text-primary font-medium hidden sm:inline">Cart</span>
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-bg-primary text-xs font-bold px-2 py-0.5 rounded-full min-w-5 text-center shadow-cyan animate-pulse">
                  {cartItemCount}
                </span>
              )}
            </button>

            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`flex items-center gap-2 bg-bg-elevated hover:bg-bg-hover border px-4 py-2 rounded-lg transition-all
                    duration-200 ${isDropdownOpen || isProfilePage ? 'border-accent shadow-cyan' : 'border-border hover:border-accent'}`}>
                  {user.photoURL ? (
                    <div className="relative w-6 h-6 rounded-full border border-accent overflow-hidden">
                      <Image src={user.photoURL} alt={user.displayName || 'User'} fill className="object-cover" sizes="24px" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gradient-cyber flex items-center justify-center">
                      <User className="w-4 h-4 text-bg-primary" />
                    </div>
                  )}
                  <span className="text-text-primary font-medium hidden md:inline max-w-[120px] truncate">
                    {user.displayName || user.email}
                  </span>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-bg-secondary border-2 border-border rounded-xl
                    shadow-2xl overflow-hidden z-50">
                    <div className="p-4 border-b border-border bg-bg-elevated">
                      <div className="flex items-center gap-3">
                        {user.photoURL ? (
                          <div className="relative w-12 h-12 rounded-full border-2 border-accent shadow-cyan overflow-hidden">
                            <Image src={user.photoURL} alt={user.displayName || 'User'} fill className="object-cover" sizes="48px" />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-cyber flex items-center justify-center shadow-cyan">
                            <User className="w-6 h-6 text-bg-primary" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-text-primary font-bold truncate">{user.displayName || 'No Name Set'}</p>
                          <p className="text-text-muted text-xs font-mono truncate">{user.email}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                            <span className="text-success text-xs font-medium">Online</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="py-2">
                      <button
                        onClick={() => { setIsDropdownOpen(false); router.push('/profile'); }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-bg-elevated transition-colors group text-left">
                        <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center
                          group-hover:bg-accent/20 transition-colors">
                          <Settings className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                          <p className="text-text-primary font-medium group-hover:text-accent transition-colors">Edit Profile</p>
                          <p className="text-text-muted text-xs">Manage your account settings</p>
                        </div>
                      </button>
                      <button
                        onClick={() => { setIsDropdownOpen(false); router.push('/orders'); }}
                        className='w-full flex items-center gap-3 px-4 py-3 hover:bg-bg-elevated transition-colors
                          group text-left'>
                          <div className='w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center
                            group-hover:bg-accent/20 transition-colors'>
                            <Receipt className='w-5 h-5 text-accent' />
                          </div>
                          <div>
                            <p className='text-text-primary font-medium group-hover:text-accent transition-colors'>My Orders</p>
                            <p className='text-text-muted text-xs'>View your order history</p>
                          </div>
                          </button>
                      {user.isAdmin && (
                        <button
                          onClick={() => { setIsDropdownOpen(false); router.push('/admin'); }}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-bg-elevated transition-colors group text-left">
                          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center
                            group-hover:bg-accent/20 transition-colors">
                            <Package className="w-5 h-5 text-accent" />
                          </div>
                          <div>
                            <p className="text-text-primary font-medium group-hover:text-accent transition-colors">Admin Panel</p>
                            <p className="text-text-muted text-xs">Manage products and orders</p>
                          </div>
                        </button>
                      )}

                      <div className="my-2 border-t border-border" />

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-error/10 transition-colors group text-left">
                        <div className="w-10 h-10 rounded-lg bg-error/10 flex items-center justify-center
                          group-hover:bg-error/20 transition-colors">
                          <LogOut className="w-5 h-5 text-error" />
                        </div>
                        <div>
                          <p className="text-text-primary font-medium group-hover:text-error transition-colors">Logout</p>
                          <p className="text-text-muted text-xs">Sign out of your account</p>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              !isAuthPage && (
                <>
                  <button
                    onClick={() => router.push('/login')}
                    className="flex items-center gap-2 bg-bg-elevated hover:bg-bg-hover border border-border
                      hover:border-accent px-4 py-2 rounded-lg transition-all duration-200 group">
                    <User className="w-5 h-5 text-text-secondary group-hover:text-accent transition-colors" />
                    <span className="text-text-primary font-medium hidden sm:inline">Login</span>
                  </button>

                  <button
                    onClick={() => router.push('/register')}
                    className="flex items-center gap-2 bg-gradient-cyber text-bg-primary px-4 py-2 rounded-lg
                      hover:shadow-cyan transition-all duration-200 font-bold">
                    <span className="hidden sm:inline">Sign Up</span>
                  </button>
                </>
              )
            )}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-accent to-transparent opacity-30" />
    </header>
  );
};
