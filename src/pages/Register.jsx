import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, ArrowRight, UserPlus, Briefcase, Sparkles, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

export const Register = () => {
  const { register: signup } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [selectedRole, setSelectedRole] = useState('seeker'); // 'seeker' | 'employer'

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      location: '',
      company: '',
      skillsInput: '',
      bio: '',
    },
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    
    // Custom payload formatting
    const skills = selectedRole === 'seeker'
      ? data.skillsInput
        ? data.skillsInput.split(',').map((s) => s.trim()).filter((s) => s.length > 0)
        : []
      : undefined;

    const payload = {
      name: data.name,
      email: data.email,
      password: data.password,
      location: data.location,
      role: selectedRole,
      bio: data.bio,
      ...(selectedRole === 'seeker' ? { skills } : { company: data.company }),
    };

    const success = await signup(payload);
    setSubmitting(false);
    
    if (success) {
      if (selectedRole === 'seeker') {
        navigate('/dashboard/seeker');
      } else {
        navigate('/dashboard/employer');
      }
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 shadow-xl"
      >
        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
            Create Account
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-2">
            Join CareerWave and get discovered by top tech employers
          </p>
        </div>

        {/* Role Select Buttons */}
        <div className="mb-6 flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-center">
            I want to join as a
          </label>
          <div className="grid grid-cols-2 gap-3 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/20">
            <button
              onClick={() => setSelectedRole('seeker')}
              type="button"
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedRole === 'seeker'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <User className="h-4 w-4" />
              Job Seeker
            </button>
            <button
              onClick={() => setSelectedRole('employer')}
              type="button"
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedRole === 'employer'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <Briefcase className="h-4 w-4" />
              Employer
            </button>
          </div>
        </div>

        {/* Register form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Full Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <User className="h-4.5 w-4.5" />
              </span>
              <input
                type="text"
                placeholder="Jane Doe"
                {...register('name', { required: 'Name is required' })}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
              />
            </div>
            {errors.name && (
              <span className="text-xs text-rose-500 font-medium pl-1">{errors.name.message}</span>
            )}
          </div>

          {/* Email Address */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <Mail className="h-4.5 w-4.5" />
              </span>
              <input
                type="email"
                placeholder="jane@example.com"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
              />
            </div>
            {errors.email && (
              <span className="text-xs text-rose-500 font-medium pl-1">{errors.email.message}</span>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <Lock className="h-4.5 w-4.5" />
              </span>
              <input
                type="password"
                placeholder="Minimum 6 characters"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
              />
            </div>
            {errors.password && (
              <span className="text-xs text-rose-500 font-medium pl-1">{errors.password.message}</span>
            )}
          </div>

          {/* Location */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Location
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <MapPin className="h-4.5 w-4.5" />
              </span>
              <input
                type="text"
                placeholder="San Francisco, CA"
                {...register('location', { required: 'Location is required' })}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
              />
            </div>
            {errors.location && (
              <span className="text-xs text-rose-500 font-medium pl-1">{errors.location.message}</span>
            )}
          </div>

          {/* Conditional field: Employer -> Company Name */}
          {selectedRole === 'employer' && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Company Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <Briefcase className="h-4.5 w-4.5" />
                </span>
                <input
                  type="text"
                  placeholder="Vortex Technologies"
                  {...register('company', { required: 'Company name is required' })}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
                />
              </div>
              {errors.company && (
                <span className="text-xs text-rose-500 font-medium pl-1">{errors.company.message}</span>
              )}
            </div>
          )}

          {/* Conditional field: Job Seeker -> Skills Input */}
          {selectedRole === 'seeker' && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Professional Skills
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <Sparkles className="h-4.5 w-4.5" />
                </span>
                <input
                  type="text"
                  placeholder="React, CSS, JavaScript, Tailwind (comma separated)"
                  {...register('skillsInput', { required: 'Enter at least one skill' })}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
                />
              </div>
              {errors.skillsInput && (
                <span className="text-xs text-rose-500 font-medium pl-1">{errors.skillsInput.message}</span>
              )}
            </div>
          )}

          {/* Bio input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Brief Bio / Headline
            </label>
            <textarea
              placeholder="Tell us about yourself..."
              rows="2"
              {...register('bio')}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400 resize-none"
            />
          </div>

          {/* Submit Trigger */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-blue-500/20 cursor-pointer mt-3"
          >
            {submitting ? (
              <div className="animate-spin rounded-full h-4.5 w-4.5 border-2 border-t-transparent border-white"></div>
            ) : (
              <>
                <UserPlus className="h-4.5 w-4.5" />
                Register Now
              </>
            )}
          </button>
        </form>

        {/* Footer redirection */}
        <p className="text-xs text-center font-medium text-slate-500 dark:text-slate-400 mt-6">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-blue-600 dark:text-blue-400 font-bold hover:underline inline-flex items-center gap-0.5"
          >
            Sign In Here
            <ArrowRight className="h-3 w-3" />
          </Link>
        </p>
      </motion.div>
    </div>
  );
};
export default Register;
