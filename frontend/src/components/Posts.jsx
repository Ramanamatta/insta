import React from 'react'
import Post from './Post.jsx'
import useAuthStore from '../just/authStore.js'
import usePostStore from '../just/postStore.js'

const Posts = () => {
  const posts=usePostStore((state) =>state.posts);
  const user = useAuthStore((state) => state.user);
  
  if (!user) {
    return null;
  }
  
  return (
    <div>
      {
        posts.map((post,index)=><Post key={index} post ={post} />)
      }
    </div>
  )
}

export default Posts
