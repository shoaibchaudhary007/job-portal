import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useJobs } from '../context/JobContext';
import { Bookmark, MapPin, Briefcase, DollarSign, Sparkles } from 'lucide-react';
import { calculateMatchScore } from '../utils/matchScore';
import { formatRelativeTime } from '../utils/formatters';
import { motion } from 'framer-motion';

export const JobCard = ({ job, layout = 'grid' }) => {
  const { user } = useAuth();
  const { savedJobs, toggleSaveJob } = useJobs();

  // Check if job is bookmarked
  const isSaved = savedJobs.some((sj) => sj.jobId === job.id);

  // Compute AI Match Score
  const userSkills = user?.role === 'seeker' ? (user.skills || []) : [];
  const { score, color, label } = calculateMatchScore(userSkills, job.tags);

  const handleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSaveJob(job.id);
  };

  const isListLayout = layout === 'list';

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`relative w-full p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 shadow-sm flex transition-all hover:shadow-md ${
        isListLayout ? 'flex-col md:flex-row gap-5 items-start md:items-center justify-between' : 'flex-col justify-between h-[300px]'
      }`}
    >
      {/* Featured Indicator Ribbon */}
      {job.featured && (
        <div className="absolute top-0 right-0 h-10 w-10 overflow-hidden rounded-tr-2xl">
          <div className="absolute top-[-6px] right-[-24px] bg-amber-500 text-white text-[9px] font-bold py-1 px-8 rotate-45 text-center shadow-sm select-none">
            Hot
          </div>
        </div>
      )}

      {/* Main content body */}
      <div className={`flex gap-4 ${isListLayout ? 'w-full md:w-3/4' : 'flex-col'}`}>
        {/* Company Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <img
              src={job.companyLogo}
              alt={`${job.company} logo`}
              className="h-12 w-12 rounded-xl object-cover border border-slate-100 dark:border-slate-700 shadow-sm bg-slate-50"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100';
              }}
            />
            <div>
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">
                {job.company}
              </h4>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                {formatRelativeTime(job.postedDate)}
              </p>
            </div>
          </div>

          {/* Bookmark Trigger */}
          {(!user || user.role === 'seeker') && (
            <button
              onClick={handleBookmark}
              className={`p-2 rounded-full border transition-all cursor-pointer hover:scale-105 active:scale-95 ${
                isSaved
                  ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 border-blue-200 dark:border-blue-800'
                  : 'bg-transparent text-slate-400 hover:text-slate-600 border-slate-200 dark:border-slate-700'
              }`}
              aria-label="Bookmark job"
            >
              <Bookmark className={`h-4.5 w-4.5 ${isSaved ? 'fill-blue-600' : ''}`} />
            </button>
          )}
        </div>

        {/* Job Titles & Specs */}
        <div className="mt-2">
          <Link
            to={`/jobs/${job.id}`}
            className="text-base md:text-lg font-bold text-slate-800 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors block line-clamp-1"
          >
            {job.title}
          </Link>
          
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-slate-400" />
              {job.location}
            </span>
            <span className="flex items-center gap-1">
              <Briefcase className="h-3.5 w-3.5 text-slate-400" />
              {job.type}
            </span>
            <span className="flex items-center gap-1">
              <DollarSign className="h-3.5 w-3.5 text-slate-400" />
              {job.salary}
            </span>
          </div>
        </div>

        {/* Skill Tags */}
        <div className="flex flex-wrap gap-1.5 mt-4">
          {job.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 border border-slate-200/20"
            >
              {tag}
            </span>
          ))}
          {job.tags.length > 3 && (
            <span className="text-[10px] font-bold px-2 py-1 text-slate-400 dark:text-slate-500">
              +{job.tags.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Action panel & AI Match score */}
      <div
        className={`flex items-center justify-between border-t border-slate-100 dark:border-slate-700/60 pt-4 ${
          isListLayout ? 'w-full md:w-1/4 md:border-t-0 md:pt-0 mt-4 md:mt-0 flex-row md:flex-col md:items-end gap-3 justify-between md:justify-center' : 'mt-auto'
        }`}
      >
        {/* AI Match Score Radial Indicator */}
        {user?.role === 'seeker' && (
          <div
            className={`flex items-center gap-2 border px-2.5 py-1 rounded-full text-xs font-bold transition-all shadow-sm ${color}`}
            title="Calculated by AI based on your profile skills overlap"
          >
            <Sparkles className="h-3 w-3" />
            <span>AI: {score}%</span>
          </div>
        )}
        
        {/* View Details CTA */}
        <Link
          to={`/jobs/${job.id}`}
          className={`px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all text-center cursor-pointer shadow-md shadow-blue-500/10 ${
            isListLayout ? 'w-auto md:w-28' : 'w-24 ml-auto'
          }`}
        >
          View Job
        </Link>
      </div>
    </motion.div>
  );
};
export default JobCard;
