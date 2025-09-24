
import Signup from './components/Signup.jsx'
import { Toaster } from 'sonner'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import  Home  from './components/Home.jsx'
import Mainlayout from './components/Mainlayout.jsx'
import Login from './components/Login.jsx'
import Profile from './components/Profile.jsx'
import EditProfile from './components/EditProfile.jsx'
import ChatPage from './components/ChatPage.jsx'
import {io} from 'socket.io-client';
import { use, useEffect } from 'react'

import ProtectedRoutes from './components/ProtectedRoutes.jsx'

import useAuthStore from "./just/authStore.js"
import useSocketStore  from "./just/socketStore.js"
import useChatStore  from './just/chatStore.js';
import useRtnStore from './just/rtnStore.js';
import ReelsPage from './components/ReelsPage.jsx'
import ProductPage from './components/ProductPage.jsx'
import GetALLProductPage from './components/AlllProductPage.jsx'
import OrdersPage from './components/OrdersPage.jsx'

const browserRouter=createBrowserRouter(
  [
    {
      path: '/',
      element:<ProtectedRoutes><Mainlayout/></ProtectedRoutes> ,  
      children:[
        {
          path:'/',
          element:<ProtectedRoutes><Home/></ProtectedRoutes>

        },
        {
          path:"/profile/:id",
          element:<ProtectedRoutes><Profile/></ProtectedRoutes>
        },
        {
          path: '/account/edit',
          element: <ProtectedRoutes><EditProfile/></ProtectedRoutes> 
        },
        {
          path:'/chat',
          element:<ProtectedRoutes><ChatPage/></ProtectedRoutes> 
        },
        {
          path:'/reels',
          element:<ProtectedRoutes><ReelsPage/></ProtectedRoutes>  
        },
        {
          path:'/products',
          element:<ProtectedRoutes><ProductPage/></ProtectedRoutes>
        },
        {
          path:'/all-products',
          element:<ProtectedRoutes><GetALLProductPage/></ProtectedRoutes> 
        },
        {
          path:'/orders',
          element:<ProtectedRoutes><OrdersPage/></ProtectedRoutes>
        }
      ]
    },
    {
      path: '/signup',
      element: <Signup/>
    },
    {
      path: '/login',
      element: <Login/>
    }

  ]
)
function App() {
  const user=useAuthStore((state)=>state.user);
  const socket=useSocketStore((state)=>state.socket);
  const setSocket=useSocketStore((state)=>state.setSocket);
  const setOnlineUsers=useChatStore((state)=>state.setOnlineUsers);
  const setLikeNotifications=useRtnStore((state)=>state.setLikeNotifications);


  useEffect(()=>{
    if(user)
    {
      const socketio=io(import.meta.env.VITE_API_URL,{
        query:{
          userId:user?._id,
        },
        transports:['websocket']
      })
      setSocket(socketio);

      //listen all the online users
      socketio.on('getOnlineUsers',(onlineUsers)=>{
        setOnlineUsers(onlineUsers);
      });

      //lisen for notification
 
      socketio.on('notification',(notification)=>{
        setLikeNotifications(notification);
      })

      return ()=>{
        socketio.close();
        setSocket(null);

      }
    }
    else if(socket){
      socket?.close();
      setSocket(null);
    }
  },[user,setSocket,setOnlineUsers,setLikeNotifications])

  return (
    <>
      <RouterProvider router={browserRouter}/>
   
     
    </>
  )
}
export default App
