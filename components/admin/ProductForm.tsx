import { useState, useEffect, useRef, type FormEvent, type ChangeEvent } from 'react';
import Image from 'next/image';
import { X, Upload, Loader2, Save, AlertCircle } from 'lucide-react';
import { useProduct, useCreateProduct, useUpdateProduct } from '@/hooks/useProducts';
import { uploadProductImageWithProgress, deleteProductImage } from '@/lib/services/storageService';
import { successToast, errorToast } from '@/lib/utils/toasts';
import type { ProductFormData } from '@/types/product';

interface ProductFormProps {
    productId: string | null;
    onClose: () => void;
}

export const ProductForm = ({ productId, onClose }: ProductFormProps) => {
    // Hooks
    const { data: existingProduct, isLoading: loadingProduct } = useProduct(productId || '');
    const createMutation = useCreateProduct();
    const updateMutation = useUpdateProduct();
    const initializedRef = useRef<string | null>(null);

    // Form State
    const [formData, setFormData] = useState<ProductFormData>({
        title: '',
        price: 0,
        description: '',
        category: '',
        imageURL: '',
        imagePath: '',
    });

    // Image Upload State
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [isUploading, setIsUploading] = useState<boolean>(false);

    // Load Existing Product Data For Editing
    // Using a ref to track initialization prevents unnecessary updates
    useEffect(() => {
        if (existingProduct && productId && initializedRef.current !== productId) {
            initializedRef.current = productId;
            // Queue state update to avoid sync setState warning
            queueMicrotask(() => {
                setFormData({
                    title: existingProduct.title,
                    price: existingProduct.price,
                    description: existingProduct.description,
                    category: existingProduct.category,
                    imageURL: existingProduct.imageURL,
                    imagePath: existingProduct.imagePath || '',
                });
                setImagePreview(existingProduct.imageURL);
            });
        } else if (!productId && initializedRef.current !== null) {
            // Reset form when switching to create mode
            initializedRef.current = null;
            queueMicrotask(() => {
                setFormData({
                    title: '',
                    price: 0,
                    description: '',
                    category: '',
                    imageURL: '',
                    imagePath: '',
                });
                setImagePreview('');
            });
        }
    }, [existingProduct, productId]);

    // Handle Form Field Changes
    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'price' ? (value === '' ? 0 : parseFloat(value)) : value,
        }));
    };

    // Handle Image Selection
    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImageFile(file);

        // Create Preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    // Handle Form Submission
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.title || !formData.category || formData.price <= 0) {
            errorToast('❌ Please fill in all required fields correctly.');
            return;
        }

        try {
            let imageURL = formData.imageURL;
            let imagePath = formData.imagePath;

            // Upload New Image if Selected
            if (imageFile) {
                setIsUploading(true);
                // Delete Old Image if Exists
                if (productId && formData.imagePath) {
                    try {
                        await deleteProductImage(formData.imagePath);
                    } catch (error) {
                        console.warn('Failed to delete old image:', error);
                    }
                }

                // Upload New Image
                const uploadResult = await uploadProductImageWithProgress(
                    imageFile,
                    formData.category,
                    (progress: number) => setUploadProgress(progress),
                    productId || undefined
                );
                imageURL = uploadResult.downloadURL;
                imagePath = uploadResult.path;
                setIsUploading(false);
            }

            // Prepare Data
            const productData: ProductFormData = {
                ...formData,
                imageURL,
                imagePath,
            };

            // Create or Update Product
            if (productId) {
                await updateMutation.mutateAsync({ productId, productData });
                successToast('Product updated successfully! 🎉');
            } else {
                await createMutation.mutateAsync(productData);
                successToast('Product created successfully! 🎉');
            }

            onClose();
        } catch (error) {
            console.error('Error saving product:', error);
            errorToast('❌ Failed to save product. Please try again.');
            setIsUploading(false);
        }
    };

    const isSubmitting = createMutation.isPending || updateMutation.isPending || isUploading;

    if (loadingProduct && productId) {
        return (
            <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
                <div className='animate-spin rounded-full w-12 h-12 border-4 border-accent border-t-transparent' />
            </div>
        );
    }


    return (
        <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
            <div className='bg-bg-secondary border-2 border-border rounded-2xl max-w-3xl w-full
                max-h-[90vh] overflow-y-auto'>

                {/* Form Header */}
                <div className='sticky top-0 bg-bg-secondary border-b border-border p-6 flex
                    items-center justify-between'>
                    <h2 className='text-2xl font-bold text-gradient-cyber'>
                        {productId ? 'Edit Product' : 'Create New Product'}
                    </h2>
                    <button
                        onClick={onClose}
                        className='p-2 rounded-lg hover:bg-bg-elevated transition-colors'
                        disabled={isSubmitting}
                    >
                        <X className='w-6 h-6 text-text-muted' />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className='p-6 space-y-6'>

                    {/* Image Upload Section */}
                    <div>
                        <label className='block text-text-primary font-medium mb-2'>
                            Product Image
                        </label>
                        <div className='space-y-4'>
                            {/* Image Preview */}
                            {imagePreview && (
                                <div className='relative w-full h-64 bg-bg-primary border-2 border-border
                                    rounded-xl overflow-hidden'>
                                    <Image
                                        src={imagePreview}
                                        alt='Product Preview'
                                        fill
                                        className='object-contain'
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                    />
                                    <button
                                        type='button'
                                        onClick={() => {
                                            setImageFile(null);
                                            setImagePreview('');
                                            setFormData(prev => ({ ...prev, imageURL: '', imagePath: '' }));
                                        }}
                                        className='absolute top-2 right-2 p-2 bg-error/90 hover:bg-error rounded-lg transition-colors z-10'
                                        disabled={isSubmitting}
                                    >
                                        <X className='w-5 h-5 text-white' />
                                    </button>
                                </div>
                            )}

                            {/* Upload Button */}
                            <label className={`flex flex-col items-center justify-center w-full h-32
                                border-2 border-dashed rounded-xl border-border hover:border-accent cursor-pointer
                                bg-bg-primary hover:bg-bg-elevated transition-all duration-200
                                ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                                    {isUploading ? (
                                        <>
                                            <Loader2 className='w-10 h-10 text-accent animate-spin mb-2' />
                                            <p className='text-text-muted text-sm font-medium'>
                                                Uploading... {Math.round(uploadProgress)}%
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <Upload className='w-10 h-10 text-text-muted mb-2' />
                                            <p className='text-text-primary text-sm font-medium mb-1'>
                                                Click to upload image
                                            </p>
                                            <p className='text-text-muted text-xs'>
                                                (JPEG, PNG, GIF - Max 5MB)
                                            </p>
                                        </>
                                    )}
                                </div>
                                <input
                                    type='file'
                                    accept='image/*'
                                    className='hidden'
                                    onChange={handleImageChange}
                                    disabled={isSubmitting || isUploading}
                                />
                            </label>

                            {/* Upload Progress Bar */}
                            {isUploading && (
                                <div className='w-full bg-bg-primary rounded-full h-2 overflow-hidden'>
                                    <div
                                        className='h-full bg-gradient-cyber transition-all duration-200'
                                        style={{ width: `${uploadProgress}%` }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Title Field */}
                    <div>
                        <label htmlFor='title' className='block text-text-primary font-medium mb-2'>
                            Product Title
                        </label>
                        <input
                            type='text'
                            id='title'
                            name='title'
                            value={formData.title}
                            onChange={handleInputChange}
                            className='w-full px-4 py-3 bg-bg-primary border border-border rounded-lg
                                focus:outline-none focus:border-accent transition-colors text-text-primary'
                            placeholder='Enter Product Title'
                            disabled={isSubmitting}
                            required
                        />
                    </div>

                    {/* Price & Category Fields */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <div>
                            <label htmlFor='price' className='block text-text-primary font-medium mb-2'>
                                Price ($)
                            </label>
                            <input
                                type='number'
                                id='price'
                                name='price'
                                value={formData.price}
                                onChange={handleInputChange}
                                className='w-full px-4 py-3 bg-bg-primary border border-border rounded-lg
                                    focus:outline-none focus:border-accent transition-colors text-text-primary'
                                placeholder='0.00'
                                disabled={isSubmitting}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor='category' className='block text-text-primary font-medium mb-2'>
                                Category
                            </label>
                            <input
                                type='text'
                                id='category'
                                name='category'
                                value={formData.category}
                                onChange={handleInputChange}
                                className='w-full px-4 py-3 bg-bg-primary border border-border rounded-lg
                                    focus:outline-none focus:border-accent transition-colors text-text-primary'
                                placeholder='Enter Product Category'
                                disabled={isSubmitting}
                                required
                            />
                        </div>
                    </div>

                    {/* Description Field */}
                    <div>
                        <label htmlFor='description' className='block text-text-primary font-medium mb-2'>
                            Description
                        </label>
                        <textarea
                            id='description'
                            name='description'
                            value={formData.description}
                            onChange={handleInputChange}
                            className='w-full px-4 py-3 bg-bg-primary border border-border rounded-lg
                                focus:outline-none focus:border-accent transition-colors text-text-primary'
                            placeholder='Enter Product Description'
                            disabled={isSubmitting}
                            required
                        />
                    </div>

                    {/* Warning */}
                    {!imageFile && !imagePreview && (
                        <div className='flex items-start gap-3 p-4 bg-warning/10 border border-warning/30 rounded-lg'>
                            <AlertCircle className='w-5 h-5 text-warning shrink-0 mt-0.5' />
                            <p className='text-text-primary text-sm'>
                                Please upload a product image before submitting.
                            </p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className='flex gap-4 pt-4'>
                        <button
                            type='button'
                            onClick={onClose}
                            className='flex-1 px-6 py-3 bg-bg-primary border border-border rounded-lg
                                hover:bg-bg-hover transition-colors text-text-primary font-medium'
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type='submit'
                            className='flex-1 flex items-center justify-center gap-2 px-6 py-3
                                bg-gradient-cyber text-bg-primary rounded-lg hover:shadow-cyan
                                transition-all font-bold disabled:opacity-50 disabled:cursor-not-allowed duration-200'
                            disabled={isSubmitting || (!imageFile && !imagePreview)}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className='w-5 h-5 animate-spin' />
                                    {isUploading ? 'Uploading...' : 'Saving...'}
                                </>
                            ) : (
                                <>
                                    <Save className='w-5 h-5' />
                                    {productId ? 'Update Product' : 'Create Product'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};