// hooks/useGetSuggestedUsers.js
import axios from "axios";
import { useEffect } from "react";
import useAuthStore from "../just/authStore.js"; // adjust the path as necessary

const useGetSuggestedUsers = () => {
  const API_URL = import.meta.env.VITE_API_URL;

  // get the setter directly from Zustand store
  const setSuggestedUsers = useAuthStore((state) => state.setSuggestedUsers);

  useEffect(() => {
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
  }, []);
};

export default useGetSuggestedUsers;
