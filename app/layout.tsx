import type { Metadata } from 'next'
import { Inter } from "next/font/google";
import './globals.css'
// Convex provider disabled until NEXT_PUBLIC_CONVEX_URL is set
import { ConvexClientProvider } from '@/components/providers/convex-provider'
import { PHProvider } from "@/components/providers/posthog-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'MASS Car Workshop - Vehicle Workshop Management System',
  description: 'Comprehensive workshop management solution for automotive businesses',
  generator: 'Next.js',
  keywords: ['car workshop', 'vehicle management', 'automotive', 'service center', 'work orders'],
  manifest: '/manifest.json',
  themeColor: '#f97316',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'MASS Workshop',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <PHProvider>
          <ConvexClientProvider>
            {children}
          </ConvexClientProvider>
        </PHProvider>
      </body>
    </html>
  )
}
// FORCE DEPLOY 1767448768
