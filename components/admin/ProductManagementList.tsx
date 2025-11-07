import { useState } from 'react';
import Image from 'next/image';
import { Edit2, Trash2, DollarSign, Star, Calendar } from 'lucide-react';
import { useDeleteProduct } from '@/hooks/useProducts';
import { deleteProductImage } from '@/lib/services/storageService';
import { successToast, errorToast } from '@/lib/utils/toasts';
import type { Product } from '@/types/product';
import { formatDate } from '@/lib/utils/dateHelpers';

interface ProductManagementListProps {
  products: Product[];
  onEdit: (productId: string) => void;
}

export const ProductManagementList = ({ products, onEdit }: ProductManagementListProps) => {
  const deleteMutation = useDeleteProduct();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (product: Product) => {
    if (!confirm(`Are you sure you want to delete "${product.title}"?`)) {
      return;
    }

    setDeletingId(product.id);

    try {
      // Delete image from storage if exists
      if (product.imagePath) {
        try {
          await deleteProductImage(product.imagePath);
        } catch (error) {
          console.warn('Failed to delete product image:', error);
        }
      }

      // Delete product from Firestore
      await deleteMutation.mutateAsync(product.id);
      successToast('Product deleted successfully! 🗑️');
    } catch (error) {
      console.error('Error deleting product:', error);
      errorToast('Failed to delete product');
    } finally {
      setDeletingId(null);
    }
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-text-muted text-lg">No products yet. Add your first product!</p>
      </div>
    );
  }

  return (
    <div className="bg-bg-secondary border border-border rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-bg-elevated border-b border-border">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                Rating
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-text-muted uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.map((product) => (
              <tr
                key={product.id}
                className="hover:bg-bg-elevated transition-colors"
              >
                {/* Product Info */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-lg border border-border overflow-hidden shrink-0">
                      <Image
                        src={product.imageURL}
                        alt={product.title}
                        fill
                        className="object-cover"
                        sizes="64px"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/150?text=No+Image';
                        }}
                      />
                    </div>
                    <div className="max-w-xs">
                      <p className="text-text-primary font-medium truncate">
                        {product.title}
                      </p>
                      <p className="text-text-muted text-sm truncate">
                        {product.description}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Category */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 bg-accent/10 text-accent text-sm font-medium rounded-full">
                    {product.category}
                  </span>
                </td>

                {/* Price */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1 text-text-primary font-semibold">
                    <DollarSign className="w-4 h-4" />
                    {product.price.toFixed(2)}
                  </div>
                </td>

                {/* Rating */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-warning fill-warning" />
                    <span className="text-text-primary font-medium">
                      {product.rating.toFixed(1)}
                    </span>
                    <span className="text-text-muted text-sm">
                      ({product.ratingCount})
                    </span>
                  </div>
                </td>

                {/* Created Date */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1 text-text-muted text-sm">
                    <Calendar className="w-4 h-4" />
                    {formatDate(product.createdAt)}
                  </div>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(product.id)}
                      className="p-2 bg-accent/10 hover:bg-accent/20 text-accent rounded-lg
                        transition-colors"
                      title="Edit product"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(product)}
                      disabled={deletingId === product.id}
                      className="p-2 bg-error/10 hover:bg-error/20 text-error rounded-lg
                        transition-colors disabled:opacity-50"
                      title="Delete product"
                    >
                      {deletingId === product.id ? (
                        <div className="w-4 h-4 border-2 border-error border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};