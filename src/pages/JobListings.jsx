import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useJobs } from '../context/JobContext';
import { useJobFilter } from '../hooks/useJobFilter';
import { useDebounce } from '../hooks/useDebounce';
import { JobCard } from '../components/JobCard';
import { FiltersSidebar } from '../components/FiltersSidebar';
import { SkeletonCard } from '../components/SkeletonCard';
import { EmptyState } from '../components/EmptyState';
import { Pagination } from '../components/Pagination';
import { Grid, List, Search, MapPin, Sparkles, Filter, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ITEMS_PER_PAGE = 10;

export const JobListings = () => {
  const { jobs, loading } = useJobs();
  const locationState = useLocation();

  // Search parameters from home page redirect
  const queryParams = new URLSearchParams(locationState.search);
  const initialSearch = queryParams.get('search') || '';
  const initialLoc = queryParams.get('location') || '';
  const initialCat = queryParams.get('category') || '';

  // Layout state
  const [layout, setLayout] = useState('grid'); // 'grid' | 'list'
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Filters hook
  const {
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
  } = useJobFilter(jobs);

  // Initialize search variables from URL parameters if redirected
  useEffect(() => {
    if (initialSearch) setSearch(initialSearch);
    if (initialLoc) setLocation(initialLoc);
    if (initialCat) setSingleFilter('category', initialCat);
  }, [initialSearch, initialLoc, initialCat]);

  // Reset pagination when filters, search, or sorting updates
  useEffect(() => {
    setCurrentPage(1);
  }, [search, location, filters, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="flex flex-col gap-6 py-4">
      {/* Search Bar Block */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 shadow-sm flex flex-col md:flex-row items-center gap-4">
        {/* Title input */}
        <div className="flex items-center gap-2.5 w-full px-3 py-1 bg-slate-50 dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800 rounded-xl">
          <Search className="h-4.5 w-4.5 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search titles, companies, tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent border-none text-slate-800 dark:text-slate-100 text-sm py-2.5 focus:outline-none placeholder-slate-400 font-medium"
          />
        </div>

        {/* Location input */}
        <div className="flex items-center gap-2.5 w-full px-3 py-1 bg-slate-50 dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800 rounded-xl">
          <MapPin className="h-4.5 w-4.5 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Location, remote, country..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-transparent border-none text-slate-800 dark:text-slate-100 text-sm py-2.5 focus:outline-none placeholder-slate-400 font-medium"
          />
        </div>
      </div>

      {/* Main Grid: Filters + Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Filters Sidebar - Desktop */}
        <div className="hidden lg:block lg:col-span-1">
          <FiltersSidebar
            filters={filters}
            toggleTypeFilter={toggleTypeFilter}
            setSingleFilter={setSingleFilter}
            resetFilters={resetFilters}
          />
        </div>

        {/* Listings display column */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {/* Controls line */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                Showing{' '}
                <span className="text-slate-800 dark:text-slate-100 font-extrabold">
                  {filteredJobs.length}
                </span>{' '}
                vacancies
              </p>
            </div>

            {/* Layout switch + sort options */}
            <div className="flex items-center gap-4">
              {/* Sorting */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold focus:outline-none cursor-pointer"
              >
                <option value="newest">Sort: Newest</option>
                <option value="highest-salary">Sort: Highest Salary</option>
                <option value="relevance">Sort: Relevance</option>
              </select>

              {/* Layout togglers */}
              <div className="hidden sm:flex items-center border border-slate-200 dark:border-slate-700 p-0.5 rounded-xl bg-slate-50 dark:bg-slate-900 shrink-0">
                <button
                  onClick={() => setLayout('grid')}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    layout === 'grid'
                      ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                  aria-label="Grid layout"
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setLayout('list')}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    layout === 'list'
                      ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                  aria-label="List layout"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>

              {/* Mobile Filter Button */}
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold cursor-pointer"
              >
                <Filter className="h-3.5 w-3.5" />
                Filter
              </button>
            </div>
          </div>

          {/* Cards render block */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(6)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : paginatedJobs.length > 0 ? (
            <>
              <div
                className={
                  layout === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 gap-6'
                    : 'flex flex-col gap-6'
                }
              >
                {paginatedJobs.map((job) => (
                  <JobCard key={job.id} job={job} layout={layout} />
                ))}
              </div>
              
              {/* Pagination controls */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </>
          ) : (
            <EmptyState
              title="No vacancies match your criteria"
              description="Check your spelling, reset your active range, or modify filters to find other openings."
              actionText="Reset Filters"
              onAction={resetFilters}
            />
          )}
        </div>
      </div>

      {/* Mobile Drawer Slide-out (Filters) */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="relative w-80 max-w-full h-full bg-white dark:bg-slate-800 shadow-2xl p-6 flex flex-col z-10 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100 dark:border-slate-700/60">
                <span className="font-extrabold text-slate-800 dark:text-slate-100 text-sm uppercase tracking-wide">
                  Filters Panel
                </span>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <FiltersSidebar
                filters={filters}
                toggleTypeFilter={toggleTypeFilter}
                setSingleFilter={setSingleFilter}
                resetFilters={() => {
                  resetFilters();
                  setMobileFiltersOpen(false);
                }}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default JobListings;
