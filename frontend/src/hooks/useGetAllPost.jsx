// hooks/useGetAllPost.js
import axios from "axios";
import { useEffect } from "react";
import usePostStore from "../just/postStore.js"; // import your zustand store

const useGetAllPost = () => {
  // get the setter directly from zustand
  const setPosts = usePostStore((state) => state.setPosts);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchAllPost = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/v1/post/all`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setPosts(res.data.posts); // direct call, no dispatch needed
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchAllPost();
  }, []); // include dependencies
};

export default useGetAllPost;
