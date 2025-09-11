import { create } from "zustand";
import { persist } from "zustand/middleware";

const useSocketStore = create(
  persist(
    (set) => ({
      socket: null,                       // same as initialState
      setSocket: (socket) => set({ socket }), // same as reducer action
    }),
    {
      name: "socket-storage",             // localStorage key
      // We only want to persist serializable values.
      // This prevents trying to store the live socket object itself.
      partialize: (state) => ({
        // persist only what is serializable (for example socket URL)
        // socket: state.socket,  // ❌ if it's a real Socket.io object it won't serialize
      }),
    }
  )
);

export default useSocketStore;
