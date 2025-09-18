import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useReelStore = create(
  persist(
    (set) => ({
      // initial state
      reels: [],
      selectedReel: null,

      // actions
      setReels: (reels) => set({ reels }),
      setSelectedReel: (selectedReel) => set({ selectedReel }),

      // optional clear function
      clearReels: () => set({ reels: [], selectedReel: null }),
    }),
    {
      name: 'reel-storage', // key in localStorage
    }
  )
)

export default useReelStore
