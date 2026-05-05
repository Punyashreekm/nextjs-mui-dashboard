import Providers from "./providers";
import "./globals.css";

export const metadata = {
  title: "Admin Dashboard",
  description: "DummyJSON Admin Panel built with Next.js, MUI & Zustand",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
