import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar.jsx'
import useGetUserProfile from '@/hooks/useGetUserProfile';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button } from './ui/button.jsx';
import { Badge } from './ui/badge.jsx';
import { AtSign, Heart, MessageCircle } from 'lucide-react';

import useAuthStore from '../just/authStore.js'
import usePostStore from '../just/postStore.js'



const Profile = () => {
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);
  const [activeTab, setActiveTab] = useState('posts');

  const user  = useAuthStore((state) => state.user);
  const userProfile = useAuthStore((state) => state.userProfile); 
 

  

  const isLoggedInUserProfile = user?._id === userProfile?._id;
  const isFollowing = false;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  }

  const displayedPost = activeTab === 'posts' ? userProfile?.posts : userProfile?.bookmarks;

  return (
    <div className='min-h-screen pt-16 lg:pt-0 bg-white'>
      <div className='max-w-4xl mx-auto px-4 lg:px-8 py-4 lg:py-8'>
        {/* Profile Header */}
        <div className='flex flex-col lg:grid lg:grid-cols-3 gap-6 lg:gap-8 mb-8'>
          {/* Avatar Section */}
          <div className='flex justify-center lg:justify-start'>
            <Avatar className='h-20 w-20 lg:h-32 lg:w-32'>
              <AvatarImage src={userProfile?.profilePicture} alt="profilephoto" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
          
          {/* Profile Info */}
          <div className='lg:col-span-2 text-center lg:text-left'>
            <div className='flex flex-col lg:flex-row lg:items-center gap-4 mb-4'>
              <h1 className='text-xl lg:text-2xl font-light'>{userProfile?.name}</h1>
              <div className='flex flex-wrap justify-center lg:justify-start gap-2'>
                {
                  isLoggedInUserProfile ? (
                    <>
                      <Link to="/account/edit">
                        <Button variant='secondary' size='sm' className='hover:bg-gray-200'>Edit profile</Button>
                      </Link>
                      <Button variant='secondary' size='sm' className='hover:bg-gray-200 hidden lg:inline-flex'>View archive</Button>
                      <Button variant='secondary' size='sm' className='hover:bg-gray-200 hidden lg:inline-flex'>Ad tools</Button>
                    </>
                  ) : (
                    isFollowing ? (
                      <>
                        <Button variant='secondary' size='sm'>Unfollow</Button>
                        <Button variant='secondary' size='sm'>Message</Button>
                      </>
                    ) : (
                      <Button className='bg-[#0095F6] hover:bg-[#3192d2]' size='sm'>Follow</Button>
                    )
                  )
                }
              </div>
            </div>
            
            {/* Stats */}
            <div className='flex justify-center lg:justify-start items-center gap-6 lg:gap-8 mb-4'>
              <div className='text-center lg:text-left'>
                <span className='font-semibold text-lg'>{userProfile?.posts.length}</span>
                <p className='text-sm text-gray-600'>posts</p>
              </div>
              <div className='text-center lg:text-left'>
                <span className='font-semibold text-lg'>{userProfile?.followers.length}</span>
                <p className='text-sm text-gray-600'>followers</p>
              </div>
              <div className='text-center lg:text-left'>
                <span className='font-semibold text-lg'>{userProfile?.following.length}</span>
                <p className='text-sm text-gray-600'>following</p>
              </div>
            </div>
            
            {/* Bio */}
            <div className='space-y-1 text-sm'>
              <p className='font-semibold'>{userProfile?.bio || 'Bio here...'}</p>
              <Badge className='w-fit mx-auto lg:mx-0' variant='secondary'>
                <AtSign size={12} /> 
                <span className='pl-1'>{userProfile?.username}</span>
              </Badge>
              <p className='hidden lg:block'>🤯Learn code with patel mernstack style</p>
              <p className='hidden lg:block'>🤯Turning code into fun</p>
              <p className='hidden lg:block'>🤯DM for collaboration</p>
            </div>
          </div>
        </div>
        {/* Tabs and Posts Grid */}
        <div className='border-t border-gray-200'>
          <div className='flex items-center justify-center gap-8 lg:gap-16 text-xs lg:text-sm font-medium text-gray-500'>
            <button 
              className={`py-4 cursor-pointer border-t-2 transition-colors ${
                activeTab === 'posts' 
                  ? 'border-black text-black font-semibold' 
                  : 'border-transparent hover:text-gray-700'
              }`} 
              onClick={() => handleTabChange('posts')}
            >
              POSTS
            </button>
            <button 
              className={`py-4 cursor-pointer border-t-2 transition-colors ${
                activeTab === 'saved' 
                  ? 'border-black text-black font-semibold' 
                  : 'border-transparent hover:text-gray-700'
              }`} 
              onClick={() => handleTabChange('saved')}
            >
              SAVED
            </button>
            <button className='py-4 cursor-pointer border-t-2 border-transparent hover:text-gray-700'>REELS</button>
            <button className='py-4 cursor-pointer border-t-2 border-transparent hover:text-gray-700'>TAGS</button>
          </div>
          
          {/* Posts Grid */}
          <div className='grid grid-cols-3 gap-1 lg:gap-4 mt-4'>
            {
              displayedPost?.map((post) => {
                return (
                  <div key={post?._id} className='relative group cursor-pointer'>
                    <img 
                      src={post.image} 
                      alt='postimage' 
                      className='w-full aspect-square object-cover' 
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className='flex items-center text-white space-x-6'>
                        <div className='flex items-center gap-2'>
                          <Heart size={20} fill='white' />
                          <span className='font-semibold'>{post?.likes.length}</span>
                        </div>
                        <div className='flex items-center gap-2'>
                          <MessageCircle size={20} fill='white' />
                          <span className='font-semibold'>{post?.comments.length}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile