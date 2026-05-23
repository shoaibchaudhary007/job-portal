import { useState, useMemo } from 'react';

const DEFAULT_FILTERS = {
  types: [], // e.g. ["Full-time", "Part-time", "Contract", "Internship"]
  category: '', // e.g. "IT", "Design"
  experienceLevel: '', // e.g. "Entry-Level", "Mid-Level", "Senior"
  remoteOnly: false,
  minSalary: 0,
};

export const useJobFilter = (jobs) => {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'highest-salary' | 'relevance'
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const filteredJobs = useMemo(() => {
    let result = [...jobs];

    // 1. Text Search Filter (Title, Company, Tags)
    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(
        (job) =>
          job.title.toLowerCase().includes(query) ||
          job.company.toLowerCase().includes(query) ||
          job.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // 2. Location Filter
    if (location.trim()) {
      const locQuery = location.toLowerCase();
      result = result.filter((job) => job.location.toLowerCase().includes(locQuery));
    }

    // 3. Job Category Filter
    if (filters.category) {
      result = result.filter((job) => job.category.toLowerCase() === filters.category.toLowerCase());
    }

    // 4. Job Types Filter (Checkbox list)
    if (filters.types.length > 0) {
      result = result.filter((job) => filters.types.includes(job.type));
    }

    // 5. Experience Level Filter
    if (filters.experienceLevel) {
      result = result.filter((job) => job.experienceLevel === filters.experienceLevel);
    }

    // 6. Work Setup Filter (Remote Only)
    if (filters.remoteOnly) {
      result = result.filter((job) => job.remote === true);
    }

    // 7. Salary Filter
    if (filters.minSalary > 0) {
      result = result.filter((job) => {
        // Safe check if salary limits exist on job object
        const minVal = job.salaryMin || 0;
        return minVal >= filters.minSalary;
      });
    }

    // 8. Sorting
    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
    } else if (sortBy === 'highest-salary') {
      result.sort((a, b) => (b.salaryMax || 0) - (a.salaryMax || 0));
    } else if (sortBy === 'relevance') {
      // Basic relevance based on applicants count (or featured status)
      result.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return (b.applicantsCount || 0) - (a.applicantsCount || 0);
      });
    }

    return result;
  }, [jobs, search, location, filters, sortBy]);

  const setSingleFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const toggleTypeFilter = (type) => {
    setFilters((prev) => {
      const exists = prev.types.includes(type);
      const newTypes = exists
        ? prev.types.filter((t) => t !== type)
        : [...prev.types, type];
      return { ...prev, types: newTypes };
    });
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setSearch('');
    setLocation('');
    setSortBy('newest');
  };

  return {
    filteredJobs,
    search,
    setSearch,
    location,
    setLocation,
    sortBy,
    setSortBy,
    filters,
    setSingleFilter,
    toggleTypeFilter,
    resetFilters,
  };
};
