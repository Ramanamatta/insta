// authStore.js
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set) => ({
      // initial state
      user: null,
      suggestedUsers: [],
      userProfile: null,
      selectedUser: null,

      // actions
      setAuthUser: (user) => set({ user }),
      setSuggestedUsers: (suggestedUsers) => set({ suggestedUsers }),
      setUserProfile: (userProfile) => set({ userProfile }),
      setSelectedUser: (selectedUser) => set({ selectedUser }),
    }),
    {
      name: 'auth-storage', // key for localStorage
    }
  )
)

export default useAuthStore
