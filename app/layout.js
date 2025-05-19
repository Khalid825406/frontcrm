// Example: app/layout.tsx (for Next.js 13+ App Router)
import { Poppins, Roboto, Lora, Open_Sans, Sansation } from 'next/font/google'

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '700'] })
const roboto = Roboto({ subsets: ['latin'], weight: ['400', '700'] })
// Do this for other fonts as needed

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.className} ${roboto.className}`}>
        {children}
      </body>
    </html>
  )
}
