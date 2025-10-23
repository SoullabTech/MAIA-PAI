export const metadata = {
  title: 'Akashic Field Service',
  description: 'Distributed memory and resonance aggregator for MAIA-PAI',
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
