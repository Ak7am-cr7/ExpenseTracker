import React, { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { useTheme } from "../../context/ThemeContext"; // Import our new hook
import Navbar from "./Navbar";
import SideMenu from "./SideMenu";
import { LuMonitor, LuMoon, LuSun } from "react-icons/lu";

const DashboardLayout = ({ children, activeMenu }) => {
    const { user } = useContext(UserContext);
    const { theme, setTheme } = useTheme();

    return (
        <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
            <Navbar activeMenu={activeMenu} />

            {(user || localStorage.getItem("token")) && (
                <div className="flex">
                    <div className="max-[1080px]:hidden relative w-64 border-r border-gray-100 dark:border-slate-800">
                        <SideMenu activeMenu={activeMenu} />
                        
                        {/* Appearance Settings in Sidebar */}
                        <div className="absolute bottom-10 left-6 right-6">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 block">Appearance</label>
                            <select 
                                value={theme} 
                                onChange={(e) => setTheme(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-slate-700 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="light">☀️ Light</option>
                                <option value="dark">🌙 Dark</option>
                                <option value="system">💻 System</option>
                            </select>
                        </div>
                    </div>

                    <div className="grow mx-5 dark:text-white">
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardLayout;