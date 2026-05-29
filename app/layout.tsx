import type { Metadata, Viewport } from 'next'

// These styles apply to every route in the application
import './globals.css'

export const metadata: Metadata = {
    metadataBase: new URL('https://omastoppi.fi'),
    applicationName: 'Omastoppi',
    title: {
        default: 'Omastoppi – lähimmät HSL-lähdöt',
        template: '%s – Omastoppi',
    },
    description: 'Lähimpien pysäkkien lähdöt HSL alueella',
    keywords: ['HSL', 'pysäkit', 'lähdöt', 'aikataulut', 'joukkoliikenne', 'Helsinki', 'bussi', 'ratikka', 'metro'],
    alternates: {
        canonical: '/',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
        },
    },
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
    appleWebApp: {
        capable: true,
        title: 'Omastoppi',
        statusBarStyle: 'default',
    },
  }

export const viewport: Viewport = {
    themeColor: '#f97316',
}

export default function RootLayout({
children,
}: {
  readonly children: React.ReactNode;
}) {
return (
    <html lang="fi">
    <body>
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'WebApplication',
                name: 'Omastoppi',
                url: 'https://omastoppi.fi',
                description: 'Lähimpien pysäkkien lähdöt HSL alueella',
                applicationCategory: 'TravelApplication',
                operatingSystem: 'All',
                inLanguage: 'fi',
                isAccessibleForFree: true,
                browserRequirements: 'Requires JavaScript and geolocation.',
                screenshot: 'https://omastoppi.fi/opengraph-image.png',
                featureList: [
                    'Lähimmät HSL-pysäkit sijainnin perusteella',
                    'Reaaliaikaiset lähtöajat',
                    'Kartta pysäkeistä ja ajoneuvoista',
                ],
                offers: {
                    '@type': 'Offer',
                    price: '0',
                    priceCurrency: 'EUR',
                },
            }) }}
        />
        {children}
    </body>
    </html>
)
}