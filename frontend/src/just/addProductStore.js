// zustand/postStore.js
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAddProductStore  = create(
  persist(
    (set) => ({
      // initial state
      products: [],
      selectedProducts: null,

      // actions
      setProducts: (products) => set({ products }),
      setSelectedProducts: (selectedProduct) => set({ selectedProduct }),

      // optional clear function
      clearProducts: () => set({ products: [], selectedProducts: null }),
    }),
    {
      name: 'products-storage', // key in localStorage
    }
  )
)

export default useAddProductStore;
