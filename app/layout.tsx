import type React from "react"
import type { Metadata } from "next"
import { Inter, Poppins, Nunito } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
})
const nunito = Nunito({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-nunito",
})

export const metadata: Metadata = {
  title: "Penguin Film - Donghua Vietsub",
  description: "Trang web chuyên vietsub phim hoạt hình Trung Quốc (donghua) chất lượng cao",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body className={`${inter.className} ${poppins.variable} ${nunito.variable}`}>{children}</body>
    </html>
  )
}
