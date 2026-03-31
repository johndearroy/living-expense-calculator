import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'NeoNexor - Living Expense Calculator',
  description: 'Estimate monthly living costs for UK cities',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}