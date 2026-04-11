import React, { useState } from 'react'
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const Input = ({ value, onChange, placeholder, label, type }) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="mb-4 group">
      {/* Label: Forced to slate-200 for high visibility */}
      <label className="block mb-1.5 text-sm font-medium text-slate-800 dark:text-slate-200 transition-colors">
        {label}
      </label>

      <div className="flex items-center border rounded-lg px-3.5 py-2.5 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus-within:border-primary dark:focus-within:border-primary transition-all shadow-sm">
        <input
          type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
          placeholder={placeholder}
          /* ✅ THE FIX: Changed to pure 'dark:text-white' and brightened placeholder */
          className="w-full bg-transparent outline-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-400 text-[13.5px] 
          autofill:shadow-[0_0_0_30px_white_inset] 
          dark:autofill:shadow-[0_0_0_30px_rgb(15,23,42)_inset]
          /* Force autofill text color to be white */
          [-webkit-text-fill-color:theme(colors.slate.900)]
          dark:[-webkit-text-fill-color:white]"
          
          value={value}
          onChange={(e) => onChange(e)}
        />

        {type === 'password' && (
          <div className="ml-2">
            {showPassword ? (
              <FaRegEye
                size={20}
                className="text-primary cursor-pointer hover:opacity-80"
                onClick={toggleShowPassword}
              />
            ) : (
              /* Icon: Brightened to slate-300 for dark mode visibility */
              <FaRegEyeSlash
                size={20}
                className="text-slate-400 dark:text-slate-300 cursor-pointer hover:text-slate-600 dark:hover:text-white transition-colors"
                onClick={toggleShowPassword}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Input;