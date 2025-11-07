/**
 * Utility functions for working with ISO timestamp strings
 */

/**
 * Convert an ISO string to a Date object
 */
export const parseDate = (isoString: string): Date => {
    return new Date(isoString);
};

/**
 * Format an ISO string as a readable date
 * @param isoString - ISO 8601 date string
 * @param options - Intl.DateTimeFormat options
 */
export const formatDate = (
    isoString: string,
    options?: Intl.DateTimeFormatOptions
): string => {
    const date = new Date(isoString);
    return date.toLocaleDateString(undefined, options);
};

/**
 * Format an ISO string as a readable date and time
 */
export const formatDateTime = (
    isoString: string,
    options?: Intl.DateTimeFormatOptions
): string => {
    const date = new Date(isoString);
    const defaultOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        ...options,
    };
    return date.toLocaleString(undefined, defaultOptions);
};

/**
 * Get a relative time string (e.g., "2 hours ago", "3 days ago")
 */
export const getRelativeTime = (isoString: string): string => {
    const date = new Date(isoString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
        return 'just now';
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
        return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
        return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;
    }

    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears} ${diffInYears === 1 ? 'year' : 'years'} ago`;
};
