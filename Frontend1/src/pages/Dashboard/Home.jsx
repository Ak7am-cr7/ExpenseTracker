import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useUserAuth } from "../../hooks/useUserAuth";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosinstance";
import { API_PATHS } from "../../utils/apiPaths";
import InfoCard from "../../components/Cards/InfoCard";
import toast from "react-hot-toast"; 

import { LuHandCoins, LuWalletMinimal } from "react-icons/lu";
import { IoMdCard } from "react-icons/io";

import RecentTransactions from "../../components/Dashboard/RecentTransactions";
import FinanceOverview from "../../components/Dashboard/FinanceOverview";
import ExpenseTransactions from "../../components/Dashboard/ExpenseTransactions";
import Last30DaysExpenses from "../../components/Dashboard/Last30DaysExpenses";
import RecentIncomeWithChart from "../../components/Dashboard/RecentIncomeWithChart";
import RecentIncome from "../../components/Dashboard/RecentIncome";
import BudgetProgressBar from "../../components/BudgetProgressBar";

const Home = () => {
  useUserAuth();
  const navigate = useNavigate();

  const [dashboardData, setDashboard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEditLimit, setIsEditLimit] = useState(false); 
  const [limitInput, setLimitInput] = useState("");     

  const fetchDashboardData = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await axiosInstance.get(`${API_PATHS.DASHBOARD.GET_DATA}`);
      if (response.data) {
        setDashboard(response.data);
        // Pre-fill the input with the existing budget
        setLimitInput(response.data.monthlyBudget || 5000);
      }
    } catch (error) {
      console.log("Something went wrong.", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBudget = async () => {
    try {
      const numericLimit = Number(limitInput);

      if (isNaN(numericLimit) || numericLimit <= 0) {
        toast.error("Please enter a valid amount");
        return;
      }

      const response = await axiosInstance.put("/api/v1/auth/update-budget", {
        monthlyLimit: numericLimit,
      });

      if (response.data && !response.data.error) {
        // ✅ FIXED: Update dashboardData so the Progress Bar changes to 10k immediately
        setDashboard((prev) => ({
          ...prev,
          monthlyBudget: numericLimit,
        }));
        
        setIsEditLimit(false); 
        toast.success("Budget updated successfully!");
      }
    } catch (error) {
      console.error("Error updating budget", error);
      toast.error("Failed to update budget");
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="my-5 mx-auto">

        {/* 1. BUDGET SECTION */}
        <div className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 transition-all">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Monthly Spending Goal</h2>
            <button 
              onClick={() => setIsEditLimit(true)} 
              className="text-primary dark:text-violet-400 text-sm font-medium hover:underline"
            >
              Set Budget Limit
            </button>
          </div>

          {isEditLimit && (
            <div className="flex gap-3 mb-6 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-600 animate-in fade-in slide-in-from-top-2">
              <input
                type="number"
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg px-4 py-2 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Enter limit (e.g. 10000)"
                value={limitInput}
                onChange={(e) => setLimitInput(e.target.value)}
              />
              <button 
                className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-all shadow-md shadow-primary/10" 
                onClick={handleUpdateBudget}
              >
                Save
              </button>
              <button 
                className="text-slate-500 dark:text-slate-400 px-2 hover:text-red-500 transition-colors" 
                onClick={() => setIsEditLimit(false)}
              >
                Cancel
              </button>
            </div>
          )}

          {/* ✅ The limit prop now correctly uses numericLimit from state updates */}
          <BudgetProgressBar
            category="Overall Monthly Budget"
            spent={dashboardData?.totalExpense || 0}
            limit={dashboardData?.monthlyBudget || 5000}
          />
        </div>

        {/* 2. INFO CARDS SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <InfoCard
            icon={<IoMdCard />}
            label="Total Balance"
            value={dashboardData?.totalBalance?.toLocaleString("en-IN") || "0"}
            color="bg-primary"
          />

          <InfoCard
            icon={<LuWalletMinimal />}
            label="Total Income"
            value={dashboardData?.totalIncome?.toLocaleString("en-IN") || "0"}
            color="bg-orange-500"
          />

          <InfoCard
            icon={<LuHandCoins />}
            label="Total Expense"
            value={dashboardData?.totalExpense?.toLocaleString("en-IN") || "0"}
            color="bg-red-500"
          />
        </div>

        {/* 3. GRIDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <RecentTransactions
            transactions={dashboardData?.recentTransactions}
            onSeeMore={() => navigate("/expense")}
          />

          <FinanceOverview
            totalBalance={dashboardData?.totalBalance || 0}
            totalIncome={dashboardData?.totalIncome || 0}
            totalExpense={dashboardData?.totalExpense || 0}
          />

          <ExpenseTransactions
            transactions={dashboardData?.last30DaysExpenses?.transactions || []}
            onSeeMore={() => navigate("/expense")}
          />

          <Last30DaysExpenses
            data={dashboardData?.last30DaysExpenses?.transactions || []}
          />

          <RecentIncomeWithChart
            data={dashboardData?.last60DaysIncome?.transactions?.slice(0, 4) || []}
            totalIncome={dashboardData?.totalIncome || 0}
          />

          <RecentIncome
            transactions={dashboardData?.last60DaysIncome?.transactions || []}
            onSeeMore={() => navigate("/income")}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Home;