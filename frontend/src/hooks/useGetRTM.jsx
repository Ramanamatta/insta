
import { useEffect } from "react";


import useSocketStore from "../just/socketStore.js";
import useChatStore from "../just/chatStore.js";  

const useGetRTM = () => {

  
    const socket=useSocketStore((state)=>state.socket);
    const messages=useChatStore((state)=>state.messages);
    const setMessages=useChatStore((state)=>state.setMessages); 
    
    
    useEffect(()=>{
        socket?.on('newMessage',(newMessage)=>{
          setMessages([...messages, newMessage]);
        })
        return ()=>{
            socket?.off('newMessage');
            
        }
    },[messages,setMessages]);
}
 

export default useGetRTM;
