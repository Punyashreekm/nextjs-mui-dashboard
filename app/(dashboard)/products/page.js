"use client";

import { useEffect, useCallback, useMemo, memo } from "react";
import Link from "next/link";
import useProductsStore, { PRODUCTS_LIMIT } from "@/lib/store/products-store";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardActionArea from "@mui/material/CardActionArea";
import Chip from "@mui/material/Chip";
import Rating from "@mui/material/Rating";
import Pagination from "@mui/material/Pagination";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";

/**
 * Memoised product card — only re-renders when its own data changes,
 * not when the surrounding list paginates or filters change.
 */
const ProductCard = memo(function ProductCard({ product }) {
  return (
    <Card
      elevation={1}
      sx={{ borderRadius: 2, height: "100%", display: "flex", flexDirection: "column" }}
    >
      <CardActionArea
        component={Link}
        href={`/products/${product.id}`}
        sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "stretch" }}
      >
        <CardMedia
          component="img"
          height="180"
          image={product.thumbnail}
          alt={product.title}
          sx={{ objectFit: "cover" }}
        />
        <CardContent sx={{ flex: 1 }}>
          <Chip
            label={product.category}
            size="small"
            variant="outlined"
            sx={{ mb: 1, fontSize: "0.7rem", textTransform: "capitalize" }}
          />
          <Typography variant="subtitle2" fontWeight={700} gutterBottom noWrap>
            {product.title}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Typography variant="h6" color="primary.main" fontWeight={700}>
              ${product.price.toFixed(2)}
            </Typography>
            {product.discountPercentage > 0 && (
              <Chip
                label={`-${product.discountPercentage.toFixed(0)}%`}
                size="small"
                color="error"
                sx={{ fontSize: "0.65rem" }}
              />
            )}
          </Box>
          <Rating value={product.rating} precision={0.5} size="small" readOnly />
        </CardContent>
      </CardActionArea>
    </Card>
  );
});

export default function ProductsPage() {
  const {
    products, total, page, search, category, categories,
    loading, error,
    fetchProducts, fetchCategories, setPage, setSearch, setCategory,
  } = useProductsStore();

  useEffect(() => { fetchCategories(); }, [fetchCategories]);
  useEffect(() => { fetchProducts(); }, [page, search, category, fetchProducts]);

  const handleSearchChange = useCallback((e) => setSearch(e.target.value), [setSearch]);
  const handleCategoryChange = useCallback((e) => setCategory(e.target.value), [setCategory]);
  const handlePageChange = useCallback((_e, value) => setPage(value - 1), [setPage]);

  const totalPages = useMemo(() => Math.ceil(total / PRODUCTS_LIMIT), [total]);

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
        Products
      </Typography>

      {/* Filters */}
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <TextField
          placeholder="Search products..."
          value={search}
          onChange={handleSearchChange}
          size="small"
          sx={{ minWidth: 220 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            },
          }}
        />

        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Category</InputLabel>
          <Select value={category} onChange={handleCategoryChange} label="Category">
            <MenuItem value="">All categories</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat} sx={{ textTransform: "capitalize" }}>
                {cat.replace(/-/g, " ")}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", pt: 8 }}>
          <CircularProgress />
        </Box>
      ) : products.length === 0 ? (
        <Box sx={{ display: "flex", justifyContent: "center", pt: 8 }}>
          <Typography color="text.secondary">No products found</Typography>
        </Box>
      ) : (
        <>
          {/* MUI v9 Grid: size prop replaces item + xs/sm/md/lg */}
          <Grid container spacing={2}>
            {products.map((product) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={product.id}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>

          {totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page + 1}
                onChange={handlePageChange}
                color="primary"
                shape="rounded"
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
}
