import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name:"chat",
    initialState:{
        onlineUsers:[],
        messages:[],
    },
    reducers:{
        //action to set the socket
        setOnlineUsers:(state,action)=>{
            state.onlineUsers=action.payload;
        },
        setMessages:(state,action)=>{
            state.messages=action.payload
        }

    }
})
export const {setOnlineUsers,setMessages} = chatSlice.actions;
export default chatSlice.reducer;