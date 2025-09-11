import React, { Children, use, useEffect } from 'react'

import { useNavigate } from 'react-router-dom';

import useAuthStore from '../just/authStore.js';


const ProtectedRoutes = ({children}) => {
    const  user  = useAuthStore((state) => state.user);
    const navigate = useNavigate();
    useEffect(()=>{
         if(!user){
        navigate('/login');
        }
    },[])
  return <>{children}</>
}

export default ProtectedRoutes;
