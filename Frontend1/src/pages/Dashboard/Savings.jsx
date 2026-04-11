import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import SavingsChart from "../../components/Charts/SavingsChart";
import axiosInstance from "../../utils/axiosinstance"; 
// ✅ FIXED: Changed LuLoader2 to LuLoader
import { LuPlus, LuTrendingUp, LuWallet, LuX, LuLoader } from "react-icons/lu";

const Savings = () => {
  const [savingsHistory, setSavingsHistory] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Form State
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  // 1. Fetch Savings from Backend
  const fetchSavings = async () => {
    try {
      const response = await axiosInstance.get("/api/v1/savings/get-all");
      if (response.data && response.data.savings) {
        setSavingsHistory(response.data.savings);
      }
    } catch (error) {
      console.error("Error fetching savings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavings();
  }, []);

  // 2. Add New Saving to Backend
  const handleAddSaving = async () => {
    if (!amount || !date) return;
    try {
      const response = await axiosInstance.post("/api/v1/savings/add", {
        amount: parseFloat(amount),
        date: date,
      });

      if (response.data) {
        fetchSavings(); 
        setShowAddModal(false);
        setAmount("");
        setDate("");
      }
    } catch (error) {
      console.error("Error adding saving:", error);
    }
  };

  return (
    <DashboardLayout activeMenu="Saving">
      <div className="max-w-7xl mx-auto py-6 px-4">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
               <LuWallet className="text-emerald-500" /> Savings Vault
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Real-time wealth tracking.</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.02]"
          >
            <LuPlus size={20} />
            <span>Add New Saving</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Stats Card */}
          <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm">
            <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Total Savings</p>
            <h3 className="text-3xl font-medium text-slate-900 dark:text-white mt-1">
               {/* ✅ FIXED: Added Number() check to ensure math works */}
               ₹{savingsHistory.reduce((acc, curr) => acc + Number(curr.amount || 0), 0).toLocaleString()}
            </h3>
          </div>

          {/* Chart Section */}
          <div className="lg:col-span-2 card p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">Savings Growth</h3>
            <div className="h-[300px] flex items-center justify-center">
              {loading ? (
                // ✅ FIXED: Using LuLoader here
                <LuLoader className="animate-spin text-emerald-500" size={30} />
              ) : savingsHistory.length > 0 ? (
                <SavingsChart data={savingsHistory} />
              ) : (
                <p className="text-slate-400">No data available yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl w-full max-w-md border border-slate-200 dark:border-slate-800 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold dark:text-white">New Saving</h2>
                <button onClick={() => setShowAddModal(false)}><LuX className="text-slate-400 hover:text-slate-600" size={24} /></button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                    <label className="text-xs text-slate-500 font-medium ml-1">SELECT DATE</label>
                    <input 
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs text-slate-500 font-medium ml-1">AMOUNT</label>
                    <input 
                    type="number" 
                    placeholder="Amount (₹)"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                </div>
                <button 
                  onClick={handleAddSaving} 
                  disabled={!amount || !date}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white py-3 rounded-xl font-bold transition-colors mt-2"
                >
                  Save Entry
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Savings;