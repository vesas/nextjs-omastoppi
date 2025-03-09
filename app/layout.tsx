import type { Metadata } from 'next'

// These styles apply to every route in the application
import './globals.css'

export const metadata: Metadata = {
    title: 'Omastoppi',
    description: 'Lähimpien pysäkkien lähdöt HSL alueella',
  }

export default function RootLayout({
children,
}: {
  readonly children: React.ReactNode;
}) {
return (
    <html lang="fi">
    <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={metadata.description} />
        <link
        rel="apple-touch-icon"
        href="/apple-icon?<generated>"
        type="image/<generated>"
        sizes="<generated>"
    />
    <link
      rel="icon"
      href="/apple-icon.png?<generated>"
      type="image/<generated>"
      sizes="<generated>"
    />
    </head>

    <body>{children}</body>
    </html>
)
}