"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import useUsersStore from "@/lib/store/users-store";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import BusinessIcon from "@mui/icons-material/Business";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CakeIcon from "@mui/icons-material/Cake";
import BadgeIcon from "@mui/icons-material/Badge";

function InfoRow({ icon, label, value }) {
  if (!value) return null;
  return (
    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, py: 0.75 }}>
      <Box sx={{ color: "text.secondary", mt: 0.3 }}>{icon}</Box>
      <Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
          {label}
        </Typography>
        <Typography variant="body2" fontWeight={500}>{value}</Typography>
      </Box>
    </Box>
  );
}

function Section({ title, children }) {
  return (
    <Paper elevation={1} sx={{ borderRadius: 2, p: 3, mb: 3 }}>
      <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }} color="primary.main">
        {title}
      </Typography>
      <Divider sx={{ mb: 2 }} />
      {children}
    </Paper>
  );
}

export default function UserDetailPage() {
  const { id } = useParams();
  const fetchUser = useUsersStore((s) => s.fetchUser);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetchUser(id).then((data) => {
      if (data) {
        setUser(data);
      } else {
        setError("User not found");
      }
      setLoading(false);
    });
  }, [id, fetchUser]);

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
        <Button component={Link} href="/users" startIcon={<ArrowBackIcon />} sx={{ mb: 2 }}>
          Back to Users
        </Button>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  const fullAddress = user?.address
    ? `${user.address.address}, ${user.address.city}, ${user.address.state} ${user.address.postalCode}`
    : null;

  return (
    <Box sx={{ maxWidth: 800 }}>
      <Button component={Link} href="/users" startIcon={<ArrowBackIcon />} sx={{ mb: 3 }}>
        Back to Users
      </Button>

      {/* Profile header */}
      <Paper elevation={2} sx={{ borderRadius: 3, p: 3, mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 3, flexWrap: "wrap" }}>
          <Avatar
            src={user.image}
            alt={user.firstName}
            sx={{ width: 80, height: 80, border: "3px solid", borderColor: "primary.main" }}
          />
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" fontWeight={700}>
              {user.firstName} {user.maidenName} {user.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              @{user.username}
            </Typography>
            <Box sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Chip label={user.gender} size="small" color={user.gender === "male" ? "info" : "secondary"} />
              <Chip label={user.bloodGroup} size="small" variant="outlined" />
              {user.role && <Chip label={user.role} size="small" color="warning" />}
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* MUI v9 Grid: size prop replaces item + xs/sm/md */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Section title="Contact Information">
            <InfoRow icon={<EmailIcon fontSize="small" />} label="Email" value={user.email} />
            <InfoRow icon={<PhoneIcon fontSize="small" />} label="Phone" value={user.phone} />
            <InfoRow icon={<LocationOnIcon fontSize="small" />} label="Address" value={fullAddress} />
          </Section>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Section title="Personal Details">
            <InfoRow icon={<CakeIcon fontSize="small" />} label="Date of Birth" value={user.birthDate} />
            <InfoRow icon={<BadgeIcon fontSize="small" />} label="Age" value={user.age ? `${user.age} years` : null} />
            <InfoRow icon={<BadgeIcon fontSize="small" />} label="Height" value={user.height ? `${user.height} cm` : null} />
            <InfoRow icon={<BadgeIcon fontSize="small" />} label="Weight" value={user.weight ? `${user.weight} kg` : null} />
          </Section>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Section title="Work">
            <InfoRow icon={<BusinessIcon fontSize="small" />} label="Company" value={user.company?.name} />
            <InfoRow icon={<BadgeIcon fontSize="small" />} label="Department" value={user.company?.department} />
            <InfoRow icon={<BadgeIcon fontSize="small" />} label="Job Title" value={user.company?.title} />
          </Section>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Section title="Education & Finance">
            <InfoRow icon={<BadgeIcon fontSize="small" />} label="University" value={user.university} />
            <InfoRow icon={<BadgeIcon fontSize="small" />} label="Bank" value={user.bank?.cardType} />
            <InfoRow icon={<BadgeIcon fontSize="small" />} label="Currency" value={user.bank?.currency} />
          </Section>
        </Grid>
      </Grid>
    </Box>
  );
}
