
import { Poppins, Roboto, Lora, Open_Sans, Sansation } from 'next/font/google'

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '700'] })
const roboto = Roboto({ subsets: ['latin'], weight: ['400', '700'] })



export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Sultan Medical CRM</title>
        <meta name="description" content="Technician Job Assignment and Management System" />


        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#0275d8" />

        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />

      </head>


      <body className={`${poppins.className} ${roboto.className}`}>
        {children}
      </body>
    </html>
  )
}
