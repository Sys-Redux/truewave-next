'use client';

import { ShoppingCart as ShoppingCartComponent } from '@/components/cart/ShoppingCart';

export default function CartPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            <span className="text-gradient-cyber">Shopping Cart</span>
          </h1>
          <p className="text-text-muted font-mono">{'// Review your items'}</p>
        </div>

        <ShoppingCartComponent />
      </div>
    </div>
  );
}
