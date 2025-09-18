// hooks/useGetAllPost.js
import axios from "axios";
import { useEffect } from "react";
import usePostStore from "../just/postStore.js"; // import your zustand store
import useAddProductStore from "../just/addProductStore.js"; // import your zustand store

const useGetAllProducts = () => {
  // get the setter directly from zustand
  
  const setProducts = useAddProductStore((state) => state.setProducts);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchAllPost = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/v1/post/product/all`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setProducts(res.data.products); // direct call, no dispatch needed
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchAllPost();
  }, []); // include dependencies
};

export default useGetAllProducts;
