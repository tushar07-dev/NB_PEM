import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface LoadingState {
  isLoading: boolean
  setLoading: (loading: boolean) => void
}

export const useLoadingStore = create<LoadingState>()(
  devtools(
    (set) => ({
      isLoading: false,
      setLoading: (loading: boolean) => set({ isLoading: loading }),
    }),
    { name: "loading-store" }
  )
)