import React from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useJobs } from '../context/JobContext.jsx'
import { EmptyState } from '../components/EmptyState.jsx'
import { MapPin, Briefcase, DollarSign, Bookmark, ArrowRight } from 'lucide-react'

export const SavedJobs = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { jobs, savedJobs, toggleSaveJob, loading } = useJobs()

  if (!user) {
    return <Navigate to="/login" replace />
  }
  if (user.role !== 'seeker') {
    return <Navigate to="/dashboard/employer" replace />
  }

  const savedJobItems = savedJobs
    .map((saved) => ({
      ...saved,
      job: jobs.find((job) => job.id === saved.jobId),
    }))
    .filter((item) => item.job)

  return (
    <div className="flex flex-col gap-6 py-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
          Saved Jobs
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
          All your bookmarked openings in one place.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600" />
        </div>
      ) : savedJobItems.length > 0 ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {savedJobItems.map((saved) => (
            <div
              key={saved.id}
              className="group rounded-3xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 shadow-sm p-6 transition hover:-translate-y-1"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {saved.job.title}
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {saved.job.company}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {saved.job.location}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Briefcase className="h-3.5 w-3.5" />
                      {saved.job.type}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <DollarSign className="h-3.5 w-3.5" />
                      {saved.job.salary}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleSaveJob(saved.job.id)}
                  className="rounded-2xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-xs font-semibold"
                >
                  Remove
                </button>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <Link
                  to={`/jobs/${saved.job.id}`}
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-500/10"
                >
                  View Job
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <div className="inline-flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <Bookmark className="h-4 w-4" />
                  Bookmarked
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No saved jobs yet"
          description="Bookmark listings to review them later or continue exploring open roles."
          onAction={() => navigate('/jobs')}
          actionText="Browse jobs"
        />
      )}
    </div>
  )
}
export default SavedJobs
