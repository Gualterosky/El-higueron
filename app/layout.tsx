import type { Metadata, Viewport } from "next"
import "./globals.css"

export const viewport: Viewport = {
  themeColor: "#2d5a3d",
  width: "device-width",
  initialScale: 1,
}

export const metadata: Metadata = {
  authors: [{ name: "Camping El Higuerón" }],
  keywords: [
    "camping",
    "escalada",
    "boulder",
    "colombia",
    "montaña",
    "naturaleza",
    "bendito sea",
    "el higuerón",
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}
