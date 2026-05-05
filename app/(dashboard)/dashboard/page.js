"use client";

import { memo } from "react";
import Link from "next/link";
import useAuthStore from "@/lib/store/auth-store";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActionArea from "@mui/material/CardActionArea";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import PeopleIcon from "@mui/icons-material/People";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const StatCard = memo(function StatCard({ title, description, href, icon, color }) {
  return (
    <Card elevation={2} sx={{ borderRadius: 3, height: "100%" }}>
      <CardActionArea component={Link} href={href} sx={{ height: "100%", p: 1 }}>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
            <Avatar sx={{ bgcolor: color, width: 52, height: 52 }}>{icon}</Avatar>
            <ArrowForwardIcon color="action" />
          </Box>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
});

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Welcome back{user?.username ? `, ${user.username}` : ""}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's an overview of your admin panel.
        </Typography>
      </Box>

      {/* MUI v9 Grid: uses size prop instead of item/xs/sm/md */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            title="Users"
            description="Browse and manage all registered users from the DummyJSON API."
            href="/users"
            icon={<PeopleIcon />}
            color="primary.main"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            title="Products"
            description="Explore the product catalog with search, filter, and pagination."
            href="/products"
            icon={<ShoppingBagIcon />}
            color="secondary.main"
          />
        </Grid>
      </Grid>
    </Box>
  );
}
