/**
 * Formats a date to show the distance from now (e.g. "2 days ago", "3 months ago")
 * 
 * @param date - The date to format
 * @returns A string representing the time distance from now
 */
export function formatDistanceToNow(date: Date): string {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    // Less than a minute
    if (diffInSeconds < 60) {
      return `${diffInSeconds} second${diffInSeconds !== 1 ? 's' : ''}`;
    }
    
    // Less than an hour
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''}`;
    }
    
    // Less than a day
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''}`;
    }
    
    // Less than a month (approximating a month as 30 days)
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''}`;
    }
    
    // Less than a year (approximating a year as 365 days)
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''}`;
    }
    
    // More than a year
    const diffInYears = Math.floor(diffInDays / 365);
    return `${diffInYears} year${diffInYears !== 1 ? 's' : ''}`;
  }
  
  /**
   * Formats a date to a human-readable string
   * 
   * @param date - The date to format
   * @param options - Intl.DateTimeFormatOptions for customizing the output
   * @returns A formatted date string
   */
  export function formatDate(date: Date, options?: Intl.DateTimeFormatOptions): string {
    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    
    return new Intl.DateTimeFormat('en-US', options || defaultOptions).format(date);
  }
  
  /**
   * Calculates reading time for content in minutes
   * 
   * @param content - The content to calculate reading time for
   * @param wordsPerMinute - Words per minute reading speed (default: 200)
   * @returns Reading time in minutes
   */
  export function calculateReadingTime(content: string, wordsPerMinute = 200): number {
    // Strip HTML tags if present
    const plainText = content.replace(/<[^>]*>/g, '');
    const words = plainText.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return Math.max(1, minutes); // Minimum 1 minute
  }