# TrueWave - Cyber E-Commerce Store

A modern, full-featured e-commerce application with a cyberpunk-inspired design. This project started as a React + Vite application but was migrated to Next.js 16 to take advantage of App Router, Server Components, and better performance optimization.

## 🚀 Project Evolution

Initially built with React and Vite for fast development and hot module replacement, I decided to migrate the entire application to Next.js to benefit from:
- **App Router** for file-based routing
- **Server Components** for improved performance
- **Image Optimization** with next/image
- **Better SEO** capabilities
- **Production-ready** deployment options

The migration maintained 100% feature parity while improving the overall architecture and performance.

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

## ✨ Features

### User Features
- 🔐 **Authentication** - Register, login, logout with Firebase Auth
- 🛒 **Shopping Cart** - Add/remove items, quantity management, persistent storage
- 🎨 **Dark/Light Theme** - Toggle between themes with persistent preferences
- 👤 **Profile Management** - Update display name, photo, view orders
- 🔍 **Product Browsing** - Category filtering, search, detailed views
- 💳 **Checkout** - Order placement with Firebase integration

### Admin Features
- 📦 **Product Management** - CRUD operations for products
- 🖼️ **Image Upload** - Firebase Storage integration with progress tracking
- 📊 **Dashboard** - Product statistics and overview
- 🎯 **Admin-Only Access** - Protected routes for admin users

### Technical Features
- ⚡ **Optimized Images** - All images use Next.js Image component
- 🔄 **Real-time Updates** - React Query for automatic data synchronization
- 💾 **Persistent Cart** - Cart survives page refreshes
- 🎭 **Loading States** - Skeleton screens and spinners
- ⚠️ **Error Handling** - Toast notifications for all actions
- 📱 **Responsive Design** - Mobile-first approach

## 🏗️ Project Structure

```
my-app/
├── app/                      # Next.js App Router pages
│   ├── admin/               # Admin dashboard
│   ├── cart/                # Shopping cart page
│   ├── login/               # Login page
│   ├── profile/             # User profile
│   ├── register/            # Registration page
│   ├── layout.tsx           # Root layout with providers
│   └── page.tsx             # Home page
├── components/              # React components
│   ├── admin/              # Admin-specific components
│   ├── cart/               # Cart components
│   ├── layout/             # Layout components (Header, Footer)
│   └── products/           # Product display components
├── lib/                     # Core business logic
│   ├── firebase.ts         # Firebase initialization
│   ├── services/           # Firebase service layers
│   ├── store/              # Redux slices and store
│   └── utils/              # Helper functions
├── hooks/                   # Custom React hooks
├── types/                   # TypeScript type definitions
├── context/                 # React context providers
└── public/                  # Static assets

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

## 🎨 Design Philosophy

The application features a **cyberpunk-inspired design** with:
- Custom gradient utilities (`bg-gradient-cyber`)
- Cyan accent colors with glow effects (`shadow-cyan`)
- Dark theme with elevated surfaces
- Smooth transitions and animations
- Modern, clean UI with excellent contrast

## 🔥 Firebase Setup

### Firestore Collections
- `products` - Product catalog with images, pricing, categories
- `users` - User profiles with display names and admin flags
- `orders` - Order history with items and totals

### Storage Structure
```
products/
  ├── category-name/
  │   ├── product-id.jpg
  │   └── product-id-2.jpg
```

### Security Rules
Make sure to configure Firestore and Storage security rules appropriately for production use.

## 📝 Key Migration Decisions

When migrating from React/Vite to Next.js, I:
1. ✅ Kept Redux for cart and auth state (client-side state)
2. ✅ Used React Query for server data (products, orders)
3. ✅ Converted all `<img>` tags to `<Image>` components
4. ✅ Added `'use client'` directives where needed
5. ✅ Used `useState` lazy initializers to avoid React 19 warnings
6. ✅ Configured Firebase Storage in `next.config.ts` for Image optimization
7. ✅ Maintained the original Tailwind theme and styling

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

- Migrating a full React application to Next.js App Router
- Using Server Components effectively while maintaining client interactivity
- Configuring Redux Toolkit with Next.js patterns
- Optimizing images with next/image and remote patterns
- Managing Firebase authentication in Next.js
- Handling React 19 strict mode warnings
- Building a production-ready e-commerce platform

## 🤝 Contributing

Feel free to open issues or submit pull requests for improvements!

## 📄 License

This project is open source and available under the MIT License.

---

**Built with ❤️ using Next.js, React, and Firebase**
