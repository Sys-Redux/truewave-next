<!-- markdownlint-disable -->

# TrueWave - Cyber E-Commerce Store

A full-stack e-commerce platform with a slick cyberpunk aesthetic. I built this to learn modern web development with Firebase, starting with React + Vite, then migrating everything to Next.js 16 to level up the architecture.

## 🚀 Why I Switched to Next.js

Originally built with React and Vite (which was great for quick development), I migrated to Next.js because I wanted to learn production-grade patterns and get better performance. The switch gave me:

- **App Router** - File-based routing is so much cleaner than React Router
- **Server Components** - Better performance and smaller client bundles
- **Image Optimization** - Automatic image optimization with the `next/image` component
- **Better SEO** - Server-side rendering capabilities for product pages
- **Production Ready** - Built-in optimizations and easy Vercel deployment

The migration was challenging but worth it - I kept all the features working while making the app faster and more scalable.

## 🛠️ Tech Stack

### Frontend
- **Next.js 16.0.1** - React framework with App Router
- **React 19.2.0** - UI library with latest features
- **TypeScript** - Type safety and better developer experience
- **Tailwind CSS v4** - Utility-first CSS with custom cyber theme
- **Lucide React** - Beautiful icon library

### State Management & Data Fetching
- **Redux Toolkit 2.10.1** - Global state management (auth, cart)
- **TanStack React Query 5.90.7** - Server state management and caching
- **React Hot Toast** - Toast notifications

### Backend & Database
- **Firebase 12.5.0**
  - Authentication - User management and auth flows
  - Firestore - NoSQL database for products, orders, users
  - Cloud Storage - Image hosting for product photos

### Development Tools
- **ESLint** - Code linting and quality
- **pnpm** - Fast, efficient package manager

## ✨ What It Does

### For Customers
- 🔐 **User Accounts** - Register, login, and manage your profile with Firebase Auth
- 🛒 **Shopping Cart** - Add products, adjust quantities, persistent cart (survives refresh)
- 🎨 **Dark/Light Theme** - Toggle between themes with localStorage persistence
- 👤 **Profile Management** - Update display name, photo URL, and view order history
- 🔍 **Browse Products** - Filter by category, view detailed product pages
- 💳 **Checkout & Orders** - Place orders, view order history, track order details
- 📦 **Order History** - See all past purchases with full order details

### For Admins
- 📊 **Admin Dashboard** - Tabbed interface for products and orders
- 📦 **Product Management** - Create, edit, and delete products with full CRUD operations
- 🖼️ **Image Upload** - Upload product images to Firebase Storage with progress bars
- � **Order Management** - View all orders, metrics (total revenue, avg order value, pending orders)
- 🎯 **Protected Routes** - Admin-only access with permission checks

### Technical Highlights
- ⚡ **Next.js Image Optimization** - All images use `next/image` with Firebase Storage remote patterns
- 🔄 **Smart Data Fetching** - TanStack React Query for server state with automatic caching
- 💾 **Persistent State** - Redux Toolkit for cart and auth, synced to sessionStorage
- 🎭 **Great UX** - Loading states, error handling, toast notifications
- 📱 **Fully Responsive** - Mobile-first design with Tailwind CSS
- 🚀 **React 19 Ready** - Fixed all strict mode warnings with proper setState patterns

## 🏗️ How It's Organized

```
my-app/
├── app/                          # Next.js 16 App Router
│   ├── admin/                   # Admin dashboard with product & order tabs
│   ├── cart/                    # Shopping cart page
│   ├── login/ & register/      # Auth pages
│   ├── orders/                  # Order history & details
│   │   └── [orderId]/          # Dynamic route for order details
│   ├── profile/                 # User profile management
│   ├── layout.tsx              # Root layout with Redux & React Query providers
│   └── page.tsx                # Homepage with product grid
├── components/
│   ├── admin/                   # AdminPanel, OrderManagement, ProductForm
│   ├── cart/                    # ShoppingCart component
│   ├── layout/                  # Header with dropdown menu
│   └── products/               # ProductList, ProductCard, CategoryFilter
├── lib/
│   ├── firebase/               # Firebase config (auth, db, storage)
│   ├── services/               # Firestore & Storage service functions
│   ├── store/                  # Redux slices (auth, cart)
│   └── utils/                  # Helper functions (toasts, date formatting)
├── hooks/                       # Custom React Query hooks (useProducts, useOrders)
├── types/                       # TypeScript definitions (User, Product, Order)
└── public/                      # Static assets (favicon, images)
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+
- pnpm (or npm/yarn)
- Firebase project with Auth, Firestore, and Storage enabled

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd my-app
```

2. Install dependencies:
```bash
pnpm install
```

3. Create `.env.local` file with Firebase credentials:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

4. Run the development server:
```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## 🎨 Design & Styling

I went with a **cyberpunk theme** because I wanted something that looked cool and modern:
- Custom gradient utilities (`bg-gradient-cyber`, `shadow-cyan`) in Tailwind config
- Cyan accent colors with glow effects for that neon vibe
- Dark mode with card-based elevated surfaces
- Smooth transitions and hover effects everywhere
- Light/dark theme toggle that persists in localStorage
- Mobile-first responsive design

## 🔥 Firebase Backend

I'm using Firebase for everything backend-related:

### Firestore Collections
- **`products`** - Product catalog (title, price, description, category, imageURL, rating)
- **`users`** - User profiles (uid, email, displayName, photoURL, isAdmin flag)
- **`orders`** - Order records (userId, items, totalAmount, status, timestamps)

### Firebase Storage
Product images are stored in Firebase Storage organized by category:
```
products/
  ├── electronics/
  │   └── product123_1234567890.jpg
  ├── clothing/
  │   └── product456_9876543210.jpg
```

### Next.js Image Configuration
Added Firebase Storage to `next.config.ts` remote patterns so Next.js can optimize images:
```typescript
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'firebasestorage.googleapis.com' }
  ]
}
```

## � Migration Journey (React → Next.js)

Moving from React/Vite to Next.js was a learning experience. Here's what I did:

### Architecture Decisions
1. **State Management Split**
   - Kept Redux Toolkit for client-side state (auth, cart) since it needs to persist
   - Used TanStack React Query for server data (products, orders) - way better than useState + useEffect

2. **Server vs Client Components**
   - Added `'use client'` to components that use hooks, event handlers, or browser APIs
   - Kept pages as client components since they need interactivity
   - Could optimize further by extracting interactive parts into smaller client components

3. **Image Optimization**
   - Converted every `<img>` to Next.js `<Image>` component
   - Configured Firebase Storage URLs in `next.config.ts` remote patterns
   - Added proper `sizes` prop for responsive images

4. **React 19 Compatibility**
   - Fixed `setState` warnings by using lazy initializers: `useState(() => localStorage.getItem(...))`
   - Wrapped state updates in `queueMicrotask()` where needed

5. **Routing**
   - Migrated from React Router to Next.js App Router
   - Dynamic routes for order details: `app/orders/[orderId]/page.tsx`
   - Used `useRouter()` from `next/navigation` instead of `react-router-dom`

### What Worked Well
- Redux and React Query play nicely with Next.js
- Firebase integration stayed the same (no backend changes needed)
- Tailwind CSS config transferred directly
- TypeScript types remained unchanged

### Challenges I Solved
- Understanding when to use `'use client'` vs server components
- Configuring Next.js Image for external Firebase URLs
- Handling auth state on initial page load with Redux
- Fixing hydration mismatches with localStorage

## 🚀 Deployment

The app is ready for deployment on Vercel:

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

Or deploy directly to Vercel:
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## 📚 What I Learned

This project was a crash course in modern web development:

### Technical Skills
- **Next.js App Router** - File-based routing, layouts, and the Server/Client Component paradigm
- **Firebase Integration** - Authentication, Firestore database operations, Cloud Storage
- **State Management Architecture** - When to use Redux vs React Query vs useState
- **TypeScript** - Type safety across the entire app, custom types for User, Product, Order
- **Image Optimization** - Configuring remote patterns, responsive images with `sizes` prop
- **React 19** - Handling strict mode warnings, proper useState patterns

### Development Practices
- **Component Architecture** - Breaking down UI into reusable components
- **Service Layer Pattern** - Separating Firebase logic from components
- **Custom Hooks** - Creating reusable hooks with React Query
- **Error Handling** - Graceful error states with toast notifications
- **Responsive Design** - Mobile-first approach with Tailwind breakpoints

### Real-World E-Commerce Features
- User authentication flows (register, login, password validation)
- Shopping cart with quantity management and checkout
- Admin dashboard with role-based access control
- Image upload with progress tracking
- Order management and history
- Product CRUD operations with category filtering

### Migration Experience
- Refactoring an entire codebase from one framework to another
- Maintaining feature parity while improving architecture
- Debugging hydration issues and SSR quirks
- Performance optimization with code splitting and lazy loading

## 🔮 Future Plans

Check out [ROADMAP2.md](./ROADMAP2.md) for planned features like:
- Product search and advanced filtering
- Reviews and ratings system
- Stripe payment integration
- Email notifications
- Wishlist functionality
- Admin analytics dashboard
- And more!

## 🤝 Contributing

This is a learning project, but if you spot bugs or have suggestions, feel free to open an issue!

## 📄 License

MIT License - feel free to use this for your own projects and learning.

---

**Made by me while learning Next.js, React, TypeScript, and Firebase** 🚀

*P.S. - The cyberpunk theme was inspired by my love for neon lights and sci-fi aesthetics. Hope you enjoy using it as much as I enjoyed building it!*
