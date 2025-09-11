import React from 'react'
import Post from './Post.jsx'


import usePostStore from '../just/postStore.js'

const Posts = () => {
  const posts=usePostStore((state) =>state.posts);
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
