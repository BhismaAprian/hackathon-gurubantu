import type { Metadata } from 'next'
import {Plus_Jakarta_Sans, Geist} from 'next/font/google'
import './globals.css'


export const metadata: Metadata = {
  title: 'GuruBantu – Kolaborasi dan Solusi untuk Guru',
  description: 'GuruBantu adalah platform tempat para guru saling berbagi metode pengajaran, berdiskusi masalah di kelas, dan membangun komunitas pendidikan yang saling mendukung.',
  generator: 'GuruBantu Dev Team',
}

export const  pjs = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta-sans',
})

export const geist = Geist({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-geist',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
