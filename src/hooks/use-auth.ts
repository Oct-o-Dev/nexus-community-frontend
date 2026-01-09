import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  user: { name: string; email: string } | null; // Let's store user info too if needed
  setToken: (token: string) => void;
  setUser: (user: { name: string; email: string }) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,

      setToken: (token: string) => set({ token }),
      
      setUser: (user) => set({ user }),

      logout: () => {
        // This effectively wipes the state AND the localStorage 'auth-storage'
        set({ token: null, user: null }); 
        
        // Optional: Force clear everything if you want to be paranoid
        localStorage.removeItem('auth-storage');
        localStorage.removeItem('token'); 
      },
    }),
    {
      name: 'auth-storage', // This matches the key in your screenshot
      storage: createJSONStorage(() => localStorage),
    }
  )
);