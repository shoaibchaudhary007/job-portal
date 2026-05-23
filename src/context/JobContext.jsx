import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';
import { toast } from 'react-hot-toast';

const JobContext = createContext();

export const JobProvider = ({ children }) => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all jobs
  const fetchJobs = useCallback(async () => {
    try {
      const response = await api.get('/jobs');
      setJobs(response.data);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      toast.error('Failed to load jobs from server.');
    }
  }, []);

  // Fetch applications for seeker or employer
  const fetchApplications = useCallback(async () => {
    if (!user) return;
    try {
      let url = '/applications';
      if (user.role === 'seeker') {
        url = `/applications?seekerId=${user.id}`;
      } else if (user.role === 'employer') {
        // In full mock setup, we fetch all applications and we'll filter on the client or by joining
        // We'll filter based on jobs owned by the employer
      }
      const response = await api.get(url);
      setApplications(response.data);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    }
  }, [user]);

  // Fetch saved jobs for current seeker
  const fetchSavedJobs = useCallback(async () => {
    if (!user || user.role !== 'seeker') return;
    try {
      const response = await api.get(`/savedJobs?seekerId=${user.id}`);
      setSavedJobs(response.data);
    } catch (error) {
      console.error('Failed to fetch saved jobs:', error);
    }
  }, [user]);

  // Load all initial data on mount/auth change
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchJobs();
      if (user) {
        await fetchApplications();
        if (user.role === 'seeker') {
          await fetchSavedJobs();
        }
      }
      setLoading(false);
    };
    loadData();
  }, [user, fetchJobs, fetchApplications, fetchSavedJobs]);

  // Save/Bookmark toggle job
  const toggleSaveJob = async (jobId) => {
    if (!user) {
      toast.error('Please login to bookmark jobs!');
      return false;
    }
    if (user.role !== 'seeker') {
      toast.error('Only job seekers can save jobs.');
      return false;
    }

    const savedRecord = savedJobs.find((sj) => sj.jobId === jobId);

    try {
      if (savedRecord) {
        // Remove from bookmark
        await api.delete(`/savedJobs/${savedRecord.id}`);
        setSavedJobs((prev) => prev.filter((sj) => sj.id !== savedRecord.id));
        toast.success('Job removed from bookmarks.');
      } else {
        // Add to bookmark
        const newSave = {
          seekerId: user.id,
          jobId: jobId,
        };
        const response = await api.post('/savedJobs', newSave);
        setSavedJobs((prev) => [...prev, response.data]);
        toast.success('Job saved successfully!');
      }
      return true;
    } catch (error) {
      console.error('Error toggling saved job:', error);
      toast.error('Failed to update saved jobs.');
      return false;
    }
  };

  // Submit job application
  const applyForJob = async (jobId, applicationDetails) => {
    if (!user) {
      toast.error('Please login to apply!');
      return false;
    }
    try {
      // Validate double application
      const alreadyApplied = applications.some((app) => app.jobId === jobId && app.seekerId === user.id);
      if (alreadyApplied) {
        toast.error('You have already applied to this job.');
        return false;
      }

      const newApplication = {
        jobId,
        seekerId: user.id,
        appliedDate: new Date().toISOString(),
        status: 'Applied',
        ...applicationDetails,
      };

      const response = await api.post('/applications', newApplication);
      setApplications((prev) => [...prev, response.data]);
      
      // Increment applicantsCount on the job card
      const targetJob = jobs.find((j) => j.id === jobId);
      if (targetJob) {
        const updatedCount = (targetJob.applicantsCount || 0) + 1;
        await api.patch(`/jobs/${jobId}`, { applicantsCount: updatedCount });
        setJobs((prev) => prev.map((j) => j.id === jobId ? { ...j, applicantsCount: updatedCount } : j));
      }

      toast.success('Application submitted successfully!');
      return true;
    } catch (error) {
      console.error('Error applying for job:', error);
      toast.error('Failed to submit application.');
      return false;
    }
  };

  // Post new job (Employer)
  const postJob = async (jobDetails) => {
    if (!user || user.role !== 'employer') return false;
    try {
      const newJob = {
        ...jobDetails,
        company: user.company || 'Vortex Technologies',
        companyLogo: user.avatar || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100',
        employerId: user.id,
        postedDate: new Date().toISOString(),
        applicantsCount: 0,
      };

      const response = await api.post('/jobs', newJob);
      setJobs((prev) => [response.data, ...prev]);
      toast.success('Job posted successfully!');
      return response.data;
    } catch (error) {
      console.error('Error posting job:', error);
      toast.error('Failed to post job.');
      return false;
    }
  };

  // Edit job (Employer)
  const updateJob = async (jobId, updatedDetails) => {
    if (!user || user.role !== 'employer') return false;
    try {
      const targetJob = jobs.find((j) => j.id === jobId);
      if (!targetJob || targetJob.employerId !== user.id) {
        toast.error('You do not have permission to edit this job.');
        return false;
      }

      const response = await api.patch(`/jobs/${jobId}`, updatedDetails);
      setJobs((prev) => prev.map((j) => j.id === jobId ? response.data : j));
      toast.success('Job updated successfully!');
      return response.data;
    } catch (error) {
      console.error('Error updating job:', error);
      toast.error('Failed to update job.');
      return false;
    }
  };

  // Delete job (Employer)
  const deleteJob = async (jobId) => {
    if (!user || user.role !== 'employer') return false;
    try {
      const targetJob = jobs.find((j) => j.id === jobId);
      if (!targetJob || targetJob.employerId !== user.id) {
        toast.error('You do not have permission to delete this job.');
        return false;
      }

      await api.delete(`/jobs/${jobId}`);
      setJobs((prev) => prev.filter((j) => j.id !== jobId));
      toast.success('Job deleted successfully.');
      return true;
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error('Failed to delete job.');
      return false;
    }
  };

  // Update Application Status (Employer review)
  const updateApplicationStatus = async (appId, newStatus) => {
    if (!user || user.role !== 'employer') return false;
    try {
      const response = await api.patch(`/applications/${appId}`, { status: newStatus });
      setApplications((prev) => prev.map((app) => app.id === appId ? { ...app, status: newStatus } : app));
      toast.success(`Application marked as ${newStatus}`);
      return true;
    } catch (error) {
      console.error('Failed to update application status:', error);
      toast.error('Failed to update applicant status.');
      return false;
    }
  };

  return (
    <JobContext.Provider
      value={{
        jobs,
        applications,
        savedJobs,
        loading,
        toggleSaveJob,
        applyForJob,
        postJob,
        updateJob,
        deleteJob,
        updateApplicationStatus,
        refreshJobs: fetchJobs,
        refreshApplications: fetchApplications,
      }}
    >
      {children}
    </JobContext.Provider>
  );
};

export const useJobs = () => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
};
