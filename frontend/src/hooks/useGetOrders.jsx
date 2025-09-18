import axios from "axios";
import { useEffect } from "react";
import useOrderStore from "../just/orderStore.js";

const useGetOrders = () => {
  const setOrders = useOrderStore((state) => state.setOrders);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/v1/order/my-orders`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setOrders(res.data.orders);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchOrders();
  }, []);
};

export default useGetOrders;