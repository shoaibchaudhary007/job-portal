import React from 'react';
import { useJobs } from '../context/JobContext';
import { useAuth } from '../context/AuthContext';
import { EmptyState } from '../components/EmptyState';
import { formatRelativeTime } from '../utils/formatters';
import { FileText, Building2, MapPin, Calendar, Clock, ChevronRight } from 'lucide-react';
import { Link, Navigate, useNavigate } from 'react-router-dom';

export const Applications = () => {
  const { user } = useAuth();
  const { jobs, applications, loading } = useJobs();

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (user.role !== 'seeker') {
    return <Navigate to="/dashboard/employer" replace />;
  }

  // Find job details for each application record
  const seekerApplications = applications
    .filter((app) => app.seekerId === user.id)
    .map((app) => {
      const associatedJob = jobs.find((j) => j.id === app.jobId);
      return {
        ...app,
        job: associatedJob,
      };
    })
    .sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate));

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Shortlisted':
        return 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200/50';
      case 'Interviewing':
        return 'text-amber-600 bg-amber-50 dark:bg-amber-950/20 border-amber-200/50';
      case 'Rejected':
        return 'text-rose-600 bg-rose-50 dark:bg-rose-950/20 border-rose-200/50';
      default:
        return 'text-blue-600 bg-blue-50 dark:bg-blue-950/20 border-blue-200/50';
    }
  };

  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-6 py-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
          My Applications
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
          Monitor your applications history and corporate recruitment states
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600" />
        </div>
      ) : seekerApplications.length > 0 ? (
        <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-700/60 text-slate-400 dark:text-slate-500 font-bold text-xs uppercase tracking-wider">
                  <th className="py-4 px-6">Job Details</th>
                  <th className="py-4 px-6">Submitted Date</th>
                  <th className="py-4 px-6">Resume Name</th>
                  <th className="py-4 px-6">Application Status</th>
                  <th className="py-4 px-6">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 font-medium text-slate-700 dark:text-slate-300">
                {seekerApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors">
                    {/* Job Column */}
                    <td className="py-4 px-6 flex items-center gap-3">
                      <img
                        src={app.job?.companyLogo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100'}
                        alt={app.job?.company || 'Company'}
                        className="h-10 w-10 rounded-xl object-cover border bg-slate-50"
                      />
                      <div className="overflow-hidden">
                        <Link
                          to={`/jobs/${app.jobId}`}
                          className="font-bold text-slate-800 dark:text-slate-100 hover:text-blue-600 transition-colors line-clamp-1"
                        >
                          {app.job?.title || 'Open Vacancy'}
                        </Link>
                        <span className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-0.5 mt-0.5">
                          <Building2 className="h-3 w-3" />
                          {app.job?.company || 'N/A'} • {app.job?.location.split(' ')[0]}
                        </span>
                      </div>
                    </td>

                    {/* Date Column */}
                    <td className="py-4 px-6 text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1.5 text-xs">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        {new Date(app.appliedDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </td>

                    {/* Resume Column */}
                    <td className="py-4 px-6 text-xs text-slate-400 dark:text-slate-500">
                      <span className="flex items-center gap-1 truncate max-w-[150px]">
                        <Clock className="h-3.5 w-3.5 shrink-0" />
                        {app.resumeName}
                      </span>
                    </td>

                    {/* Status Column */}
                    <td className="py-4 px-6">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full border text-[10px] font-bold ${getStatusBadge(app.status)}`}>
                        {app.status}
                      </span>
                    </td>

                    {/* Action Column */}
                    <td className="py-4 px-6">
                      <Link
                        to={`/jobs/${app.jobId}`}
                        className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5 cursor-pointer"
                      >
                        View Info
                        <ChevronRight className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          title="No applications submitted yet"
          description="Explore our find jobs panel to locate open positions matching your development capabilities."
          actionText="Find Jobs Now"
          onAction={() => navigate('/jobs')}
          icon={FileText}
        />
      )}
    </div>
  );
};
export default Applications;
