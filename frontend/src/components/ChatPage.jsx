import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar.jsx";
import { Input } from "./ui/input.jsx";
import { Button } from "./ui/button.jsx";
import { MessageCircleCode } from "lucide-react";
import Messages from "./Messages";
import axios from "axios";

// ✅ Import Zustand stores
import useAuthStore from "../just/authStore.js";
import useChatStore from "../just/chatStore.js";

const ChatPage = () => {
  // auth state
  const { user, suggestedUsers, selectedUser, setSelectedUser } = useAuthStore();
  // chat state
  const { onlineUsers, messages, setMessages } = useChatStore();

  const [text, setText] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;

  // send message handler
  const sendMessageHandler = async (receiverId) => {
    try {
      const res = await axios.post(
        `${API_URL}/api/v1/message/send/${receiverId}`,
        { text },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true
        })
      if (res.data.success) {
        setMessages([...messages, res.data.newMessage]);
        setText("");
      }
    } catch (error) {
      console.log(error);
    }
  }

  // cleanup on unmount
  useEffect(() => {
    return () => {
      setSelectedUser(null);
    };
  }, []);

  return (
    <div className="flex h-screen pt-16 lg:pt-0 bg-white">
      {/* Left sidebar - Users List */}
      <section className={`${
        selectedUser ? 'hidden lg:flex' : 'flex'
      } flex-col w-full lg:w-80 border-r border-gray-200`}>
        <div className="p-4 border-b border-gray-200">
          <h1 className="font-bold text-xl">{user?.name}</h1>
        </div>
        <div className="flex-1 overflow-y-auto">
          {suggestedUsers.map((suggestedUser) => {
            const isOnline = onlineUsers.includes(suggestedUser._id);
            return (
              <div
                key={suggestedUser._id}
                onClick={() => setSelectedUser(suggestedUser)}
                className="flex gap-3 items-center p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
              >
                <div className="relative">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={suggestedUser?.profilePicture} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  {isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{suggestedUser?.name}</p>
                  <p className={`text-xs ${
                    isOnline ? "text-green-600" : "text-red-600"
                  }`}>
                    {isOnline ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Right section - Chat */}
      {selectedUser ? (
        <section className="flex-1 flex flex-col h-full">
          {/* Chat Header */}
          <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-white">
            <button 
              onClick={() => setSelectedUser(null)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-full"
            >
              ←
            </button>
            <Avatar className="w-10 h-10">
              <AvatarImage src={selectedUser?.profilePicture} alt="profile" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold text-sm">{selectedUser?.name}</h2>
              <p className="text-xs text-gray-500">Active now</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-hidden">
            <Messages selectedUser={selectedUser} />
          </div>

          {/* Message Input */}
          <div className="flex items-center gap-2 p-4 border-t border-gray-200 bg-white">
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              type="text"
              className="flex-1 focus-visible:ring-transparent"
              placeholder="Message..."
              onKeyPress={(e) => {
                if (e.key === 'Enter' && text.trim()) {
                  sendMessageHandler(selectedUser?._id);
                }
              }}
            />
            <Button 
              onClick={() => sendMessageHandler(selectedUser?._id)}
              disabled={!text.trim()}
              size="sm"
            >
              Send
            </Button>
          </div>
        </section>
      ) : (
        <div className="hidden lg:flex flex-1 flex-col items-center justify-center bg-gray-50">
          <MessageCircleCode className="w-24 h-24 text-gray-400 mb-4" />
          <h1 className="font-semibold text-xl mb-2">Your Messages</h1>
          <p className="text-gray-500 text-center">Send private messages to a friend or group</p>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
