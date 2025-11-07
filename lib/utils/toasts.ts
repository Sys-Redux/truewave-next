import toast from 'react-hot-toast';

// Toast for adding items to cart
export const addToCartToast = (productTitle: string): void => {
    toast.success(`${productTitle} added to cart`, {
        duration: 2000,
        position: 'bottom-right',
    });
};

// Toast for removing items from cart
export const removeFromCartToast = (productTitle: string): void => {
    toast.success(`${productTitle} removed from cart`, {
        duration: 2000,
        position: 'bottom-right',
    });
};

// Generic success toast
export const successToast = (message: string): void => {
    toast.success(message, {
        duration: 3000,
        position: 'bottom-right',
    });
};

// Generic error toast
export const errorToast = (message: string): void => {
    toast.error(message, {
        duration: 4000,
        position: 'bottom-right',
    });
};

// Generic info toast
export const infoToast = (message: string): void => {
    toast(message, {
        duration: 3000,
        position: 'bottom-right',
    });
};
