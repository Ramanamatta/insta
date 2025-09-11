
import axios from "axios";

import { useEffect } from "react";

import useAuthStore from "../just/authStore.js";
import useChatStore from "../just/chatStore.js";



const useGetAllMessage = () => {

  const  selectedUser  = useAuthStore((state) => state.selectedUser);
  const setMessages  = useChatStore((state) => state.setMessages);

  const API_URL = import.meta.env.VITE_API_URL;
  useEffect(() => {
    const fetchAllMessage = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/v1/message/all/${selectedUser?._id}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setMessages(res.data.messages);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllMessage();
  }, [selectedUser]);
};

export default useGetAllMessage;
