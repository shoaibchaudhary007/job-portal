import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from './ThemeToggle';
import { Menu, X, LogOut, LayoutDashboard, Bookmark, FileText, User, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  const activeClassName = ({ isActive }) =>
    `text-sm font-bold transition-all px-3 py-2 rounded-xl ${
      isActive
        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30'
        : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'
    }`;

  return (
    <nav className="sticky top-0 z-40 w-full glass shadow-sm border-b border-slate-200/20 dark:border-slate-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo Brand */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="h-10 w-10 bg-blue-600 dark:bg-blue-500 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-500/20 transition-transform group-hover:scale-105">
              <Sparkles className="h-5 w-5 fill-white" />
            </div>
            <span className="text-lg font-black tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              CareerWave
            </span>
          </Link>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-2">
            <NavLink to="/jobs" className={activeClassName}>
              Find Jobs
            </NavLink>

            {isAuthenticated && user.role === 'seeker' && (
              <>
                <NavLink to="/saved-jobs" className={activeClassName}>
                  Saved Jobs
                </NavLink>
                <NavLink to="/applications" className={activeClassName}>
                  Applications
                </NavLink>
              </>
            )}
          </div>

          {/* Right actions (Theme, auth actions) */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />

            {isAuthenticated ? (
              <div className="relative">
                {/* Profile Avatar Button */}
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors focus:outline-none cursor-pointer"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-8.5 w-8.5 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-sm"
                  />
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-200 pr-1">
                    {user.name.split(' ')[0]}
                  </span>
                </button>

                {/* Profile Dropdown */}
                <AnimatePresence>
                  {dropdownOpen && (
                    <>
                      {/* Backdrop click closer */}
                      <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                      
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2.5 w-52 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 shadow-xl py-2 z-20 text-sm flex flex-col"
                      >
                        {/* Header details */}
                        <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700/60 mb-1.5">
                          <p className="font-bold text-slate-800 dark:text-slate-100 line-clamp-1">{user.name}</p>
                          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium truncate">{user.email}</p>
                          <span className="inline-block text-[9px] font-extrabold uppercase mt-1 px-2 py-0.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-full border border-blue-200/20">
                            {user.role === 'seeker' ? 'Job Seeker' : 'Employer'}
                          </span>
                        </div>

                        {/* Dropdown items */}
                        <Link
                          to={user.role === 'seeker' ? '/dashboard/seeker' : '/dashboard/employer'}
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/60 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                        >
                          <LayoutDashboard className="h-4.5 w-4.5" />
                          Dashboard
                        </Link>
                        
                        {user.role === 'seeker' && (
                          <>
                            <Link
                              to="/saved-jobs"
                              onClick={() => setDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/60 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                            >
                              <Bookmark className="h-4.5 w-4.5" />
                              Saved Jobs
                            </Link>
                            <Link
                              to="/applications"
                              onClick={() => setDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/60 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                            >
                              <FileText className="h-4.5 w-4.5" />
                              My Applications
                            </Link>
                          </>
                        )}

                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2.5 px-4 py-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 hover:text-rose-600 font-bold border-t border-slate-100 dark:border-slate-700/60 mt-1.5 cursor-pointer text-left w-full"
                        >
                          <LogOut className="h-4.5 w-4.5" />
                          Sign Out
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 cursor-pointer"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4.5 py-2 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all shadow-md shadow-blue-500/10 cursor-pointer"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger menu toggle */}
          <div className="flex md:hidden items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden overflow-hidden border-t border-slate-200/20 dark:border-slate-800/30 bg-white dark:bg-slate-900"
          >
            <div className="px-4 py-4 flex flex-col gap-2">
              <Link
                to="/jobs"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Find Jobs
              </Link>
              
              {isAuthenticated ? (
                <>
                  <div className="border-t border-slate-100 dark:border-slate-800/60 my-2 pt-2" />
                  
                  <div className="flex items-center gap-3 px-4 py-2">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-10 w-10 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-100 text-sm leading-none">{user.name}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 font-medium truncate mt-0.5">{user.email}</p>
                    </div>
                  </div>

                  <Link
                    to={user.role === 'seeker' ? '/dashboard/seeker' : '/dashboard/employer'}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>

                  {user.role === 'seeker' && (
                    <>
                      <Link
                        to="/saved-jobs"
                        onClick={() => setMobileMenuOpen(false)}
                        className="px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                      >
                        <Bookmark className="h-4 w-4" />
                        Saved Jobs
                      </Link>
                      <Link
                        to="/applications"
                        onClick={() => setMobileMenuOpen(false)}
                        className="px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                      >
                        <FileText className="h-4 w-4" />
                        My Applications
                      </Link>
                    </>
                  )}

                  <button
                    onClick={handleLogout}
                    className="px-4 py-2.5 rounded-xl text-sm font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 flex items-center gap-2 cursor-pointer w-full text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <div className="border-t border-slate-100 dark:border-slate-800/60 my-2" />
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-center border border-slate-200 dark:border-slate-800"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 text-center shadow-md shadow-blue-500/15"
                  >
                    Register Now
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
export default Navbar;
