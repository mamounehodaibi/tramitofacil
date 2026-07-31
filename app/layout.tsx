import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TramitoFácil",
  description: "AI paperwork assistant for immigrants in Spain",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
