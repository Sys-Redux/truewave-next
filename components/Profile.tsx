import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { User, Mail, Shield, Edit2, Save, X, Trash2, AlertTriangle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/store';
import {
    selectCurrentUser,
    selectAuthLoading,
    selectAuthError,
    updateProfile,
    logout,
} from '@/lib/store/authSlice';
import { auth } from '@/lib/firebase';
import { deleteUser } from 'firebase/auth';
import { Toaster } from 'react-hot-toast';
import { errorToast, successToast } from '@/lib/utils/toasts';

export const Profile = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const user = useAppSelector(selectCurrentUser);
    const loading = useAppSelector(selectAuthLoading);
    const error = useAppSelector(selectAuthError);

    // Edit mode state
    const [isEditing, setIsEditing] = useState(false);
    const [displayName, setDisplayName] = useState(user?.displayName || '');
    const [photoURL, setPhotoURL] = useState(user?.photoURL || '');

    // Delete confirmation state
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');

    const handleSaveProfile = async (e: FormEvent) => {
        e.preventDefault();

        if (!displayName.trim()) {
            errorToast('❌ Display name cannot be empty.');
            return;
        }

        const result = await dispatch(updateProfile({
            displayName: displayName.trim(),
            photoURL: photoURL.trim() || undefined,
        }));

        if (updateProfile.fulfilled.match(result)) {
            successToast('✅ Profile updated successfully.');
            setIsEditing(false);
        } else {
            errorToast(error || '❌ Failed to update profile.');
        }
    };

    const handleCancelEdit = () => {
        setDisplayName(user?.displayName || '');
        setPhotoURL(user?.photoURL || '');
        setIsEditing(false);
    };

    const handleDeleteAccount = async () => {
        if (deleteConfirmText !== 'DELETE') {
            errorToast('❌ Please type DELETE to confirm.');
            return;
        }

        try {
            const currentUser = auth.currentUser;
            if (!currentUser) {
                errorToast('❌ No authenticated user.');
                return;
            }

            // Delete user from Firebase Auth
            await deleteUser(currentUser);

            // Logout (clears Redux state)
            await dispatch(logout());

            successToast('✅ Account deleted successfully.');
            router.push('/register');
        } catch (error: unknown) {
            if ((error as { code?: string }).code === 'auth/requires-recent-login') {
                errorToast('❌ Please log out and log back in before deleting your account.');
            } else {
                errorToast('❌ Failed to delete account.');
            }
            setShowDeleteModal(false);
        }
    };

    if (!user) {
        return null; // ProtectedRoute will handle redirect
    };



    return (
        <div className='min-h-[calc(100vh-4rem)] px-4 py-12'>
            <Toaster />
            <div className='max-w-3xl mx-auto'>

                {/* Header */}
                <div className='mb-8'>
                    <h1 className='text-3xl font-bold mb-2'>
                        <span className='text-text-primary'>Your </span>
                        <span className='text-gradient-cyber'>Profile</span>
                    </h1>
                    <p className='text-text-muted font-mono text-sm'>
                        {'// Manage your account settings'}
                    </p>
                </div>

                {/* Profile Card */}
                <div className='bg-bg-secondary border border-border rounded-2xl p-8 shadow-xl mb-6'>

                    {/* Profile Header */}
                    <div className='flex items-start justify-between mb-8'>
                        <div className='flex items-center gap-4'>
                            {/* Avatar */}
                            <div className='relative'>
                                {user.photoURL ? (
                                    <div className='relative w-20 h-20 rounded-full border-2 border-accent shadow-cyan overflow-hidden'>
                                        <Image
                                            src={user.photoURL}
                                            alt={user.displayName || 'User'}
                                            fill
                                            className='object-cover'
                                            sizes="80px"
                                        />
                                    </div>
                                ) : (
                                    <div className='w-20 h-20 rounded-full bg-gradient-cyber flex items-center
                                        justify-center shadow-cyan'>
                                        <User className='w-10 h-10 text-bg-primary' />
                                    </div>
                                )}
                                {/* Online Indicator */}
                                <div className='absolute bottom-1 right-1 w-4 h-4 bg-success border-2
                                    border-bg-secondary rounded-full' />
                            </div>

                            {/* User Info */}
                            <div>
                                <h2 className='text-2xl font-bold text-text-primary'>
                                    {user.displayName || 'No Named User'}
                                </h2>
                                <p className='text-text-muted font-mono text-sm'>{user.email}</p>
                            </div>
                        </div>

                        {/* Edit Button */}
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className='flex items-center gap-2 px-4 py-2 bg-bg-elevated hover:bg-bg-hover
                                    border border-border rounded-lg hover:border-accent transition-all group'
                            >
                                <Edit2 className='w-4 h-4 text-text-secondary group-hover:text-accent transition-colors' />
                                <span className='text-text-primary font-medium'>Edit</span>
                            </button>
                        )}
                    </div>

                    {/* Profile Information */}
                    {!isEditing ? (
                        // View Mode
                        <div className='space-y-6'>

                            {/* Display Name */}
                            <div className='flex items-start gap-4 p-4 bg-bg-elevated rounded-lg'>
                                <User className='w-5 h-5 text-accent mt-0.5' />
                                <div className='flex-1'>
                                    <label className='block text-sm font-medium text-text-secondary mb-1 font-mono'>
                                        Display Name
                                    </label>
                                    <p className='text-text-primary'>{user.displayName || 'Not set'}</p>
                                </div>
                            </div>

                            {/* Email */}
                            <div className='flex items-start gap-4 p-4 bg-bg-elevated rounded-lg'>
                                <Mail className='w-5 h-5 text-accent mt-0.5' />
                                <div className='flex-1'>
                                    <label className='block text-sm font-medium text-text-secondary mb-1 font-mono'>
                                        Email Address
                                    </label>
                                    <p className='text-text-primary'>{user.email}</p>
                                    <p className='text-text-muted text-xs mt-1 font-mono'>
                                        Email cannot be changed
                                    </p>
                                </div>
                            </div>

                            {/* Email Verified */}
                            <div className='flex items-start gap-4 p-4 bg-bg-elevated rounded-lg'>
                                <Shield className='w-5 h-5 text-accent mt-0.5' />
                                <div className='flex-1'>
                                    <label className='block text-sm font-medium text-text-secondary mb-1 font-mono'>
                                        Email Verified
                                    </label>
                                    <div className='flex items-center gap-2'>
                                        {user.emailVerified ? (
                                            <>
                                                <div className='w-2 h-2 bg-success rounded-full animate-pulse' />
                                                <span className='text-success font-medium'>Verified</span>
                                            </>
                                        ) : (
                                            <>
                                                <div className='w-2 h-2 bg-error rounded-full animate-pulse' />
                                                <span className='text-error font-medium'>Not Verified</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Photo URL */}
                            {user.photoURL && (
                                <div className='flex items-start gap-4 p-4 bg-bg-elevated rounded-lg'>
                                    <User className='w-5 h-5 text-accent mt-0.5' />
                                    <div className='flex-1'>
                                        <label className='block text-sm font-medium text-text-secondary mb-1 font-mono'>
                                            Profile Photo URL
                                        </label>
                                        <p className='text-text-primary text-sm break-all'>{user.photoURL}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        // Edit Mode
                        <form onSubmit={handleSaveProfile} className='space-y-6'>

                            {/* Display Name Field */}
                            <div>
                                <label htmlFor='displayName' className='block text-sm font-medium
                                    text-text-secondary mb-2 font-mono'>
                                    Display Name
                                </label>
                                <input
                                    id='displayName'
                                    type='text'
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    className='w-full px-4 py-3 bg-bg-elevated border border-border rounded-lg
                                        focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent
                                        text-text-primary placeholder:text-text-muted transition-all'
                                    placeholder='Enter your display name'
                                    disabled={loading}
                                    required
                                />
                            </div>

                            {/* Photo URL Field */}
                            <div>
                                <label htmlFor='photoURL' className='block text-sm font-medium
                                    text-text-secondary mb-2 font-mono'>
                                    Profile Photo URL
                                </label>
                                <input
                                    id='photoURL'
                                    type='url'
                                    value={photoURL}
                                    onChange={(e) => setPhotoURL(e.target.value)}
                                    className='w-full px-4 py-3 bg-bg-elevated border border-border rounded-lg
                                        focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent
                                        text-text-primary placeholder:text-text-muted transition-all'
                                    placeholder='Enter your profile photo URL'
                                    disabled={loading}
                                />
                                <p className='mt-2 text-xs text-text-muted font-mono'>
                                    Enter a valid image URL for your profile picture
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className='flex gap-3 pt-4'>
                                <button
                                    type='submit'
                                    disabled={loading}
                                    className='flex items-center justify-center gap-2 px-4 py-3 bg-gradient-cyber
                                        text-bg-primary font-bold rounded-lg hover:shadow-cyan transition-all
                                        disabled:opacity-50 disabled:cursor-not-allowed'
                                >
                                    {loading ? (
                                        <>
                                            <div className='w-5 h-5 border-2 border-bg-primary/30 border-t-bg-primary
                                                rounded-full animate-spin' />
                                            <span>Saving...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Save className='w-5 h-5' />
                                            <span>Save Changes</span>
                                        </>
                                    )}
                                </button>

                                <button
                                    type='button'
                                    onClick={handleCancelEdit}
                                    disabled={loading}
                                    className='px-6 py-3 border border-border hover:border-error hover:bg-error/10
                                        text-text-primary hover:text-error font-medium rounded-lg transition-all
                                        disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2'
                                >
                                    <X className='w-5 h-5' />
                                    <span>Cancel</span>
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                {/* Danger Zone */}
                {isEditing && (
                    <div className='bg-bg-secondary border-2 border-error/50 rounded-2xl p-8 shadow-xl'>
                        <div className='flex items-start gap-4 mb-6'>
                            <div className='shrink-0'>
                                <div className='w-12 h-12 bg-error/20 rounded-xl flex items-center justify-center'>
                                    <AlertTriangle className='w-6 h-6 text-error' />
                                </div>
                            </div>
                            <div>
                                <h3 className='text-xl font-bold text-error mb-2'>Danger Zone</h3>
                                <p className='text-text-muted text-sm'>
                                    Deleting your account is irreversible. All your data will be lost.
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowDeleteModal(true)}
                            className='flex items-center gap-2 px-6 py-3 bg-error/10 hover:bg-error/20
                                border-2 border-error text-error font-bold rounded-lg transition-all group'
                        >
                            <Trash2 className='w-5 h-5 group-hover:scale-110 transition-transform' />
                            <span>Delete Account</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className='fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
                    <div className='bg-bg-secondary border-2 border-error rounded-2xl p-8 shadow-2xl max-w-md w-full'>

                        {/* Modal Header */}
                        <div className='flex items-center gap-4 mb-6'>
                            <div className='w-16 h-16 bg-error/20 rounded-xl flex items-center justify-center'>
                                <AlertTriangle className='w-8 h-8 text-error' />
                            </div>
                            <div>
                                <h3 className='text-2xl font-bold text-error'>Confirm Account Deletion</h3>
                                <p className='text-text-muted text-sm'>
                                    This action cannot be undone.
                                </p>
                            </div>
                        </div>

                        {/* Warning Text */}
                        <div className='bg-error/10 border border-error/50 rounded-lg p-4 mb-6'>
                            <p className='text-text-primary text-sm leading-relaxed'>
                                You are about to permanently delete your account. All your date, including orders
                                and profile information, will be lost forever.
                            </p>
                        </div>

                        {/* Confirmation Input */}
                        <div className='mb-6'>
                            <label htmlFor='deleteConfirm' className='block text-sm font-medium
                                text-text-secondary mb-2 font-mono'>
                                Type <span className='font-bold text-error'>DELETE</span> to confirm:
                            </label>
                            <input
                                id='deleteConfirm'
                                type='text'
                                value={deleteConfirmText}
                                onChange={(e) => setDeleteConfirmText(e.target.value)}
                                className='w-full px-4 py-3 bg-bg-elevated border-2 border-error/50 rounded-lg
                                    focus:outline-none focus:ring-2 focus:ring-error focus:border-error
                                    text-text-primary placeholder:text-text-muted transition-all'
                                placeholder='Type DELETE'
                                autoFocus
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className='flex gap-3'>
                            <button
                                onClick={handleDeleteAccount}
                                disabled={deleteConfirmText !== 'DELETE'}
                                className='flex-1 px-4 py-3 bg-error hover:bg-error/90 text-white font-bold
                                    rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed'
                            >
                                Delete Forever
                            </button>
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setDeleteConfirmText('');
                                }}
                                className='px-6 py-3 border-2 border-border hover:border-accent text-text-primary
                                    font-medium rounded-lg transition-all'
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};