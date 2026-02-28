import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Product Discovery Hub - Discover the Best Products in North America',
  description: 'The largest product discovery platform for North America. Discover, launch, and promote innovative products across the United States, Canada, and Mexico.',
  keywords: 'product hunt, product discovery, startup, launch, innovation, tech products, north america',
  authors: [{ name: 'Product Discovery Hub' }],
  openGraph: {
    title: 'Product Discovery Hub',
    description: 'Discover the Best Products in North America',
    type: 'website',
    locale: 'en_US',
    siteName: 'Product Discovery Hub',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Product Discovery Hub',
    description: 'Discover the Best Products in North America',
  },
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
