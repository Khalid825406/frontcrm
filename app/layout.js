
import { Poppins, Roboto, Lora, Open_Sans, Sansation } from 'next/font/google'

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '700'] })
const roboto = Roboto({ subsets: ['latin'], weight: ['400', '700'] })



export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* PWA manifest & icon links */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="theme-color" content="#0275d8" />
      </head>
      <body className={`${poppins.className} ${roboto.className}`}>
        {children}
      </body>
    </html>
  )
}
