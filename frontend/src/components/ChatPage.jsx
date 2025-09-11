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
    <div className="flex ml-[16%] h-screen">
      {/* Left sidebar */}
      <section className="w-ful md:w-1/4 my-8">
        <h1 className="font-bold mb-4 px-3 text-xl">{user?.name}</h1>
        <hr className="mb-4 border-gray-300" />
        <div className="overflow-y-auto h-[80vh]">
          {suggestedUsers.map((suggestedUser) => {
            const isOnline = onlineUsers.includes(suggestedUser._id);
            return (
              <div
                key={suggestedUser._id}
                onClick={() => setSelectedUser(suggestedUser)}
                className="flex gap-3 items-center p-3 hover:bg-gray-50 cursor-pointer"
              >
                <Avatar className="w-14 h-14">
                  <AvatarImage src={suggestedUser?.profilePicture} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium">{suggestedUser?.name}</span>
                  <span
                    className={`text-xs font-bold ${
                      isOnline ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {isOnline ? "online" : "offline"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Right section */}
      {selectedUser ? (
        <section className="flex-1 border-l border-gray-300 flex flex-col h-full">
          <div className="flex gap-3 items-center px-3 py-2 border-b border-gray-300 sticky top-0 bg-white z-10">
            <Avatar>
              <AvatarImage src={selectedUser?.profilePicture} alt="profile" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span>{selectedUser?.name}</span>
            </div>
          </div>

          <Messages selectedUser={selectedUser} />

          <div className="flex items-center p-4 border-t border-t-gray-300">
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              type="text"
              className="flex-1 mr-2 focus-visible:ring-transparent"
              placeholder="Messages"
            />
            <Button onClick={() => sendMessageHandler(selectedUser?._id)}>
              Send
            </Button>
          </div>
        </section>
      ) : (
        <div className="flex flex-col items-center justify-center mx-auto">
          <MessageCircleCode className="w-32 h-32 my-4" />
          <h1 className="font-medium">Your messages</h1>
          <span>send a message to start a conversation</span>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
