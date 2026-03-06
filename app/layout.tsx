import type { Metadata } from 'next'
import { Inter } from "next/font/google";
import './globals.css'
import { ConvexClientProvider } from '@/components/providers/convex-provider'
import { PHProvider } from "@/components/providers/posthog-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'MASS OSS - National-Scale Automotive Operating System',
  description: 'Comprehensive workshop management solution for automotive businesses',
  generator: 'Next.js',
  keywords: ['car workshop', 'vehicle management', 'automotive', 'service center', 'work orders'],
  manifest: '/manifest.json',
  themeColor: '#f97316',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'MASS OSS',
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
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
        >
          <PHProvider>
            <ConvexClientProvider>
              {children}
            </ConvexClientProvider>
          </PHProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
// FORCE DEPLOY 1767448768
