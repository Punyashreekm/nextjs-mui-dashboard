import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Zustand auth store.
 *
 * Why Zustand?
 * - Zero boilerplate compared to Redux (no actions/reducers/slices)
 * - Built-in async actions — just call fetch inside a set callback
 * - Tiny bundle footprint (<1 KB gzipped)
 * - Persist middleware handles localStorage sync automatically
 * - Ideal for small-to-medium apps where Redux overhead is unnecessary
 *
 * This store mirrors the NextAuth session on the client so any component
 * can access auth state without wrapping in <SessionProvider> context.
 */
const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      /** Populate store from the NextAuth session returned by useSession() */
      setSession: (session) => {
        if (session?.user) {
          set({
            user: session.user,
            token: session.accessToken ?? null,
            isAuthenticated: true,
          });
        }
      },

      /** Clear auth state on sign-out */
      clearSession: () =>
        set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: "auth-storage", // localStorage key
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
