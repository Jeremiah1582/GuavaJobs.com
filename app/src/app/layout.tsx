import type { Metadata } from "next"
import type { ReactNode } from "react"
import { DM_Sans, DM_Serif_Display } from "next/font/google"

import { AppFooter } from "@/components/layout/app-footer"
import { AppHeader } from "@/components/layout/app-header"
import { AppToaster } from "@/components/ui/sonner"
import { appUrl } from "@/lib/env"

import "./globals.css"

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
})

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-dm-serif",
})

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "Guavajobs — Career Hub",
    template: "%s | Guavajobs",
  },
  description:
    "Track job applications, write cover letters, and grow your tech career.",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="bg-background">
      <body
        className={`${dmSans.variable} ${dmSerif.variable} flex min-h-screen flex-col font-sans antialiased`}
      >
        <AppHeader />
        <main className="flex-1 pt-24">{children}</main>
        <AppFooter />
        <AppToaster />
      </body>
    </html>
  )
}
