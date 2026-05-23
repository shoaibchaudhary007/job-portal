/**
 * Formats a ISO Date string into a human-friendly relative time (e.g., '2 days ago')
 */
export const formatRelativeTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffTime < 1000 * 60 * 60) {
    const mins = Math.floor(diffTime / (1000 * 60));
    return mins <= 1 ? 'Just now' : `${mins} minutes ago`;
  }
  
  if (diffTime < 1000 * 60 * 60 * 24) {
    const hours = Math.floor(diffTime / (1000 * 60 * 60));
    return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
  }
  
  if (diffDays === 1) return 'Yesterday';
  if (diffDays <= 7) return `${diffDays} days ago`;
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Standardizes salary formatting for search filters and analytical tables
 */
export const formatSalary = (min, max) => {
  if (!min && !max) return 'Competitive';
  if (min && !max) return `$${(min / 1000).toFixed(0)}k+`;
  if (!min && max) return `Up to $${(max / 1000).toFixed(0)}k`;
  
  return `$${(min / 1000).toFixed(0)}k - $${(max / 1000).toFixed(0)}k`;
};
