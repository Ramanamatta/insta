import { createSlice } from "@reduxjs/toolkit";

const rtnSlice=createSlice({
    name:'realTimeNotifications',
    initialState:{
        likeNotifications:[],
    },
    reducers:{
        setLikeNotifications:(state,action)=>{
            if(action.payload.type==='like'){
                state.likeNotifications.push(action.payload);
            }
            else if(action.payload.type==='dislike'){
                state.likeNotifications=state.likeNotifications.filter((item)=>item.userId !== action.payload.userId)
            }

        }
    }
});
export const {setLikeNotifications}=rtnSlice.actions;
export default rtnSlice.reducer;
