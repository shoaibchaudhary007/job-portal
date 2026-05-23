import React from 'react';
import { motion } from 'framer-motion';

export const StatsCard = ({ title, value, icon: Icon, description, trend }) => {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 shadow-sm flex items-start justify-between transition-shadow hover:shadow-md"
    >
      <div className="flex flex-col justify-between h-full">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
            {title}
          </p>
          <h4 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">
            {value}
          </h4>
        </div>
        {description && (
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 font-medium">
            {description}
          </p>
        )}
        {trend && (
          <div className="flex items-center gap-1.5 mt-2">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${trend.color}`}>
              {trend.value}
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
              {trend.label}
            </span>
          </div>
        )}
      </div>
      <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400">
        <Icon className="h-6 w-6" />
      </div>
    </motion.div>
  );
};
export default StatsCard;
