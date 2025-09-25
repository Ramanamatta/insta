// hooks/useGetAllPost.js
import axios from "axios";
import { useEffect } from "react";
import usePostStore from "../just/postStore.js";
import useAuthStore from "../just/authStore.js";

const useGetAllPost = () => {
  const setPosts = usePostStore((state) => state.setPosts);
  const user = useAuthStore((state) => state.user);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!user) return;
    
    const fetchAllPost = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/v1/post/all`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setPosts(res.data.posts);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchAllPost();
  }, [user, API_URL, setPosts]);
};

export default useGetAllPost;
