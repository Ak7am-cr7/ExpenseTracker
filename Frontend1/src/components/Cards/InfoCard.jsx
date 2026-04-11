import React from "react";

const InfoCard = ({ icon, label, value, color}) =>{
    return <div className="flex items-center gap-6 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md shadow-gray-100 dark:shadow-none border border-gray-200/50 dark:border-slate-700 transition-colors duration-300">
    <div className={`w-14 h-14 flex items-center justify-center text-[26px] text-white ${color} rounded-full drop-shadow-xl shrink-0`}>
        {icon}
    </div>
    <div>
        <h6 className="text-sm text-gray-500 dark:text-gray-400 font-medium">{label}</h6>
        <span className="text-2xl text-gray-900 dark:text-white">₹{value}</span>
    </div>
   </div>;
};

export default InfoCard