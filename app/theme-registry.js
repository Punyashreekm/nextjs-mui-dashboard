"use client";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#9c27b0" },
    background: { default: "#f5f5f5" },
  },
  shape: { borderRadius: 8 },
});

/**
 * AppRouterCacheProvider is the official MUI solution for the Next.js App Router.
 * It sets up the Emotion cache registry so styles are injected before streamed content,
 * preventing flash-of-unstyled-content (FOUC) on first paint.
 */
export default function ThemeRegistry({ children }) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
