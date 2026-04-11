import axios from "axios";
import { BASE_URL } from "./apiPaths";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 1000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("token");
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle common errors globally
        if (error.response) {
            const isAuthPage = window.location.pathname === "/login" || window.location.pathname === "/signup";

            if (error.response.status === 401 && !isAuthPage) {
                // Redirect to login page
                window.location.href = "/login";
            } else if (error.response.status === 500) {
                console.error("Server error. Plase try again later.");
            }
        } else if (error.code === "ECONNABORTED") {
            console.error("Resquest timeout. Please try again.");
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
