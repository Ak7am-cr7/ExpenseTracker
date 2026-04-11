import React from 'react';

const BudgetProgressBar = ({ spent, limit, category }) => {
  const percentage = (spent / limit) * 100;
  
  // Logic for bar colors
  const barColor = percentage > 90 
    ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]' 
    : percentage > 70 
    ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.4)]' 
    : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]';

  return (
    <div className="mb-4 p-5 border rounded-2xl shadow-sm bg-white dark:bg-slate-800/50 border-slate-100 dark:border-slate-700 transition-all duration-300">
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-semibold text-purple-700 dark:text-purple-400 tracking-wide uppercase">
          {category}
        </span>
        <span className={`text-sm font-bold ${percentage > 90 ? 'text-red-500' : 'text-slate-700 dark:text-slate-200'}`}>
          {Math.round(percentage)}%
        </span>
      </div>

      {/* Progress Bar Track */}
      <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-3 overflow-hidden border border-slate-200/50 dark:border-slate-600/50">
        <div 
          className={`h-full rounded-full transition-all duration-1000 ease-out ${barColor}`} 
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
      </div>

      <div className="flex justify-between items-center mt-3">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          <span className="text-slate-900 dark:text-slate-100 font-bold">₹{spent.toLocaleString('en-IN')}</span> spent
        </p>
        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tighter">
          Limit: ₹{limit.toLocaleString('en-IN')}
        </p>
      </div>
    </div>
  );
};

export default BudgetProgressBar;