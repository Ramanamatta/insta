// hooks/useGetUserProfile.js
import axios from "axios";
import { useEffect } from "react";
import useAuthStore from "../just/authStore.js"; // adjust the path as necessary

const useGetUserProfile = (userId) => {
  const API_URL = import.meta.env.VITE_API_URL;

  // get Zustand setter directly
  const setUserProfile = useAuthStore((state) => state.setUserProfile);

  useEffect(() => {
    const fetchUserProfile = async () => {

      try {
        const res = await axios.get(`${API_URL}/api/v1/user/${userId}/profile`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setUserProfile(res.data.user);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchUserProfile();
  }, [ userId]);
};

export default useGetUserProfile;
