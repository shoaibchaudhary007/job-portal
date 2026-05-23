import React, { useMemo } from 'react'
import { Navigate, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useJobs } from '../context/JobContext.jsx'
import { EmptyState } from '../components/EmptyState.jsx'
import { formatRelativeTime } from '../utils/formatters.js'
import { Sparkles, Bookmark, FileText, Clock, ArrowRight, Award } from 'lucide-react'
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts'

const COLORS = ['#3b82f6', '#14b8a6', '#f59e0b', '#6366f1', '#f97316']

export const DashboardSeeker = () => {
  const { user } = useAuth()
  const { jobs, applications, savedJobs, loading } = useJobs()
  const navigate = useNavigate()

  if (!user) {
    return <Navigate to="/login" replace />
  }
  if (user.role !== 'seeker') {
    return <Navigate to="/dashboard/employer" replace />
  }

  const myApplications = applications
    .filter((app) => app.seekerId === user.id)
    .map((app) => ({
      ...app,
      job: jobs.find((job) => job.id === app.jobId),
    }))

  const applicationStatusCounts = ['Applied', 'Shortlisted', 'Interviewing', 'Rejected'].map((label) => ({
    name: label,
    value: myApplications.filter((app) => app.status === label).length,
  }))

  const categoryCounts = Array.from(
    myApplications.reduce((acc, app) => {
      const category = app.job?.category || 'Other'
      acc.set(category, (acc.get(category) || 0) + 1)
      return acc
    }, new Map()),
    ([name, value]) => ({ name, value })
  )

  const topCompanies = Array.from(
    myApplications.reduce((acc, app) => {
      const company = app.job?.company || 'Unknown'
      acc.set(company, (acc.get(company) || 0) + 1)
      return acc
    }, new Map()),
    ([name, value]) => ({ name, value })
  ).sort((a, b) => b.value - a.value).slice(0, 4)

  const totalApplied = myApplications.length
  const totalSaved = savedJobs.length
  const shortlisted = myApplications.filter((app) => app.status === 'Shortlisted').length
  const interviewing = myApplications.filter((app) => app.status === 'Interviewing').length

  return (
    <div className="flex flex-col gap-6 py-4">
      <div className="grid gap-4 xl:grid-cols-[1.65fr_1fr]">
        <div>
          <div className="flex flex-col gap-3 mb-6">
            <span className="text-xs uppercase tracking-[0.3em] text-blue-600 font-bold">Seeker dashboard</span>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-slate-100">Welcome back, {user.name.split(' ')[0]}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
              Your jobs, saved roles and application progress are updated in real time.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: 'Applications', value: totalApplied, icon: FileText },
              { label: 'Saved Listings', value: totalSaved, icon: Bookmark },
              { label: 'Shortlisted', value: shortlisted, icon: Award },
              { label: 'Interviewing', value: interviewing, icon: Clock },
            ].map((item) => (
              <div key={item.label} className="rounded-3xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-6 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{item.label}</p>
                    <p className="mt-3 text-3xl font-black text-slate-900 dark:text-slate-100">{item.value}</p>
                  </div>
                  <div className="rounded-3xl bg-blue-50 dark:bg-blue-950/20 p-3 text-blue-600 dark:text-blue-300">
                    <item.icon className="h-5 w-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Your profile snapshot</p>
              <p className="mt-2 text-base text-slate-800 dark:text-slate-100 font-bold">{user.bio || 'Complete your profile to improve match results.'}</p>
            </div>
            <Sparkles className="h-6 w-6 text-blue-600" />
          </div>
          <div className="grid gap-3">
            <div className="rounded-3xl border border-slate-100 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-950/60 p-4">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Location</p>
              <p className="mt-2 text-sm font-semibold text-slate-800 dark:text-slate-100">{user.location || 'Not specified'}</p>
            </div>
            <div className="rounded-3xl border border-slate-100 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-950/60 p-4">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Skills</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {(user.skills || []).slice(0, 6).map((skill) => (
                  <span key={skill} className="text-[11px] font-semibold uppercase px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
                    {skill}
                  </span>
                ))}
                {(user.skills || []).length === 0 && (
                  <span className="text-sm text-slate-500 dark:text-slate-400">No skills added yet</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
        <div className="rounded-3xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold">Application progress</p>
              <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">Timeline overview</h2>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">Updated {formatRelativeTime(new Date().toISOString())}</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={applicationStatusCounts}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={90}
                  paddingAngle={4}
                  cornerRadius={12}
                >
                  {applicationStatusCounts.map((entry, index) => (
                    <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold">Top application categories</p>
              <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">Where you’ve applied</h2>
            </div>
          </div>
          {categoryCounts.length > 0 ? (
            <div className="space-y-3">
              {categoryCounts.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between gap-3">
                  <div className="min-w-[92px] text-sm font-medium text-slate-700 dark:text-slate-200">{item.name}</div>
                  <div className="h-2 flex-1 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div className="h-full rounded-full bg-blue-600" style={{ width: `${(item.value / Math.max(...categoryCounts.map((row) => row.value))) * 100}%` }} />
                  </div>
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.value}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">No application data yet. Start exploring roles to populate your dashboard.</p>
          )}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold">Recent applications</p>
            <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">Latest updates</h2>
          </div>
          <Link to="/applications" className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline">Manage applications</Link>
        </div>
        {myApplications.length > 0 ? (
          <div className="grid gap-4">
            {myApplications.slice(0, 4).map((app) => (
              <div key={app.id} className="rounded-3xl p-5 border border-slate-100 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-950/50">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-100">{app.job?.title || 'Open role'}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{app.job?.company || 'Unknown company'}</p>
                  </div>
                  <span className="text-[11px] uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">{new Date(app.appliedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>
                <div className="mt-4 flex items-center justify-between gap-3 text-sm text-slate-500 dark:text-slate-400">
                  <span>{app.status}</span>
                  <span className="font-medium text-slate-900 dark:text-slate-100">{app.job?.location || 'Remote'}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="You haven't applied yet"
            description="Search for roles and submit applications to see progress here."
            actionText="Find Jobs"
              onAction={() => navigate('/jobs')}
          />
        )}
      </div>
    </div>
  )
}
export default DashboardSeeker
