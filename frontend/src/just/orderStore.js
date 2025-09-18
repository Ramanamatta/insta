import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useOrderStore = create(
  persist(
    (set) => ({
      orders: [],
      setOrders: (orders) => set({ orders }),
    }),
    {
      name: 'order-storage',
    }
  )
);

export default useOrderStore;