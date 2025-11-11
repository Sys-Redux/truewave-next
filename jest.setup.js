import '@testing-library/jest-dom'

// Polyfill fetch and Response for Node.js test environment
global.fetch = jest.fn()
global.Request = jest.fn()
global.Response = jest.fn()
global.Headers = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      pathname: '/',
      query: {},
      asPath: '/',
    }
  },
  usePathname() {
    return '/'
  },
  useSearchParams() {
    return new URLSearchParams()
  },
}))
// Mock next/image to avoid issues with image loading in tests
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return <img {...props} />
  },
}))

// Mock Firebase (to avoid needing actual Firebase in tests)
jest.mock('./lib/firebase', () => ({
  auth: {
    currentUser: null,
    onAuthStateChanged: jest.fn(),
  },
  db: {},
  storage: {},
}))

// Mock Firebase auth services
jest.mock('./lib/services/authService', () => ({
  loginUser: jest.fn(),
  registerUser: jest.fn(),
  logoutUser: jest.fn(),
  updateUserProfile: jest.fn(),
}))

// Mock Firebase firestore services
jest.mock('./lib/services/firestoreService', () => ({
  saveCartToFirestore: jest.fn(),
  loadCartFromFirestore: jest.fn(),
  clearCartFromFirestore: jest.fn(),
  mergeGuestCartWithUserCart: jest.fn(),
}))

// Mock toast notifications
jest.mock('./lib/utils/toasts', () => ({
  successToast: jest.fn(),
  errorToast: jest.fn(),
  addToCartToast: jest.fn(),
  removeFromCartToast: jest.fn(),
}))

// Mock window.matchMedia (for theme testing)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock localStorage with proper jest functions
global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
}

// Mock sessionStorage with proper jest functions
global.sessionStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
}