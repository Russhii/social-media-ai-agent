import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Socially — Social media, made simpler",
  description: "Plan, create, and grow your social media presence in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}
