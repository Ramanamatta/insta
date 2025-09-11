// zustand/postStore.js
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const usePostStore = create(
  persist(
    (set) => ({
      // initial state
      posts: [],
      selectedPost: null,

      // actions
      setPosts: (posts) => set({ posts }),
      setSelectedPost: (selectedPost) => set({ selectedPost }),

      // optional clear function
      clearPosts: () => set({ posts: [], selectedPost: null }),
    }),
    {
      name: 'post-storage', // key in localStorage
    }
  )
)

export default usePostStore
