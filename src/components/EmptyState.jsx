import React from 'react';
import { HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const EmptyState = ({
  title = 'No results found',
  description = 'Try adjusting your search criteria or filters.',
  icon: Icon = HelpCircle,
  actionText,
  onAction,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center text-center p-8 md:p-12 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 shadow-sm"
    >
      <div className="p-4 rounded-full bg-slate-50 dark:bg-slate-900 text-slate-400 dark:text-slate-500 mb-4 ring-8 ring-slate-100/50 dark:ring-slate-900/50">
        <Icon className="h-10 w-10" />
      </div>
      <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">
        {title}
      </h3>
      <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-6 text-sm">
        {description}
      </p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 rounded-xl text-white font-medium bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition-all shadow-md shadow-blue-500/20 cursor-pointer text-sm"
        >
          {actionText}
        </button>
      )}
    </motion.div>
  );
};
export default EmptyState;
