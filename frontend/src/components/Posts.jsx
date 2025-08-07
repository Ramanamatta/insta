import React from 'react'
import Post from './Post.jsx'
import { useSelector } from 'react-redux'
import store from '@/redux/store.js'

const Posts = () => {
  const {posts}=useSelector(store =>store.post);
  // console.log(posts);
  return (
    <div>
      {
        posts.map((post,index)=><Post key={index} post ={post} />)
        
      }
    </div>
  )
}

export default Posts
