import React, { useContext, useState } from "react";
import { SIDE_MENU_DATA } from "../../utils/data";
import { UserContext } from "../../context/UserContext";
import { useTheme } from "../../context/ThemeContext"; // 👈 IMPORT THE THEME
import { useNavigate } from "react-router-dom";
import CharAvatar from "../Cards/CharAvatar";
import uploadImage from "../../utils/uploadImage";
import axiosInstance from "../../utils/axiosinstance";
import { LuUpload, LuTrash2, LuMonitor, LuMoon, LuSun } from "react-icons/lu";

const SideMenu = ({ activeMenu }) => {
    const { user, updateUser, clearUser } = useContext(UserContext);
    const { theme, setTheme } = useTheme(); // 👈 USE THE THEME CONTEXT
    const [uploading, setUploading] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        clearUser();
        navigate("/login");
    };

    const handleImageChange = async (event) => {
        const file = event?.target?.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const token = localStorage.getItem("token");
            const imgUploadRes = await uploadImage(file, token);
            if (!imgUploadRes || (!imgUploadRes.imageUrl && !imgUploadRes.url)) {
                throw new Error("Upload failed");
            }
            const profileImageUrl = imgUploadRes.imageUrl || imgUploadRes.url;
            const response = await axiosInstance.put("/api/v1/auth/update-profile", { profileImageUrl });
            if (response.data && response.data.user) {
                updateUser(response.data.user);
            }
        } catch (error) {
            console.error("Profile update failed:", error);
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteImage = async (e) => {
        e.preventDefault(); 
        if (!window.confirm("Remove photo?")) return;
        setUploading(true);
        try {
            const response = await axiosInstance.delete("/api/v1/auth/delete-image");
            if (response.data && response.data.user) {
                updateUser(response.data.user);
            }
        } catch (error) {
            console.error("Delete failed:", error);
        } finally {
            setUploading(false);
        }
    };

    return (
        /* FIXED: Added dark:bg and dark:border classes */
        <div className="w-64 h-[calc(100vh-61px)] bg-white dark:bg-[#0f172a] border-r border-gray-200/50 dark:border-slate-800 p-5 sticky top-[61px] z-20 flex flex-col justify-between transition-colors duration-300">
            
            <div>
                {/* Profile Section */}
                <div className="flex flex-col items-center justify-center gap-3 mt-3 mb-7">
                    <div className="relative group w-20 h-20">
                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="side-menu-upload" disabled={uploading} />
                        <label htmlFor="side-menu-upload" className="cursor-pointer block w-full h-full rounded-full overflow-hidden border-2 border-primary/10 relative bg-slate-50 dark:bg-slate-800">
                            {user?.profileImageUrl ? (
                                <img src={user.profileImageUrl} alt="Profile" className={`w-full h-full object-cover ${uploading ? 'opacity-40 animate-pulse' : ''}`} />
                            ) : (
                                <CharAvatar fullName={user?.fullName} width="w-full" height="h-full" style={`text-xl ${uploading ? 'opacity-40 animate-pulse' : ''}`} />
                            )}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                                <LuUpload className="text-white text-lg" />
                            </div>
                        </label>
                        {user?.profileImageUrl && !uploading && (
                            <button onClick={handleDeleteImage} className="absolute -top-1 -right-1 bg-red-500 text-white p-1 rounded-full shadow-md z-30"><LuTrash2 size={12} /></button>
                        )}
                    </div>
                    {/* FIXED: Added dark:text-white */}
                    <h5 className="text-gray-950 dark:text-white font-medium leading-6">
                        {user?.fullName || "User"}
                    </h5>
                </div>

                {/* Navigation Menu */}
                <div className="flex flex-col gap-1">
                    {SIDE_MENU_DATA.map((item, index) => (
                        <button
                            key={`menu_${index}`}
                            className={`w-full flex items-center gap-4 text-[15px] ${
                                activeMenu === item.label 
                                ? "text-white bg-primary shadow-md" 
                                : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800/50"
                            } py-3 px-6 rounded-lg mb-1 transition-all`}
                            onClick={() => item.path === "logout" ? handleLogout() : navigate(item.path)}
                        >
                            <item.icon className="text-xl" />
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* NEW: THEME APPEARANCE SELECTOR */}
            <div className="mt-auto pt-5 border-t border-gray-100 dark:border-slate-800">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Appearance</p>
                <div className="grid grid-cols-3 gap-2">
                    <button 
                        onClick={() => setTheme('light')}
                        className={`p-2 flex justify-center rounded-md border ${theme === 'light' ? 'bg-primary text-white border-primary' : 'bg-gray-50 dark:bg-slate-800 text-gray-500 border-gray-200 dark:border-slate-700'}`}
                        title="Light Mode"
                    >
                        <LuSun size={18} />
                    </button>
                    <button 
                        onClick={() => setTheme('dark')}
                        className={`p-2 flex justify-center rounded-md border ${theme === 'dark' ? 'bg-primary text-white border-primary' : 'bg-gray-50 dark:bg-slate-800 text-gray-500 border-gray-200 dark:border-slate-700'}`}
                        title="Dark Mode"
                    >
                        <LuMoon size={18} />
                    </button>
                    <button 
                        onClick={() => setTheme('system')}
                        className={`p-2 flex justify-center rounded-md border ${theme === 'system' ? 'bg-primary text-white border-primary' : 'bg-gray-50 dark:bg-slate-800 text-gray-500 border-gray-200 dark:border-slate-700'}`}
                        title="System Default"
                    >
                        <LuMonitor size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SideMenu;