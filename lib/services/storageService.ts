import {
    ref,
    uploadBytes,
    uploadBytesResumable,
    getDownloadURL,
    deleteObject,
    type UploadTaskSnapshot,
} from "firebase/storage";
import { storage } from "@/lib/firebase";

export const uploadProductImage = async (
    file: File,
    category: string,
    productId?: string
): Promise<{ path: string, downloadURL: string }> => {
    try {
        // Validate File Type
        if (!file.type.startsWith('image/')) {
            throw new Error('File must be an image');
        }
        // Generate Unique Filename
        const timestamp = Date.now();
        const filename = productId
            ? `${productId}_${timestamp}.${file.name.split('.').pop()}`
            : `${timestamp}_${file.name}`;

        // Create Storage Ref for Firebase Storage
        const storageRef = ref(storage, `products/${category}/${filename}`);

        // Upload File
        const snapshot = await uploadBytes(storageRef, file, {
            contentType: file.type,
        });

        // Get Download URL
        const downloadURL = await getDownloadURL(snapshot.ref);

        return {
            path: snapshot.ref.fullPath,
            downloadURL,
        };
    } catch (error) {
        console.error('Error uploading product image:', error);
        throw new Error('Failed to upload product image');
    }
};

export const uploadProductImageWithProgress = (
    file: File,
    category: string,
    onProgress: (progress: number) => void,
    productId?: string
): Promise<{ path: string, downloadURL: string }> => {
    return new Promise((resolve, reject) => {
        if (!file.type.startsWith('image/')) {
            return reject(new Error('File must be an image'));
        }

        const timestamp = Date.now();
        const filename = productId
            ? `${productId}_${timestamp}.${file.name.split('.').pop()}`
            : `${timestamp}_${file.name}`;

        const storageRef = ref(storage, `products/${category}/${filename}`);
        const uploadTask = uploadBytesResumable(storageRef, file, {
            contentType: file.type,
        });

        uploadTask.on('state_changed',
            (snapshot: UploadTaskSnapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                onProgress(progress);
            },
            (error) => {
                console.error('Error uploading product image:', error);
                reject(new Error('Failed to upload product image'));
            },
            async () => {
                try {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    resolve({
                        path: uploadTask.snapshot.ref.fullPath,
                        downloadURL,
                    });
                } catch (error) {
                    console.error('Error getting download URL:', error);
                    reject(new Error('Failed to get download URL'));
                }
            }
        );
    });
};

// Delete Product Image from Storage
export const deleteProductImage = async (storagePath: string): Promise<void> => {
    try {
        const storageRef = ref(storage, storagePath);
        await deleteObject(storageRef);
    } catch (error) {
        console.error('Error deleting product image:', error);
        throw new Error('Failed to delete product image');
    }
};

// Get Download URL for Existing Image
export const getImageDownloadURL = async (storagePath: string): Promise<string> => {
    try {
        const storageRef = ref(storage, storagePath);
        return await getDownloadURL(storageRef);
    } catch (error) {
        console.error('Error getting image download URL:', error);
        throw new Error('Failed to get image download URL');
    }
};