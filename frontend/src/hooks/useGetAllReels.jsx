// hooks/useGetAllReels.js
import axios from "axios";
import { useEffect } from "react";
import useReelStore from "../just/reelStore.js"; // path to your reelStore

const useGetAllReels = () => {
  const setReels = useReelStore((state) => state.setReels);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchAllReels = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/v1/post/reel/all`, {
          withCredentials: true,
        });
        console.log(res);
        if (res.data.success) {
          setReels(res.data.reels);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchAllReels();
  }, []); // runs once on mount
};

export default useGetAllReels;
