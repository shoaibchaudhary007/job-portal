import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ExternalLink, Mail, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="w-full bg-slate-900 text-slate-400 border-t border-slate-800/80 pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand info */}
          <div className="flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <Sparkles className="h-5 w-5 fill-white" />
              </div>
              <span className="text-lg font-black tracking-tight text-white">
                CareerWave
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Scale your development and business careers with elite, automated matching scores, verified employer channels, and real-time dashboard analytics.
            </p>
            <div className="flex items-center gap-3 mt-2 text-slate-500">
                <a href="#" className="hover:text-white transition-colors" aria-label="LinkedIn"><ExternalLink className="h-5 w-5" /></a>
                <a href="#" className="hover:text-white transition-colors" aria-label="Twitter"><ExternalLink className="h-5 w-5" /></a>
                <a href="#" className="hover:text-white transition-colors" aria-label="GitHub"><ExternalLink className="h-5 w-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-4">
              Explore
            </h4>
            <ul className="flex flex-col gap-2 text-sm font-medium">
              <li><Link to="/jobs" className="hover:text-white transition-colors">Find Jobs</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Sign In</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Register</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-4">
              Company
            </h4>
            <ul className="flex flex-col gap-2 text-sm font-medium">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Contact / Newsletter */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-4">
              Newsletter
            </h4>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed font-medium">
              Subscribe to get curated vacancies and growth resources weekly.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <input
                type="email"
                placeholder="Email address"
                required
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-500"
              />
              <button
                type="submit"
                className="px-4.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all rounded-xl shadow-md cursor-pointer"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-500">
          <p>© 2026 CareerWave Job Portal. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500 animate-pulse" /> for elite developers.
          </p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
