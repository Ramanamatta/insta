// zustand/chatStore.js
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useChatStore = create(
  persist(
    (set) => ({
      // initial state
      onlineUsers: [],
      messages: [],

      // actions
      setOnlineUsers: (onlineUsers) => set({ onlineUsers }),
      setMessages: (messages) => set({ messages }),
    }),
    {
      name: 'chat-storage', // key name in localStorage
    }
  )
)

export default useChatStore
