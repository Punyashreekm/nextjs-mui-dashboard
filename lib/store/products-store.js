import { create } from "zustand";

const LIMIT = 12;

/**
 * Caching strategy (same as users-store):
 * Results are cached in-memory by a composite key of (search, category, page).
 * Categories list is also cached after the first fetch to avoid repeated calls
 * since the list is static for the duration of a session.
 */
const useProductsStore = create((set, get) => ({
  products: [],
  total: 0,
  page: 0,
  search: "",
  category: "",
  categories: [],
  loading: false,
  error: null,

  // In-memory result cache: { [cacheKey]: { products, total } }
  cache: {},

  setPage: (page) => set({ page }),
  setSearch: (search) => set({ search, page: 0, category: "" }),
  setCategory: (category) => set({ category, page: 0, search: "" }),

  fetchCategories: async () => {
    // Categories list is static — only fetch once per session
    if (get().categories.length > 0) return;
    try {
      const res = await fetch("https://dummyjson.com/products/category-list");
      const data = await res.json();
      set({ categories: data });
    } catch {
      // Non-critical — just leave categories empty
    }
  },

  fetchProducts: async () => {
    const { page, search, category, cache } = get();
    const skip = page * LIMIT;
    const cacheKey = `${search}:${category}:${skip}`;

    if (cache[cacheKey]) {
      const hit = cache[cacheKey];
      set({ products: hit.products, total: hit.total, loading: false });
      return;
    }

    set({ loading: true, error: null });
    try {
      let url;
      if (search) {
        url = `https://dummyjson.com/products/search?q=${encodeURIComponent(search)}&limit=${LIMIT}&skip=${skip}`;
      } else if (category) {
        url = `https://dummyjson.com/products/category/${encodeURIComponent(category)}?limit=${LIMIT}&skip=${skip}`;
      } else {
        url = `https://dummyjson.com/products?limit=${LIMIT}&skip=${skip}`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();

      set((state) => ({
        products: data.products,
        total: data.total,
        loading: false,
        cache: {
          ...state.cache,
          [cacheKey]: { products: data.products, total: data.total },
        },
      }));
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  fetchProduct: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`https://dummyjson.com/products/${id}`);
      if (!res.ok) throw new Error("Product not found");
      const product = await res.json();
      set({ loading: false });
      return product;
    } catch (err) {
      set({ error: err.message, loading: false });
      return null;
    }
  },
}));

export default useProductsStore;
export { LIMIT as PRODUCTS_LIMIT };
