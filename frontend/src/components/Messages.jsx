import React, { useEffect, useRef } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar.jsx'
import { Button } from './ui/button.jsx'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import useGetAllMessage from '@/hooks/useGetAllMessage'
import useGetRTM from '@/hooks/useGetRTM'

import useChatStore from '../just/chatStore.js'  
import useAuthStore  from '../just/authStore.js'

const Messages = ({ selectedUser }) => {
    useGetRTM();
    useGetAllMessage();
    const messages = useChatStore(store=>store.messages);
    const user = useAuthStore(store=>store.user);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (    
        <div className='overflow-y-auto flex-1 p-4 h-full'>
            <div className='flex justify-center mb-4'>
                <div className='flex flex-col items-center justify-center'>
                    <Avatar className="h-16 w-16">
                        <AvatarImage src={selectedUser?.profilePicture} alt='profile' />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <span className='font-semibold mt-2'>{selectedUser?.username}</span>
                    <Link to={`/profile/${selectedUser?._id}`}>
                        <Button className="h-8 my-2" variant="secondary" size="sm">View profile</Button>
                    </Link>
                </div>
            </div>
            <div className='flex flex-col gap-3 pb-4'>
                {
                   messages && messages.map((msg) => {
                        return (
                            <div key={msg._id} className={`flex ${msg.senderId === user?._id ? 'justify-end' : 'justify-start'}`}>
                                <div className={`p-3 rounded-lg max-w-xs break-words ${msg.senderId === user?._id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
                                    {msg.message}
                                </div>
                            </div>
                        )
                    })
                }
                <div ref={messagesEndRef} />
            </div>
        </div>  
    )
}

export default Messages