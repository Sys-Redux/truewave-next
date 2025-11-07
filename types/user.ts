// Firebase User Type
export interface User {
    uid: string;
    email: string;
    displayName: string | null;
    photoURL: string | null;
    emailVerified: boolean;
    isAdmin: boolean;
}

// Redux Auth State
export interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
    initialized: boolean; // Track if onAuthStateChanged fired
}

// Registration Forms
export interface RegisterData {
    email: string;
    password: string;
    displayName: string;
}

// Login Forms
export interface LoginData {
    email: string;
    password: string;
}

// Profile Update Forms
export interface ProfileUpdateData {
    displayName?: string;
    photoURL?: string;
}
