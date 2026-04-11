import { useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import axiosInstance from "../utils/axiosinstance";
import { API_PATHS } from "../utils/apiPaths";

export const useUserAuth = () => {
  const { user, updateUser, clearUser } = useContext(UserContext);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      clearUser();
      return;
    }

    if (user && user.email) return;

    let isMounted = true;

    const fetchUserInfo = async () => {
      try {
        const response = await axiosInstance.get(
          API_PATHS.AUTH.GET_USER_INFO
        );

        if (isMounted && response.data) {
          updateUser(response.data);
        }
      } catch (error) {
        console.error("Auth failed:", error);
        clearUser();
        localStorage.removeItem("token");
      }
    };

    fetchUserInfo();

    return () => {
      isMounted = false;
    };
  }, [user, updateUser, clearUser]);
};