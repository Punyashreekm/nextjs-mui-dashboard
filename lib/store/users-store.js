import { create } from "zustand";

const LIMIT = 10;

/**
 * Caching strategy: results are stored in `cache` keyed by a string
 * derived from the query params (page + search term).  Before making a
 * network request we check the cache; if a hit exists we load from it
 * instantly.  This avoids redundant API calls when the user paginates
 * back and forth or re-visits a page.
 *
 * Trade-off: cache is in-memory only (reset on page reload) to keep
 * stale data from persisting across sessions.
 */
const useUsersStore = create((set, get) => ({
  users: [],
  total: 0,
  page: 0, // 0-indexed for MUI TablePagination
  search: "",
  loading: false,
  error: null,

  // In-memory cache: { [cacheKey]: { users, total } }
  cache: {},

  setPage: (page) => set({ page }),
  setSearch: (search) => set({ search, page: 0 }),

  fetchUsers: async () => {
    const { page, search, cache } = get();
    const skip = page * LIMIT;
    const cacheKey = `${search}:${skip}`;

    // Return cached data immediately — avoids repeat API round-trips
    if (cache[cacheKey]) {
      const hit = cache[cacheKey];
      set({ users: hit.users, total: hit.total, loading: false });
      return;
    }

    set({ loading: true, error: null });
    try {
      const url = search
        ? `https://dummyjson.com/users/search?q=${encodeURIComponent(search)}&limit=${LIMIT}&skip=${skip}`
        : `https://dummyjson.com/users?limit=${LIMIT}&skip=${skip}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();

      // Store in cache
      set((state) => ({
        users: data.users,
        total: data.total,
        loading: false,
        cache: {
          ...state.cache,
          [cacheKey]: { users: data.users, total: data.total },
        },
      }));
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  fetchUser: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`https://dummyjson.com/users/${id}`);
      if (!res.ok) throw new Error("User not found");
      const user = await res.json();
      set({ loading: false });
      return user;
    } catch (err) {
      set({ error: err.message, loading: false });
      return null;
    }
  },
}));

export default useUsersStore;
export { LIMIT as USERS_LIMIT };
