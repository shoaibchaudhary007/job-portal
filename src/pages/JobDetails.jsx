import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useJobs } from '../context/JobContext';
import { useAuth } from '../context/AuthContext';
import { Modal } from '../components/Modal';
import { calculateMatchScore } from '../utils/matchScore';
import { formatRelativeTime } from '../utils/formatters';
import { MapPin, Briefcase, DollarSign, Calendar, Sparkles, Award, Bookmark, ArrowLeft, Send, CheckCircle, Share2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

export const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { jobs, applications, savedJobs, toggleSaveJob, applyForJob } = useJobs();

  // Modal open states
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [sharing, setSharing] = useState(false);

  // Retrieve current job record
  const job = jobs.find((j) => j.id === id);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
      coverLetter: '',
      resumeName: 'My_Resume.pdf',
    },
  });

  // Pre-fill user data when user changes
  useEffect(() => {
    if (user) {
      setValue('name', user.name);
      setValue('email', user.email);
    }
  }, [user, setValue]);

  if (!job) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Job vacancy not found</h3>
        <p className="text-slate-400 mt-2 text-sm">It might have been closed, deleted, or expired.</p>
        <Link to="/jobs" className="mt-4 px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600">
          Back to Listings
        </Link>
      </div>
    );
  }

  // Similar jobs calculation (filter by category and exclude current job)
  const similarJobs = jobs
    .filter((j) => j.category === job.category && j.id !== job.id)
    .slice(0, 3);

  // Bookmarking status
  const isSaved = savedJobs.some((sj) => sj.jobId === job.id);

  // Application status
  const hasApplied = applications.some((app) => app.jobId === job.id && app.seekerId === user?.id);

  // AI Match Score
  const userSkills = user?.role === 'seeker' ? (user.skills || []) : [];
  const { score, color, label } = calculateMatchScore(userSkills, job.tags);

  const handleShare = () => {
    setSharing(true);
    navigator.clipboard.writeText(window.location.href);
    toast.success('Job link copied to clipboard!');
    setTimeout(() => setSharing(false), 2000);
  };

  const onApplySubmit = async (data) => {
    // Fake resume upload parser (extract base name)
    const file = data.resumeFile?.[0];
    const details = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      resumeName: file ? file.name : 'Jane_Doe_Resume.pdf',
      coverLetter: data.coverLetter,
    };

    const success = await applyForJob(job.id, details);
    if (success) {
      setApplyModalOpen(false);
      reset();
    }
  };

  return (
    <div className="flex flex-col gap-6 py-4">
      {/* Return link */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to list
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Main Job details panel */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Header Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="flex items-center gap-4">
                <img
                  src={job.companyLogo}
                  alt={`${job.company} logo`}
                  className="h-16 w-16 rounded-2xl object-cover border border-slate-100 dark:border-slate-700 shadow-md bg-slate-50"
                />
                <div>
                  <span className="inline-block text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/20 mb-1.5">
                    {job.category}
                  </span>
                  <h1 className="text-xl md:text-2xl font-black text-slate-800 dark:text-slate-100 leading-tight">
                    {job.title}
                  </h1>
                  <p className="text-sm font-bold text-slate-600 dark:text-slate-300 mt-0.5">
                    {job.company}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              {(!user || user.role === 'seeker') && (
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={handleShare}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 transition-all cursor-pointer"
                    title="Share Job"
                  >
                    <Share2 className="h-4.5 w-4.5" />
                  </button>
                  <button
                    onClick={() => toggleSaveJob(job.id)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                      isSaved
                        ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 border-blue-200 dark:border-blue-800'
                        : 'bg-transparent text-slate-400 hover:text-slate-600 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <Bookmark className={`h-4.5 w-4.5 ${isSaved ? 'fill-blue-600' : ''}`} />
                  </button>
                </div>
              )}
            </div>

            {/* Params tags row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-slate-100 dark:border-slate-700/60 pt-5 mt-6 text-slate-500 dark:text-slate-400">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Location</span>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-blue-500" />
                  {job.location}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Salary Range</span>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <DollarSign className="h-3.5 w-3.5 text-blue-500" />
                  {job.salary}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Job Type</span>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Briefcase className="h-3.5 w-3.5 text-blue-500" />
                  {job.type}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Experience</span>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Award className="h-3.5 w-3.5 text-blue-500" />
                  {job.experienceLevel}
                </span>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 shadow-sm flex flex-col gap-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2 border-b border-slate-100 dark:border-slate-700/60 pb-2">
                Job Overview
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                {job.description}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-3 border-b border-slate-100 dark:border-slate-700/60 pb-2">
                Requirements
              </h3>
              <ul className="flex flex-col gap-2.5 pl-5 list-disc text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                {job.requirements.map((req, i) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-3 border-b border-slate-100 dark:border-slate-700/60 pb-2">
                Responsibilities
              </h3>
              <ul className="flex flex-col gap-2.5 pl-5 list-decimal text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                {job.responsibilities.map((resp, i) => (
                  <li key={i}>{resp}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-3 border-b border-slate-100 dark:border-slate-700/60 pb-2">
                Required Skills & Tech
              </h3>
              <div className="flex flex-wrap gap-2">
                {job.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-bold px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 border border-slate-200/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar panels */}
        <div className="flex flex-col gap-6">
          {/* Action Call / AI Match Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-blue-50 to-white dark:from-slate-850 dark:to-slate-800 border border-blue-100 dark:border-slate-700/60 shadow-sm flex flex-col gap-5 sticky top-24">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-3">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                Application Panel
              </span>
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {formatRelativeTime(job.postedDate)}
              </span>
            </div>

            {/* Match score gauge for seeker */}
            {user?.role === 'seeker' && (
              <div className={`p-4 rounded-xl border flex items-center justify-between shadow-sm ${color}`}>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">AI Capability Scan</span>
                  <span className="text-sm font-black mt-0.5">{label}</span>
                </div>
                <div className="text-2xl font-black">{score}%</div>
              </div>
            )}

            {/* Display application state */}
            {hasApplied ? (
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200/20 flex items-center justify-center gap-2 font-bold text-xs py-3.5 shadow-sm">
                <CheckCircle className="h-4.5 w-4.5" />
                Already Applied
              </div>
            ) : user?.role === 'employer' ? (
              <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900 border text-slate-500 dark:text-slate-400 text-center font-bold text-xs py-3">
                Viewing as Employer
              </div>
            ) : (
              <button
                onClick={() => setApplyModalOpen(true)}
                className="w-full py-3.5 rounded-xl text-sm font-extrabold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all shadow-md shadow-blue-500/20 cursor-pointer flex items-center justify-center gap-2"
              >
                <Send className="h-4 w-4" />
                Apply for this job
              </button>
            )}

            <div className="text-[10px] text-slate-400 dark:text-slate-500 font-bold text-center">
              Active applicants count: {job.applicantsCount || 0}
            </div>
          </div>

          {/* Similar Jobs panel */}
          {similarJobs.length > 0 && (
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 shadow-sm flex flex-col gap-4">
              <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 uppercase tracking-wide border-b border-slate-100 dark:border-slate-700/60 pb-2">
                Similar Jobs
              </h3>
              <div className="flex flex-col gap-4">
                {similarJobs.map((sj) => (
                  <Link
                    key={sj.id}
                    to={`/jobs/${sj.id}`}
                    className="flex items-center gap-3 group border-b border-slate-50 dark:border-slate-700/30 pb-3 last:border-b-0 last:pb-0"
                  >
                    <img
                      src={sj.companyLogo}
                      alt={sj.company}
                      className="h-10 w-10 rounded-xl object-cover border border-slate-100 dark:border-slate-700"
                    />
                    <div className="overflow-hidden">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {sj.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold truncate">
                        {sj.company} • {sj.location.split(' ')[0]}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Apply Job Form Modal */}
      <Modal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        title={`Apply for ${job.title}`}
      >
        <form onSubmit={handleSubmit(onApplySubmit)} className="space-y-4">
          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border border-blue-100/20 text-xs font-semibold">
            Apply to <span className="font-extrabold">{job.company}</span>. We'll automatically share your profile details with the employer.
          </div>

          {/* Full Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Full Name
            </label>
            <input
              type="text"
              {...register('name', { required: 'Name is required' })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && (
              <span className="text-xs text-rose-500 font-medium">{errors.name.message}</span>
            )}
          </div>

          {/* Email Address */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Email Address
            </label>
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <span className="text-xs text-rose-500 font-medium">{errors.email.message}</span>
            )}
          </div>

          {/* Phone Number */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="+1 (555) 012-3456"
              {...register('phone', { required: 'Phone is required' })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.phone && (
              <span className="text-xs text-rose-500 font-medium">{errors.phone.message}</span>
            )}
          </div>

          {/* Resume Upload (Mock) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Resume Upload (PDF, DOCX)
            </label>
            <div className="flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-4 transition-colors hover:border-blue-500/50">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                {...register('resumeFile', { required: 'Please upload a resume file' })}
                className="w-full text-xs text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer cursor-pointer"
              />
            </div>
            {errors.resumeFile && (
              <span className="text-xs text-rose-500 font-medium">{errors.resumeFile.message}</span>
            )}
          </div>

          {/* Cover Letter */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Cover Letter
            </label>
            <textarea
              placeholder="Explain why you are the absolute perfect candidate for this role..."
              rows="4"
              {...register('coverLetter', { required: 'Cover letter is required' })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            {errors.coverLetter && (
              <span className="text-xs text-rose-500 font-medium">{errors.coverLetter.message}</span>
            )}
          </div>

          {/* Action triggers */}
          <div className="flex gap-3 justify-end pt-3 border-t border-slate-100 dark:border-slate-700/60 mt-4">
            <button
              type="button"
              onClick={() => setApplyModalOpen(false)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all shadow-md cursor-pointer"
            >
              Submit Application
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
export default JobDetails;
