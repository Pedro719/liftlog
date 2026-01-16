import './globals.css'

export const metadata = {
  title: 'LiftLog - Workout Tracker',
  description: 'Track your workouts with your partner',
  manifest: '/manifest.json',
  themeColor: '#fbbf24',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="bg-stone-900">{children}</body>
    </html>
  )
}
