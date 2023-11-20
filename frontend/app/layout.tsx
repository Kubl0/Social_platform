import type { Metadata } from 'next'
import './globals.css'
import React from "react";
import Navbar from "@/app/components/Navbar";


export const metadata: Metadata = {
  title: 'SocialHub',
  description: '',
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="pl">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  )
}
