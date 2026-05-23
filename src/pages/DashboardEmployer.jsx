import React from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, Navigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useJobs } from '../context/JobContext.jsx'
import { EmptyState } from '../components/EmptyState.jsx'
import { formatRelativeTime } from '../utils/formatters.js'
import { Building2, Briefcase, FileText, Sparkles, Plus, ArrowRight } from 'lucide-react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts'

const STATUS_COLORS = {
  Applied: '#3b82f6',
  Shortlisted: '#14b8a6',
  Interviewing: '#f59e0b',
  Rejected: '#ef4444',
}

export const DashboardEmployer = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { jobs, applications, loading, postJob, updateApplicationStatus } = useJobs()

  if (!user) {
    return <Navigate to="/login" replace />
  }
  if (user.role !== 'employer') {
    return <Navigate to="/dashboard/seeker" replace />
  }

  const myJobs = jobs.filter((job) => job.employerId === user.id)
  const myJobIds = myJobs.map((job) => job.id)
  const employerApplications = applications.filter((app) => myJobIds.includes(app.jobId))

  const statusData = Object.entries(
    employerApplications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1
      return acc
    }, {}),
  ).map(([name, value]) => ({ name, value }))

  const applicantsPerJob = myJobs.map((job) => ({
    name: job.title,
    applicants: employerApplications.filter((app) => app.jobId === job.id).length,
  }))

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      title: '',
      location: '',
      salary: '',
      type: 'Full-time',
      category: 'IT',
      experienceLevel: 'Mid-Level',
      remote: true,
      description: '',
      tags: '',
    },
  })

  const onSubmit = async (data) => {
    const payload = {
      title: data.title,
      location: data.location,
      salary: data.salary,
      type: data.type,
      category: data.category,
      experienceLevel: data.experienceLevel,
      remote: data.remote,
      description: data.description,
      requirements: data.description.split('.').filter(Boolean).slice(0, 4),
      responsibilities: data.description.split('.').filter(Boolean).slice(0, 4),
      tags: data.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      featured: false,
    }

    const success = await postJob(payload)
    if (success) {
      reset()
      navigate('/dashboard/employer')
    }
  }

  const recentApplicants = employerApplications
    .slice()
    .sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate))
    .slice(0, 5)

  return (
    <div className="flex flex-col gap-6 py-4">
      <div className="flex flex-col gap-3">
        <span className="text-xs uppercase tracking-[0.35em] text-blue-600 font-bold">Employer dashboard</span>
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-slate-100">Hiring hub for {user.company || user.name}</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
          Manage your jobs, review applicants, and post new roles from one centralized dashboard.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Active jobs', value: myJobs.length, icon: Building2 },
          { label: 'Total applicants', value: employerApplications.length, icon: FileText },
          { label: 'New this week', value: recentApplicants.length, icon: Sparkles },
          { label: 'Open roles', value: myJobs.filter((job) => job.applicantsCount < 8).length, icon: Briefcase },
        ].map((card) => (
          <div key={card.label} className="rounded-3xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{card.label}</p>
                <p className="mt-3 text-3xl font-black text-slate-900 dark:text-slate-100">{card.value}</p>
              </div>
              <div className="rounded-3xl bg-blue-50 dark:bg-blue-950/20 p-3 text-blue-600 dark:text-blue-300">
                <card.icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
        <div className="rounded-3xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Applications by status</p>
              <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">Hiring funnel</h2>
            </div>
            <Link to="/jobs" className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline">Browse jobs</Link>
          </div>
          <div className="h-72">
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={52} outerRadius={90} paddingAngle={4}>
                    {statusData.map((entry) => (
                      <Cell key={`cell-${entry.name}`} fill={STATUS_COLORS[entry.name] || '#6366f1'} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">No applicant activity yet. Invite candidates for your open roles.</p>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Popular openings</p>
              <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">Job demand</h2>
            </div>
          </div>
          {applicantsPerJob.length > 0 ? (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={applicantsPerJob} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={-35} textAnchor="end" height={70} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="applicants" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">Post a new role to start receiving applications.</p>
          )}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Recent applicants</p>
              <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">Latest pipelines</h2>
            </div>
            <Link to="/applications" className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline">Manage</Link>
          </div>
          {recentApplicants.length > 0 ? (
            <div className="space-y-4">
              {recentApplicants.map((app) => {
                const job = jobs.find((j) => j.id === app.jobId)
                return (
                  <div key={app.id} className="rounded-3xl border border-slate-100 dark:border-slate-700/60 p-5 bg-slate-50 dark:bg-slate-950/60">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <p className="font-bold text-slate-900 dark:text-slate-100">{app.name}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Applied for {job?.title || 'your role'}</p>
                      </div>
                      <span className="text-xs uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">{app.status}</span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-500 dark:text-slate-400">
                      <span>{formatRelativeTime(app.appliedDate)}</span>
                      <span>{app.email}</span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {['Shortlisted', 'Interviewing', 'Rejected'].map((status) => (
                        <button
                          key={status}
                          onClick={() => updateApplicationStatus(app.id, status)}
                          className="px-3 py-2 rounded-full bg-slate-100 dark:bg-slate-950 text-xs font-semibold text-slate-600 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-900 transition"
                        >
                          Mark {status}
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <EmptyState
              title="No applicants yet"
              description="Your job postings will appear here once candidates apply."
              actionText="Post a role"
              onAction={() => document.getElementById('postJobForm')?.scrollIntoView({ behavior: 'smooth' })}
            />
          )}
        </div>

        <div className="rounded-3xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Post a new job</p>
              <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">Create hiring campaigns</h2>
            </div>
            <Plus className="h-5 w-5 text-blue-600" />
          </div>
          <form id="postJobForm" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Role Title</label>
                <input
                  type="text"
                  {...register('title', { required: 'Job title is required' })}
                  className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none"
                />
                {errors.title && <span className="text-xs text-rose-500">{errors.title.message}</span>}
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Location</label>
                <input type="text" {...register('location', { required: 'Location is required' })} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none" />
                {errors.location && <span className="text-xs text-rose-500">{errors.location.message}</span>}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Salary Range</label>
                <input type="text" {...register('salary', { required: 'Salary is required' })} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none" placeholder="$90,000 - $120,000" />
                {errors.salary && <span className="text-xs text-rose-500">{errors.salary.message}</span>}
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Category</label>
                <select {...register('category')} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none">
                  <option>IT</option>
                  <option>Design</option>
                  <option>Marketing</option>
                  <option>Finance</option>
                  <option>Engineering</option>
                  <option>Sales</option>
                </select>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Role Type</label>
                <select {...register('type')} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none">
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Contract</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Experience Level</label>
                <select {...register('experienceLevel')} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none">
                  <option>Entry-Level</option>
                  <option>Mid-Level</option>
                  <option>Senior</option>
                </select>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Description</label>
                <textarea rows="4" {...register('description', { required: 'Description is required' })} className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none resize-none" />
                {errors.description && <span className="text-xs text-rose-500">{errors.description.message}</span>}
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Tags (comma separated)</label>
                <input type="text" {...register('tags', { required: 'Add at least one tag' })} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none" placeholder="React, SaaS, Remote" />
                {errors.tags && <span className="text-xs text-rose-500">{errors.tags.message}</span>}
              </div>
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full rounded-3xl bg-blue-600 text-white py-3 text-sm font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed">
              {isSubmitting ? 'Posting...' : 'Post job'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
export default DashboardEmployer
