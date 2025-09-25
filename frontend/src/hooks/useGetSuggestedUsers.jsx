// hooks/useGetSuggestedUsers.js
import axios from "axios";
import { useEffect } from "react";
import useAuthStore from "../just/authStore.js"; // adjust the path as necessary

const useGetSuggestedUsers = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const user = useAuthStore((state) => state.user);
  const setSuggestedUsers = useAuthStore((state) => state.setSuggestedUsers);

  useEffect(() => {
    if (!user) return;
    
    const fetchSuggestedUsers = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/v1/user/suggested`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setSuggestedUsers(res.data.users);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchSuggestedUsers();
  }, [user, API_URL, setSuggestedUsers]);
};

export default useGetSuggestedUsers;
