import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home.jsx'
import JobListings from '../pages/JobListings.jsx'
import JobDetails from '../pages/JobDetails.jsx'
import Login from '../pages/Login.jsx'
import Register from '../pages/Register.jsx'
import SavedJobs from '../pages/SavedJobs.jsx'
import Applications from '../pages/Applications.jsx'
import DashboardSeeker from '../pages/DashboardSeeker.jsx'
import DashboardEmployer from '../pages/DashboardEmployer.jsx'
import NotFound from '../pages/NotFound.jsx'
import ProtectedRoute from '../components/ProtectedRoute.jsx'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/jobs" element={<JobListings />} />
      <Route path="/jobs/:id" element={<JobDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/saved-jobs"
        element={
          <ProtectedRoute role="seeker">
            <SavedJobs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/applications"
        element={
          <ProtectedRoute role="seeker">
            <Applications />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/seeker"
        element={
          <ProtectedRoute role="seeker">
            <DashboardSeeker />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/employer"
        element={
          <ProtectedRoute role="employer">
            <DashboardEmployer />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
