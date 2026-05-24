import type { Metadata } from 'next'

// These styles apply to every route in the application
import './globals.css'

export const metadata: Metadata = {
    metadataBase: new URL('https://omastoppi.fi'),
    title: 'Omastoppi',
    description: 'Lähimpien pysäkkien lähdöt HSL alueella',
    openGraph: {
        title: 'Omastoppi',
        description: 'Lähimpien pysäkkien lähdöt HSL alueella',
        url: 'https://omastoppi.fi',
        siteName: 'Omastoppi',
        locale: 'fi_FI',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Omastoppi',
        description: 'Lähimpien pysäkkien lähdöt HSL alueella',
    },
  }

export default function RootLayout({
children,
}: {
  readonly children: React.ReactNode;
}) {
return (
    <html lang="fi">
    <body>{children}</body>
    </html>
)
}