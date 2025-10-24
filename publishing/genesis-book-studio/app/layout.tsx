import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Genesis Book Studio',
  description: 'Collaborative visual book editor with AI team support',
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
