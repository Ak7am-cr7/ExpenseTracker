import React, { useState, useContext } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useTheme } from "../../context/ThemeContext";
import { UserContext } from "../../context/UserContext"; // Added for profile view
import axiosInstance from "../../utils/axiosinstance";
import toast from "react-hot-toast";
import { LuPaintbrush, LuWallet } from "react-icons/lu";

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const { user } = useContext(UserContext); // Accessing user data
  const [budget, setBudget] = useState(user?.monthlyLimit || "");
  const [loading, setLoading] = useState(false);

  const handleSaveBudget = async () => {
    if (!budget || isNaN(budget)) {
      return toast.error("Please enter a valid budget amount");
    }

    setLoading(true);
    try {
      const response = await axiosInstance.put("/api/v1/auth/update-budget", { 
        monthlyLimit: Number(budget) 
      });

      if (response.data && !response.data.error) {
        toast.success("Budget preference saved!");
      }
    } catch (error) {
      console.error("Error updating budget:", error);
      toast.error("Failed to save budget");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout activeMenu="Settings">
      <div className="max-w-3xl mx-auto my-10 px-4">
        
        {/* Header Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage your app preferences and account</p>
        </div>

        <div className="space-y-6">
          
          {/* Profile Overview Card (Read Only) */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-primary">
               <img 
                src={user?.profileImageUrl || "https://via.placeholder.com/150"} 
                alt="Profile" 
                className="w-full h-full object-cover"
               />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">{user?.fullName || "User Name"}</h3>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
          </div>

          {/* Appearance Card */}
          <div className="p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all">
            <div className="flex items-center gap-2 mb-6 text-primary">
              <LuPaintbrush size={20} />
              <h3 className="font-bold text-slate-900 dark:text-white">Appearance</h3>
            </div>
            
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Choose how the interface looks for you.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {['light', 'dark', 'system'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setTheme(mode)}
                  className={`p-3 rounded-xl border text-sm font-medium capitalize transition-all ${
                    theme === mode 
                    ? 'border-primary bg-primary/5 text-primary' 
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {mode} Mode
                </button>
              ))}
            </div>
          </div>

          {/* Budget Setting Card */}
          <div className="p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all">
            <div className="flex items-center gap-2 mb-6 text-primary">
              <LuWallet size={20} />
              <h3 className="font-bold text-slate-900 dark:text-white">Monthly Budget</h3>
            </div>

            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Set your default spending goal (₹). This affects the progress bars on your dashboard.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="e.g. 10000"
                className="flex-1 p-3.5 border rounded-xl dark:bg-slate-800 dark:text-white border-slate-200 dark:border-slate-700 outline-none focus:border-primary transition-all text-sm"
              />
              <button
                onClick={handleSaveBudget}
                disabled={loading}
                className="btn-primary !py-3 !px-8 !w-fit disabled:opacity-50"
              >
                {loading ? "Saving..." : "Update Budget"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;