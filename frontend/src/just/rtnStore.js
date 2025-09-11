// zustand/rtnStore.js
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useRtnStore = create(
  persist(
    (set) => ({
      // initial state
      likeNotifications: [],

      // action (same logic as your reducer)
      setLikeNotifications: (payload) =>
        set((state) => {
          if (payload.type === 'like') {
            return { likeNotifications: [...state.likeNotifications, payload] }
          } else if (payload.type === 'dislike') {
            return {
              likeNotifications: state.likeNotifications.filter(
                (item) => item.userId !== payload.userId
              ),
            }
          }
          return state // if no matching type
        }),

      // optional clear function
      clearNotifications: () => set({ likeNotifications: [] }),
    }),
    {
      name: 'rtn-storage', // key in localStorage
    }
  )
)

export default useRtnStore
