import type { Metadata } from "next"
import type { ReactNode } from "react"
import { DM_Sans, DM_Serif_Display } from "next/font/google"

import { AppShell } from "@/components/layout/app-shell"
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
    <html lang="en" className="h-dvh bg-background">
      <body
        className={`${dmSans.variable} ${dmSerif.variable} flex h-dvh flex-col overflow-hidden font-sans antialiased`}
      >
        <AppShell>{children}</AppShell>
        <AppToaster />
      </body>
    </html>
  )
}
