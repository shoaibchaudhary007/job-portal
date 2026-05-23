import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn, ArrowRight, UserCheck, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const from = location.state?.from?.pathname || '/';

  const onSubmit = async (data) => {
    setSubmitting(true);
    const successUser = await login(data.email, data.password);
    setSubmitting(false);
    if (successUser) {
      // Redirect based on role or original path
      if (from === '/') {
        if (successUser.role === 'seeker') {
          navigate('/dashboard/seeker');
        } else if (successUser.role === 'employer') {
          navigate('/dashboard/employer');
        }
      } else {
        navigate(from, { replace: true });
      }
    }
  };

  // Demo accounts shortcuts
  const handleQuickLogin = async (role) => {
    const email = role === 'seeker' ? 'seeker@test.com' : 'employer@test.com';
    const password = '123456';
    setValue('email', email);
    setValue('password', password);
    
    setSubmitting(true);
    const successUser = await login(email, password);
    setSubmitting(false);
    
    if (successUser) {
      if (role === 'seeker') {
        navigate('/dashboard/seeker');
      } else {
        navigate('/dashboard/employer');
      }
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 shadow-xl"
      >
        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
            Welcome Back
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-2">
            Access your custom job board and matching dashboards
          </p>
        </div>

        {/* Demo login presets */}
        <div className="mb-6 flex flex-col gap-2.5">
          <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-center">
            Quick Demo Shortcuts
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleQuickLogin('seeker')}
              type="button"
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 text-xs font-bold transition-all hover:bg-blue-50 dark:hover:bg-blue-950/40 cursor-pointer active:scale-95 shadow-sm"
            >
              <UserCheck className="h-4 w-4" />
              Job Seeker
            </button>
            <button
              onClick={() => handleQuickLogin('employer')}
              type="button"
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold transition-all hover:bg-indigo-50 dark:hover:bg-indigo-950/40 cursor-pointer active:scale-95 shadow-sm"
            >
              <Briefcase className="h-4 w-4" />
              Employer
            </button>
          </div>
        </div>

        <div className="relative flex py-2.5 items-center my-4">
          <div className="flex-grow border-t border-slate-100 dark:border-slate-700/60"></div>
          <span className="flex-shrink mx-4 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Or Sign In With Email
          </span>
          <div className="flex-grow border-t border-slate-100 dark:border-slate-700/60"></div>
        </div>

        {/* Login form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email input */}
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
                placeholder="seeker@test.com"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
              />
            </div>
            {errors.email && (
              <span className="text-xs text-rose-500 font-medium pl-1">{errors.email.message}</span>
            )}
          </div>

          {/* Password input */}
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
                placeholder="••••••••"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
              />
            </div>
            {errors.password && (
              <span className="text-xs text-rose-500 font-medium pl-1">{errors.password.message}</span>
            )}
          </div>

          {/* Submit Trigger */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-blue-500/20 cursor-pointer mt-2"
          >
            {submitting ? (
              <div className="animate-spin rounded-full h-4.5 w-4.5 border-2 border-t-transparent border-white"></div>
            ) : (
              <>
                <LogIn className="h-4.5 w-4.5" />
                Sign In
              </>
            )}
          </button>
        </form>

        {/* Footer redirection */}
        <p className="text-xs text-center font-medium text-slate-500 dark:text-slate-400 mt-6">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="text-blue-600 dark:text-blue-400 font-bold hover:underline inline-flex items-center gap-0.5"
          >
            Register Here
            <ArrowRight className="h-3 w-3" />
          </Link>
        </p>
      </motion.div>
    </div>
  );
};
export default Login;
