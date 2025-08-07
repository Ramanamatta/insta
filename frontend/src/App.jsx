
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
import { useDispatch, useSelector } from 'react-redux'
import { use, useEffect } from 'react'
import { setSocket } from './redux/socketSlice.js'
import { setOnlineUsers } from './redux/chatSlice.js'
import { SelectTrigger } from '@radix-ui/react-select'
import { setLikeNotifications } from './redux/rtnSlice.js'
import ProtectedRoutes from './components/ProtectedRoutes.jsx'


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
  const {user}=useSelector((store)=>store.auth);
  const {socket}=useSelector((store)=>store.socketio);
  const dispatch=useDispatch();
  useEffect(()=>{
    if(user)
    {
      const socketio=io('https://insta-auzq.onrender.com',{
        query:{
          userId:user?._id,
        },
        transports:['websocket']
      })
      dispatch(setSocket(socketio));

      //listen all the online users
      socketio.on('getOnlineUsers',(onlineUsers)=>{
        dispatch(setOnlineUsers(onlineUsers));
      });

      //lisen for notification
 
      socketio.on('notification',(notification)=>{
        dispatch(setLikeNotifications(notification));
      })

      return ()=>{
        socketio.close();
        dispatch(setSocket(null));

      }
    }
    else if(socket){
      socket?.close();
      dispatch(setSocket(null));
    }
  },[user,dispatch])

  return (
    <>
      <RouterProvider router={browserRouter}/>
   
     
    </>
  )
}
export default App
