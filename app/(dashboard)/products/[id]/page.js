"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import useProductsStore from "@/lib/store/products-store";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Rating from "@mui/material/Rating";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import InventoryIcon from "@mui/icons-material/Inventory";
import StarIcon from "@mui/icons-material/Star";

function ImageCarousel({ images, title }) {
  const [idx, setIdx] = useState(0);

  const prev = useCallback(
    () => setIdx((i) => (i === 0 ? images.length - 1 : i - 1)),
    [images.length]
  );
  const next = useCallback(
    () => setIdx((i) => (i === images.length - 1 ? 0 : i + 1)),
    [images.length]
  );

  if (!images?.length) return null;

  return (
    <Box>
      <Box
        sx={{
          position: "relative",
          borderRadius: 2,
          overflow: "hidden",
          bgcolor: "grey.100",
          aspectRatio: "4/3",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          component="img"
          src={images[idx]}
          alt={`${title} ${idx + 1}`}
          sx={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
        {images.length > 1 && (
          <>
            <IconButton
              onClick={prev}
              size="small"
              sx={{
                position: "absolute", left: 8,
                bgcolor: "rgba(255,255,255,0.8)", "&:hover": { bgcolor: "white" },
              }}
            >
              <ArrowBackIosIcon fontSize="small" />
            </IconButton>
            <IconButton
              onClick={next}
              size="small"
              sx={{
                position: "absolute", right: 8,
                bgcolor: "rgba(255,255,255,0.8)", "&:hover": { bgcolor: "white" },
              }}
            >
              <ArrowForwardIosIcon fontSize="small" />
            </IconButton>
          </>
        )}
        {images.length > 1 && (
          <Box sx={{ position: "absolute", bottom: 8, display: "flex", gap: 0.5 }}>
            {images.map((_, i) => (
              <Box
                key={i}
                onClick={() => setIdx(i)}
                sx={{
                  width: 8, height: 8, borderRadius: "50%", cursor: "pointer",
                  bgcolor: i === idx ? "primary.main" : "rgba(255,255,255,0.7)",
                  border: "1px solid rgba(0,0,0,0.2)",
                }}
              />
            ))}
          </Box>
        )}
      </Box>

      {/* Thumbnails */}
      {images.length > 1 && (
        <Box sx={{ display: "flex", gap: 1, mt: 1.5, flexWrap: "wrap" }}>
          {images.map((img, i) => (
            <Box
              key={i}
              component="img"
              src={img}
              alt={`thumb ${i}`}
              onClick={() => setIdx(i)}
              sx={{
                width: 56, height: 56, objectFit: "cover", borderRadius: 1.5,
                cursor: "pointer",
                border: "2px solid",
                borderColor: i === idx ? "primary.main" : "transparent",
                opacity: i === idx ? 1 : 0.6,
                "&:hover": { opacity: 1 },
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const fetchProduct = useProductsStore((s) => s.fetchProduct);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetchProduct(id).then((data) => {
      if (data) {
        setProduct(data);
      } else {
        setError("Product not found");
      }
      setLoading(false);
    });
  }, [id, fetchProduct]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", pt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Button component={Link} href="/products" startIcon={<ArrowBackIcon />} sx={{ mb: 2 }}>
          Back to Products
        </Button>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  const discountedPrice = product.price * (1 - product.discountPercentage / 100);

  return (
    <Box sx={{ maxWidth: 1000 }}>
      <Button component={Link} href="/products" startIcon={<ArrowBackIcon />} sx={{ mb: 3 }}>
        Back to Products
      </Button>

      {/* MUI v9 Grid: size prop instead of item/xs/md */}
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 5 }}>
          <ImageCarousel images={product.images} title={product.title} />
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Box sx={{ mb: 1, display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Chip label={product.category} size="small" sx={{ textTransform: "capitalize" }} />
            <Chip label={product.brand} size="small" variant="outlined" />
            {product.tags?.map((tag) => (
              <Chip key={tag} label={tag} size="small" variant="outlined" color="secondary" />
            ))}
          </Box>

          <Typography variant="h4" fontWeight={700} gutterBottom>
            {product.title}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <Rating value={product.rating} precision={0.1} size="small" readOnly />
            <Typography variant="body2" color="text.secondary">
              ({product.rating?.toFixed(1)}) · {product.reviews?.length ?? 0} reviews
            </Typography>
          </Box>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {product.description}
          </Typography>

          {/* Pricing */}
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "baseline", gap: 2 }}>
              <Typography variant="h4" color="primary.main" fontWeight={700}>
                ${discountedPrice.toFixed(2)}
              </Typography>
              {product.discountPercentage > 0 && (
                <>
                  <Typography variant="body1" color="text.disabled" sx={{ textDecoration: "line-through" }}>
                    ${product.price.toFixed(2)}
                  </Typography>
                  <Chip label={`-${product.discountPercentage.toFixed(0)}%`} color="error" size="small" />
                </>
              )}
            </Box>
            <Box sx={{ display: "flex", gap: 2, mt: 1.5, flexWrap: "wrap" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <InventoryIcon fontSize="small" color="action" />
                <Typography variant="body2">
                  {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                </Typography>
              </Box>
              {product.shippingInformation && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <LocalShippingIcon fontSize="small" color="action" />
                  <Typography variant="body2">{product.shippingInformation}</Typography>
                </Box>
              )}
            </Box>
          </Paper>

          {/* Specs */}
          <Paper elevation={0} sx={{ p: 2, borderRadius: 2, bgcolor: "grey.50", mb: 3 }}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>
              Specifications
            </Typography>
            <Divider sx={{ mb: 1.5 }} />
            {[
              ["SKU", product.sku],
              ["Weight", product.weight ? `${product.weight} kg` : null],
              ["Dimensions", product.dimensions
                ? `${product.dimensions.width} × ${product.dimensions.height} × ${product.dimensions.depth} cm`
                : null],
              ["Warranty", product.warrantyInformation],
              ["Return policy", product.returnPolicy],
              ["Availability", product.availabilityStatus],
              ["Minimum order", product.minimumOrderQuantity
                ? `${product.minimumOrderQuantity} units`
                : null],
            ]
              .filter(([, v]) => v)
              .map(([label, value]) => (
                <Box key={label} sx={{ display: "flex", gap: 2, py: 0.5 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ minWidth: 120 }}>
                    {label}
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>{value}</Typography>
                </Box>
              ))}
          </Paper>
        </Grid>
      </Grid>

      {/* Reviews */}
      {product.reviews?.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
            <StarIcon color="warning" /> Reviews
          </Typography>
          <Grid container spacing={2}>
            {product.reviews.map((review, i) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.light" }}>
                      {review.reviewerName?.[0]}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight={600}>{review.reviewerName}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(review.date).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                  <Rating value={review.rating} size="small" readOnly sx={{ mb: 0.5 }} />
                  <Typography variant="body2" color="text.secondary">{review.comment}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
}
