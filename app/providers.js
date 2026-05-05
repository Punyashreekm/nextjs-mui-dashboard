"use client";

import { SessionProvider } from "next-auth/react";
import ThemeRegistry from "./theme-registry";

/** Wraps the app with NextAuth SessionProvider and MUI ThemeRegistry */
export default function Providers({ children, session }) {
  return (
    <SessionProvider session={session}>
      <ThemeRegistry>{children}</ThemeRegistry>
    </SessionProvider>
  );
}
