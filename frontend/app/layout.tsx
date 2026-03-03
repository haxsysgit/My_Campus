import { BottomNav } from '@/components/BottomNav'
import { AuthProvider } from '@/lib/auth'
import './globals.css'

export const metadata = {
  title: 'MyCampus',
  description: 'Navigate. Connect. Stay Safe.',
  manifest: '/manifest.json',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#3B82F6',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="font-sans bg-bg-primary min-h-screen">
        <AuthProvider>
          <main className="max-w-md mx-auto pb-24">
            {children}
          </main>
          <BottomNav />
        </AuthProvider>
      </body>
    </html>
  )
}
