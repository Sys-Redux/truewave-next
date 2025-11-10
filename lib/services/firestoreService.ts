import {
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    setDoc,
    query,
    where,
    orderBy,
    serverTimestamp,
    Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Product, ProductFormData } from '@/types/product';
import type { Order, CreateOrderData } from '@/types/order';
import type { CartItem } from '@/lib/utils/storage'

// Collection reference
const productsCollection = collection(db, 'products');
const ordersCollection = collection(db, 'orders');
const cartsCollection = collection(db, 'carts');

// Convert Firestore Timestamp to ISO string for serialization
const convertTimestamps = <T extends Record<string, unknown>>(data: T): T => {
    const converted: Record<string, unknown> = { ...data };

    // Handle createdAt - convert to ISO string
    if (data.createdAt instanceof Timestamp) {
        converted.createdAt = data.createdAt.toDate().toISOString();
    } else if (data.createdAt === null || data.createdAt === undefined) {
        converted.createdAt = new Date().toISOString();
    }

    // Handle updatedAt - convert to ISO string
    if (data.updatedAt instanceof Timestamp) {
        converted.updatedAt = data.updatedAt.toDate().toISOString();
    } else if (data.updatedAt === null || data.updatedAt === undefined) {
        converted.updatedAt = new Date().toISOString();
    }

    return converted as T;
};

// ======================================================================================
// Product Service Functions
// ======================================================================================
// Get All Products
export const getAllProducts = async (): Promise<Product[]> => {
    try {
        // Try with orderBy first
        try {
            const querySnapshot = await getDocs(
                query(productsCollection, orderBy('createdAt', 'desc'))
            );

            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...convertTimestamps(doc.data()),
            })) as Product[];
        } catch (orderError) {
            // If orderBy fails (missing field or index), fetch without ordering
            console.warn('Fetching products without ordering:', orderError);
            const querySnapshot = await getDocs(productsCollection);

            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...convertTimestamps(doc.data()),
            })) as Product[];
        }
    } catch (error) {
        console.error('Error fetching products:', error);
        throw new Error('Failed to fetch products');
    }
};

// Get Products by Category
export const getProductsByCategory = async (category: string): Promise<Product[]> => {
    try {
        // Try with orderBy first
        try {
            const q = query(
                productsCollection,
                where('category', '==', category),
                orderBy('createdAt', 'desc')
            );
            const querySnapshot = await getDocs(q);

            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...convertTimestamps(doc.data()),
            })) as Product[];
        } catch (orderError) {
            // If orderBy fails (missing index or field), fetch without ordering
            console.warn('Fetching products by category without ordering:', orderError);
            const q = query(
                productsCollection,
                where('category', '==', category)
            );
            const querySnapshot = await getDocs(q);

            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...convertTimestamps(doc.data()),
            })) as Product[];
        }
    } catch (error) {
        console.error('Error fetching products by category:', error);
        throw new Error('Failed to fetch products by category');
    }
};

// Get Product by ID
export const getProductById = async (productId: string): Promise<Product | null> => {
    try {
        const docRef = doc(db, 'products', productId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return {
                id: docSnap.id,
                ...convertTimestamps(docSnap.data()),
            } as Product;
        }

        return null;
    } catch (error) {
        console.error('Error fetching product by ID:', error);
        throw new Error('Failed to fetch product by ID');
    }
};

// Add New Product
export const createProduct = async (productData: ProductFormData): Promise<string> => {
    try {
        // Filter out empty strings to avoid Firestore validation errors
        const cleanedData: Record<string, unknown> = {};
        Object.entries(productData).forEach(([key, value]) => {
            if (value !== '' && value !== null && value !== undefined) {
                cleanedData[key] = value;
            }
        });

        const docRef = await addDoc(productsCollection, {
            ...cleanedData,
            rating: 0,
            ratingCount: 0,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
        return docRef.id;
    } catch (error) {
        console.error('Error creating product:', error);
        throw new Error('Failed to create product');
    }
};

// Update Existing Product
export const updateProduct = async (
    productId: string,
    productData: Partial<ProductFormData>
): Promise<void> => {
    try {
        // Filter out empty strings to avoid Firestore validation errors
        const cleanedData: Record<string, unknown> = {};
        Object.entries(productData).forEach(([key, value]) => {
            if (value !== '' && value !== null && value !== undefined) {
                cleanedData[key] = value;
            }
        });

        const docRef = doc(db, 'products', productId);
        await updateDoc(docRef, {
            ...cleanedData,
            updatedAt: serverTimestamp(),
        });
    } catch (error) {
        console.error('Error updating product:', error);
        throw new Error('Failed to update product');
    }
};

// Delete Product
export const deleteProduct = async (productId: string): Promise<void> => {
    try {
        const docRef = doc(db, 'products', productId);
        await deleteDoc(docRef);
    } catch (error) {
        console.error('Error deleting product:', error);
        throw new Error('Failed to delete product');
    }
};

// ======================================================================================
// Order Service Functions
// ======================================================================================
// Create New Order
export const createOrder = async (orderData: CreateOrderData): Promise<string> => {
    try {
        const docRef = await addDoc(ordersCollection, {
            ...orderData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
        console.log('Order created with ID:', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('Error creating order:', error);
        throw new Error('Failed to create order');
    }
};

// Get All Order for a Specific User
export const getUserOrders = async (userId: string): Promise<Order[]> => {
    try {
        const q = query(
            ordersCollection,
            where('userId', '==', userId),
            orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...convertTimestamps(doc.data()),
        })) as Order[];
    } catch (error) {
        console.error('Error fetching user orders:', error);
        throw new Error('Failed to fetch user orders');
    }
};

// Get Order by ID
export const getOrderById = async (orderId: string): Promise<Order | null> => {
    try {
        const docRef = doc(db, 'orders', orderId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return {
                id: docSnap.id,
                ...convertTimestamps(docSnap.data()),
            } as Order;
        }

        return null;
    } catch (error) {
        console.error('Error fetching order by ID:', error);
        throw new Error('Failed to fetch order by ID');
    }
};

// ======================================================================================
// User Service Functions
// ======================================================================================

// Firestore User Document Type (what we store in Firestore)
export interface FirestoreUserData {
    uid: string;
    email: string;
    displayName: string | null;
    photoURL: string | null;
    isAdmin: boolean;
    createdAt: string | Timestamp;
    updatedAt: string | Timestamp;
}

// Create User Document in Firestore
export const createUserDocument = async (
    uid: string,
    email: string,
    displayName: string | null = null,
    photoURL: string | null = null
): Promise<void> => {
    try {
        const userDocRef = doc(db, 'users', uid);
        await setDoc(userDocRef, {
            uid,
            email,
            displayName,
            photoURL,
            isAdmin: false, // Default to non-admin
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
    } catch (error) {
        console.error('Error creating user document:', error);
        throw new Error('Failed to create user document');
    }
};

// Get User Document from Firestore
export const getUserDocument = async (uid: string): Promise<FirestoreUserData | null> => {
    try {
        const userDocRef = doc(db, 'users', uid);
        const userSnap = await getDoc(userDocRef);

        if (userSnap.exists()) {
            return convertTimestamps(userSnap.data()) as FirestoreUserData;
        }

        return null;
    } catch (error) {
        console.error('Error fetching user document:', error);
        throw new Error('Failed to fetch user document');
    }
};

// Update User Document in Firestore
export const updateUserDocument = async (
    uid: string,
    data: Partial<Omit<FirestoreUserData, 'uid' | 'createdAt' | 'updatedAt'>>
): Promise<void> => {
    try {
        const userDocRef = doc(db, 'users', uid);
        await updateDoc(userDocRef, {
            ...data,
            updatedAt: serverTimestamp(),
        });
    } catch (error) {
        console.error('Error updating user document:', error);
        throw new Error('Failed to update user document');
    }
};

// Delete User Document from Firestore
export const deleteUserDocument = async (uid: string): Promise<void> => {
    try {
        const userDocRef = doc(db, 'users', uid);
        await deleteDoc(userDocRef);
    } catch (error) {
        console.error('Error deleting user document:', error);
        throw new Error('Failed to delete user document');
    }
};

// Set Admin Status
export const setUserAdminStatus = async (uid: string, isAdmin: boolean): Promise<void> => {
    try {
        await updateUserDocument(uid, { isAdmin });
    } catch (error) {
        console.error('Error setting admin status:', error);
        throw new Error('Failed to set admin status');
    }
};

// ======================================================================================
// Cart Service Functions
// ======================================================================================

export const saveCartToFirestore = async (
    userId: string,
    items: CartItem[]
): Promise<void> => {
    try {
        const cartDocRef = doc(cartsCollection, userId);

        // If Cart is Empty, Delete the Document
        if (items.length === 0) {
            await deleteDoc(cartDocRef);
            return;
        }

        // Save or Update Cart Document
        await setDoc(cartDocRef, {
            userId,
            items,
            updatedAt: serverTimestamp(),
        });
    } catch (error) {
        console.error('Error saving cart to Firestore:', error);
        throw new Error('Failed to save cart to Firestore');
    }
};

export const loadCartFromFirestore = async (
    userId: string
): Promise<CartItem[]> => {
    try {
        const cartDocRef = doc(cartsCollection, userId);
        const cartSnap = await getDoc(cartDocRef);

        if (cartSnap.exists()) {
            const data = cartSnap.data();
            return data.items as CartItem[] || [];
        }

        return [];
    } catch (error) {
        console.error('Error loading cart from Firestore:', error);
        return [];
    }
};

export const clearCartFromFirestore = async (
    userId: string
): Promise<void> => {
    try {
        const cartDocRef = doc(cartsCollection, userId);
        await deleteDoc(cartDocRef);
    } catch (error) {
        console.error('Error clearing cart from Firestore:', error);
        throw new Error('Failed to clear cart from Firestore');
    }
};

export const mergeGuestCartWithUserCart = async (
    userId: string,
    guestItems: CartItem[]
): Promise<CartItem[]> => {
    try {
        // Load User's Existing Cart from Firestore
        const userCart = await loadCartFromFirestore(userId);

        if (guestItems.length === 0) {
            return userCart;
        }

        if (userCart.length === 0) {
            await saveCartToFirestore(userId, guestItems);
            return guestItems;
        }

        // Merge Logic: Combine Quantities for Duplicate Products
        const mergedCart = [...userCart];
        guestItems.forEach((guestItem) => {
            const existingItem = mergedCart.find(
                (item) => item.product.id === guestItem.product.id
            );

            if (existingItem) {
                existingItem.quantity += guestItem.quantity;
            } else {
                mergedCart.push(guestItem);
            }
        });

        await saveCartToFirestore(userId, mergedCart);
        return mergedCart;
    } catch (error) {
        console.error('Error merging guest cart with user cart:', error);
        // Fallback: Return Guest Cart if Merge Fails
        return guestItems;
    }
};