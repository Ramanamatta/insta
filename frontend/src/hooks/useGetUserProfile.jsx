import { setUserProfile } from "@/redux/authSlice";
import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetUserProfile = (userId) => {
  const dispatch = useDispatch();
  const API_URL = import.meta.env.VITE_API_URL;
  useEffect(() => {
    const fetchUserProfile = async () => {

      try {
        const res = await axios.get(`${API_URL}/api/v1/user/${userId}/profile`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setUserProfile(res.data.user));
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchUserProfile();
  }, [userId]);
};

export default useGetUserProfile;
