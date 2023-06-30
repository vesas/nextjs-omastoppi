import type { Metadata } from 'next'

// These styles apply to every route in the application
import './globals.css'

export const metadata: Metadata = {
    title: 'Omastoppi',
    description: 'Get bus stop information for HSL bus stops in Finland',
  }
   
export default function RootLayout({
children,
}: {
children: React.ReactNode
}) {
return (
    <html lang="en">
    <body>{children}</body>
    </html>
)
}