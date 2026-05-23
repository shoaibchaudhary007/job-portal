import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useJobs } from '../context/JobContext';
import { Bookmark, MapPin, Briefcase, DollarSign, Award, Sparkles } from 'lucide-react';
import { calculateMatchScore } from '../utils/matchScore';
import { formatRelativeTime } from '../utils/formatters';
import { motion } from 'framer-motion';

export const FeaturedJobCard = ({ job }) => {
  const { user } = useAuth();
  const { savedJobs, toggleSaveJob } = useJobs();

  const isSaved = savedJobs.some((sj) => sj.jobId === job.id);

  // Compute AI Match Score
  const userSkills = user?.role === 'seeker' ? (user.skills || []) : [];
  const { score, color, label } = calculateMatchScore(userSkills, job.tags);

  const handleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSaveJob(job.id);
  };

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className="relative w-full p-6 rounded-2xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-2 border-blue-500/10 dark:border-blue-500/20 shadow-md flex flex-col justify-between h-[340px] hover:shadow-xl hover:border-blue-500/30 dark:hover:border-blue-500/40"
    >
      {/* Featured visual highlights */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        {/* Glow badge */}
        <span className="flex items-center gap-1 text-[10px] font-extrabold tracking-wider uppercase bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 px-2.5 py-1 rounded-full border border-amber-500/20 shadow-sm animate-pulse">
          Featured
        </span>

        {/* Bookmark trigger */}
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

      <div>
        {/* Company Header */}
        <div className="flex items-center gap-3">
          <img
            src={job.companyLogo}
            alt={`${job.company} logo`}
            className="h-14 w-14 rounded-xl object-cover border border-slate-100 dark:border-slate-700 shadow-sm bg-slate-50"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100';
            }}
          />
          <div>
            <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
              {job.company}
            </h4>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
              {formatRelativeTime(job.postedDate)}
            </p>
          </div>
        </div>

        {/* Title & snippet */}
        <div className="mt-4">
          <Link
            to={`/jobs/${job.id}`}
            className="text-lg md:text-xl font-black text-slate-800 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors block line-clamp-1"
          >
            {job.title}
          </Link>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
            {job.description}
          </p>
        </div>

        {/* Core parameters */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 text-xs text-slate-500 dark:text-slate-400 font-bold">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-slate-400" />
            {job.location}
          </span>
          <span className="flex items-center gap-1.5">
            <Briefcase className="h-3.5 w-3.5 text-slate-400" />
            {job.type}
          </span>
          <span className="flex items-center gap-1.5">
            <DollarSign className="h-3.5 w-3.5 text-slate-400" />
            {job.salary}
          </span>
          <span className="flex items-center gap-1.5">
            <Award className="h-3.5 w-3.5 text-slate-400" />
            {job.experienceLevel}
          </span>
        </div>
      </div>

      {/* Card Footer actions */}
      <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-700/60 pt-4 mt-6">
        {/* Match Percentage */}
        {user?.role === 'seeker' ? (
          <div
            className={`flex items-center gap-2 border px-3 py-1 rounded-full text-xs font-bold shadow-sm ${color}`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI Match: {score}%</span>
          </div>
        ) : (
          <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
            {job.applicantsCount || 0} applicants so far
          </div>
        )}

        <Link
          to={`/jobs/${job.id}`}
          className="px-5 py-2.5 rounded-xl text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all text-center cursor-pointer shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30"
        >
          Apply Now
        </Link>
      </div>
    </motion.div>
  );
};
export default FeaturedJobCard;
