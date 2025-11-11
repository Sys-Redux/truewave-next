import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ProductCard } from '@/components/products/ProductCard';
import type { Product } from '@/types/product';

const mockProduct: Product = {
    id: 'test-product-1',
    title: 'Test Laptop',
    description: 'High performance testing',
    price: 1299.99,
    category: 'electronics',
    imageURL: 'https://example.com/test-laptop.jpg',
    rating: 4.5,
    ratingCount: 150,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
}

describe('ProductCard Component', () => {
    const mockOnAddToCart = jest.fn();

    beforeEach(() => {
        mockOnAddToCart.mockClear();
    })

    it('renders product details correctly', () => {
        render(<ProductCard product={mockProduct} onAddToCart={mockOnAddToCart} />);

        expect(screen.getByText('Test Laptop')).toBeInTheDocument();
        expect(screen.getByText('High performance testing')).toBeInTheDocument();
        expect(screen.getByText('$1299.99')).toBeInTheDocument();
        expect(screen.getByText('4.5')).toBeInTheDocument();
        expect(screen.getByText('(150 reviews)')).toBeInTheDocument();
        expect(screen.getByText('electronics')).toBeInTheDocument();
    })

    it('calls onAddToCart when "Add to Cart" button is clicked', () => {
        render(<ProductCard product={mockProduct} onAddToCart={mockOnAddToCart} />);

        const button = screen.getByRole('button', { name: /add to cart/i });
        fireEvent.click(button);

        expect(mockOnAddToCart).toHaveBeenCalledTimes(1);
        expect(mockOnAddToCart).toHaveBeenCalledWith(mockProduct);
    })

    it('displays product image with correct alt text', () => {
        render(<ProductCard product={mockProduct} onAddToCart={mockOnAddToCart} />);

        const image = screen.getByAltText('Test Laptop');
        expect(image).toBeInTheDocument();
        // Note: Next.js Image component transforms the src, so we just check it exists
    })
})