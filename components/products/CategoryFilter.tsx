import { useCategories } from '@/hooks/useProducts';

interface CategoryFilterProps {
    selectedCategory: string | null;
    onCategoryChange: (category: string | null) => void;
};

export const CategoryFilter = ({
    selectedCategory,
    onCategoryChange,
}: CategoryFilterProps) => {
    const { data: categories, isLoading, error } = useCategories();

    if (isLoading) {
        return (
            <div className='flex items-center gap-3 bg-bg-secondary px-4 py-3 rounded-lg
                border border-border'>
                <div className='w-4 h-4 border-2 border-accent border-t-transparent
                    rounded-full animate-spin' />
                <span className='text-text-secondary text-sm'>
                    Loading Categories...
                </span>
            </div>
        );
    }

    if (error) {
        return (
            <div className='bg-bg-secondary px-4 py-3 rounded-lg border border-error
                text-sm'>
                Error loading categories.
            </div>
        );
    }

    return (
        <div className='flex items-center gap-3 bg-bg-secondary px-4 py-3 rounded-lg
            border border-border hover:border-border-accent transition-colors'>
                <label
                    htmlFor='category'
                    className='text-text-primary font-medium text-sm uppercase tracking-wide'
                >
                    Filter:
                </label>
                <select
                    id='category'
                    value={selectedCategory || ''}
                    onChange={(e) => onCategoryChange(e.target.value || null)}
                    className='bg-bg-elevated text-text-primary border
                        border-border rounded-md px-4 py-2 focus:outline-none hover:border-accent
                        cursor-pointer transition-all font-mono text-sm focus:shadow-cyan
                        relative z-10'
                >
                    <option value=''>All Categories</option>
                    {categories?.filter(Boolean).map((category) => (
                        <option key={category} value={category}>
                            {category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Unknown'}
                        </option>
                    ))}
                </select>
            </div>
    );
};