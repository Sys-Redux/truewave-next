// This wraps Firebase's SDK functions
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    type User as FirebaseUser,
    type UserCredential,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import type { User, RegisterData, LoginData, ProfileUpdateData } from '@/types/user';
import { createUserDocument, getUserDocument, updateUserDocument } from '@/lib/services/firestoreService';

// Helper: Convert FirebaseUser to our User type
export const mapFirebaseUser = async (firebaseUser: FirebaseUser): Promise<User> => {
    const firestoreData = await getUserDocument(firebaseUser.uid);

    return {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        emailVerified: firebaseUser.emailVerified,
        isAdmin: firestoreData?.isAdmin || false,
    };
};

// Sync version of mapFirebaseUser (for cases where we already have Firestore data)
export const mapFirebaseUserSync = (
    firebaseUser: FirebaseUser,
    isAdmin: boolean = false
): User => ({
    uid: firebaseUser.uid,
    email: firebaseUser.email || '',
    displayName: firebaseUser.displayName,
    photoURL: firebaseUser.photoURL,
    emailVerified: firebaseUser.emailVerified,
    isAdmin,
});

// Register New User
export const registerUser = async (data: RegisterData): Promise<User> => {
    // Create Auth Account
    const userCredential: UserCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
    );

    // Set Display Name (Firebase doesn't set it on registration)
    if (data.displayName) {
        await updateProfile(userCredential.user, {
            displayName: data.displayName,
        });
    }

    // Create Firestore User Document
    await createUserDocument(
        userCredential.user.uid,
        userCredential.user.email || '',
        data.displayName,
        null // photoURL
    );

    // Return Mapped User (will fetch from Firestore)
    return await mapFirebaseUser(userCredential.user);
};

// Login Existing User
export const loginUser = async (data: LoginData): Promise<User> => {
    const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
    );

    // Fetch user data including isAdmin from Firestore
    return await mapFirebaseUser(userCredential.user);
};

// Logout Current User
export const logoutUser = async (): Promise<void> => {
    await signOut(auth);
};

// Update User Profile
export const updateUserProfile = async (data: ProfileUpdateData): Promise<void> => {
    if (!auth.currentUser) {
        throw new Error('No authenticated user');
    }

    // Update Firebase Auth profile
    await updateProfile(auth.currentUser, data);

    // Update Firestore user document
    await updateUserDocument(auth.currentUser.uid, {
        displayName: data.displayName || auth.currentUser.displayName,
        photoURL: data.photoURL || auth.currentUser.photoURL,
    });
};
