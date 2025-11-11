import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import cartReducer, { addToCart, selectCartItems } from '@/lib/store/cartSlice'
import { ProductCard } from '@/components/products/ProductCard'
import type { Product } from '@/types/product'

// Mock product
const mockProduct: Product = {
  id: 'integration-test-1',
  title: 'Integration Test Product',
  description: 'Testing cart integration',
  price: 99.99,
  category: 'electronics',
  imageURL: 'https://via.placeholder.com/300',
  rating: 4.0,
  ratingCount: 50,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

describe('Cart Integration Test', () => {
  it('updates cart state when adding a product from ProductCard', async () => {
    // Create a real Redux store
    const store = configureStore({
      reducer: {
        cart: cartReducer,
      },
    })

    // Mock onAddToCart that dispatches to Redux
    const handleAddToCart = (product: Product) => {
      store.dispatch(addToCart(product))
    }

    // Render ProductCard with Redux Provider
    render(
      <Provider store={store}>
        <ProductCard product={mockProduct} onAddToCart={handleAddToCart} />
      </Provider>
    )

    // Initially, cart should be empty
    let cartState = selectCartItems(store.getState())
    expect(cartState).toHaveLength(0)

    // Find and click "Add to Cart" button
    const addButton = screen.getByRole('button', { name: /add to cart/i })
    fireEvent.click(addButton)

    // Wait for state update
    await waitFor(() => {
      cartState = selectCartItems(store.getState())
      expect(cartState).toHaveLength(1)
    })

    // Verify the product was added with correct details
    expect(cartState[0].product.id).toBe('integration-test-1')
    expect(cartState[0].product.title).toBe('Integration Test Product')
    expect(cartState[0].quantity).toBe(1)

    // Click "Add to Cart" again to test quantity increment
    fireEvent.click(addButton)

    await waitFor(() => {
      cartState = selectCartItems(store.getState())
      // Should still be 1 item, but quantity should be 2
      expect(cartState).toHaveLength(1)
      expect(cartState[0].quantity).toBe(2)
    })
  })

  it('handles multiple products in cart correctly', async () => {
    const store = configureStore({
      reducer: {
        cart: cartReducer,
      },
    })

    const product1: Product = { ...mockProduct, id: 'prod-1', title: 'Product 1' }
    const product2: Product = { ...mockProduct, id: 'prod-2', title: 'Product 2' }

    // Add first product
    store.dispatch(addToCart(product1))

    await waitFor(() => {
      const cartState = selectCartItems(store.getState())
      expect(cartState).toHaveLength(1)
    })

    // Add second product
    store.dispatch(addToCart(product2))

    await waitFor(() => {
      const cartState = selectCartItems(store.getState())
      expect(cartState).toHaveLength(2)
      expect(cartState[0].product.id).toBe('prod-1')
      expect(cartState[1].product.id).toBe('prod-2')
    })
  })
})