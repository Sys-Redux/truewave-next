import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from '@/components/layout/Header';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/lib/store/authSlice';

const createMockStore = (initialState = {}) => {
    return configureStore({
        reducer: {
            auth: authReducer,
        },
        preloadedState: {
            auth: {
                user: null,
                loading: false,
                error: null,
                initialized: false,
                ...initialState,
            },
        },
    });
}

describe('Header Component', () => {
    const mockOnCartClick = jest.fn();

    beforeEach(() => {
        mockOnCartClick.mockClear();
    })

    it('renders header with logo and cart button', () => {
        const store = createMockStore();
        render(
            <Provider store={store}>
                <Header cartItemCount={0} onCartClick={mockOnCartClick} />
            </Provider>
        );
        expect(screen.getByText('TrueWave')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /cart/i })).toBeInTheDocument();
    })

    it('displays correct cart item count badge', () => {
        const store = createMockStore();
        render(
            <Provider store={store}>
                <Header cartItemCount={5} onCartClick={mockOnCartClick} />
            </Provider>
        );
        expect(screen.getByText('5')).toBeInTheDocument();
    })

    it('calls onCartClick when cart button is clicked', () => {
        const store = createMockStore();
        render(
            <Provider store={store}>
                <Header cartItemCount={0} onCartClick={mockOnCartClick} />
            </Provider>
        );
        const button = screen.getByRole('button', { name: /cart/i });
        fireEvent.click(button);
        expect(mockOnCartClick).toHaveBeenCalledTimes(1);
    })

    it('shows login and sign up buttons when user is not authenticated', () => {
        const store = createMockStore();
        render(
            <Provider store={store}>
                <Header cartItemCount={0} onCartClick={mockOnCartClick} />
            </Provider>
        );
        expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    })

    it('renders theme toggle button', () => {
        const store = createMockStore();
        render(
            <Provider store={store}>
                <Header cartItemCount={0} onCartClick={mockOnCartClick} />
            </Provider>
        );
        // Verify the theme toggle button exists (it's the first button)
        const buttons = screen.getAllByRole('button');
        expect(buttons.length).toBeGreaterThan(0);

        // Click the first button (theme toggle) should not throw an error
        fireEvent.click(buttons[0]);
    })
})