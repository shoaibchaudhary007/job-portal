import React from 'react';
import { SlidersHorizontal, RotateCcw, DollarSign } from 'lucide-react';

const CATEGORIES = ['IT', 'Design', 'Marketing', 'Finance', 'Engineering', 'Sales'];
const EXPERIENCE_LEVELS = ['Entry-Level', 'Mid-Level', 'Senior'];
const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship'];

export const FiltersSidebar = ({
  filters,
  toggleTypeFilter,
  setSingleFilter,
  resetFilters,
}) => {
  return (
    <div className="w-full p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 shadow-sm flex flex-col gap-6 sticky top-24 max-h-[85vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-4">
        <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
          <SlidersHorizontal className="h-4 w-4 text-blue-600" />
          <h3 className="font-bold text-base">Advanced Filters</h3>
        </div>
        <button
          onClick={resetFilters}
          className="flex items-center gap-1 text-xs font-semibold text-rose-500 hover:text-rose-600 active:scale-95 transition-all cursor-pointer"
        >
          <RotateCcw className="h-3 w-3" />
          Reset All
        </button>
      </div>

      {/* Category Dropdown */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Job Category
        </label>
        <select
          value={filters.category}
          onChange={(e) => setSingleFilter('category', e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-700 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
        >
          <option value="" className="dark:bg-slate-800">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat} className="dark:bg-slate-800">
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Job Type Checkboxes */}
      <div className="flex flex-col gap-3">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Job Type
        </label>
        <div className="flex flex-col gap-2.5">
          {JOB_TYPES.map((type) => {
            const isChecked = filters.types.includes(type);
            return (
              <label
                key={type}
                className="flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-300 cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleTypeFilter(type)}
                  className="rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500 h-4.5 w-4.5 cursor-pointer accent-blue-600"
                />
                {type}
              </label>
            );
          })}
        </div>
      </div>

      {/* Experience Level Buttons */}
      <div className="flex flex-col gap-2.5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Experience Level
        </label>
        <div className="grid grid-cols-3 gap-2">
          {EXPERIENCE_LEVELS.map((level) => {
            const isSelected = filters.experienceLevel === level;
            return (
              <button
                key={level}
                type="button"
                onClick={() => setSingleFilter('experienceLevel', isSelected ? '' : level)}
                className={`py-2 px-1 text-center rounded-xl text-xs font-bold tracking-tight transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/10'
                    : 'bg-transparent text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                }`}
              >
                {level.split('-')[0]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Minimum Salary Slider */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Min Annual Salary
          </label>
          <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400">
            {filters.minSalary > 0 ? `$${(filters.minSalary / 1000).toFixed(0)}k+` : 'Any'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-slate-400" />
          <input
            type="range"
            min="0"
            max="200000"
            step="10000"
            value={filters.minSalary}
            onChange={(e) => setSingleFilter('minSalary', parseInt(e.target.value))}
            className="w-full accent-blue-600 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-lg cursor-pointer"
          />
        </div>
      </div>

      {/* Remote Setup Switch */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700/60">
        <div className="flex flex-col gap-0.5">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-200 cursor-pointer" htmlFor="remote-toggle">
            Remote Setup Only
          </label>
          <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
            Hide onsite / hybrid vacancies
          </span>
        </div>
        <button
          id="remote-toggle"
          type="button"
          onClick={() => setSingleFilter('remoteOnly', !filters.remoteOnly)}
          className={`relative inline-flex h-6.5 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            filters.remoteOnly ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5.5 w-5.5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
              filters.remoteOnly ? 'translate-x-4.5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>
    </div>
  );
};
export default FiltersSidebar;
