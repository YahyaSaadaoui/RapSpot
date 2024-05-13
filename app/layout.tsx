import "./globals.css"
import { Figtree } from "next/font/google"

import Sidebar from "../components/Sidebar"
import SupabaseProvider from "@/providers/SupabaseProvider"
import UserProvider from "@/providers/UserProvider"
import ModalProvider from "@/providers/ModalProvider"
import ToasterProvider from "@/providers/ToasterProvider"
import getSongsByUserId from "@/actions/getSongsByUserId"
import Player from "@/components/Player"
import getActiveProductsWithPrices from "@/actions/getActiveProductsWithPrices"

const figtree = Figtree({ subsets: ["latin"] })

export const metadata = {
  title: "RapSpot",
  description: "Welcome to RapSpot, your ultimate destination for all things rap. Discover, stream, and vibe to the hottest beats and latest tracks from your favorite artists. With curated playlists, personalized recommendations, and exclusive content, immerse yourself in the world of rap like never before. Join the community, express yourself, and let the rhythm guide you. It's more than music, it's a lifestyle. RapSpot - Where Rap Lives.",
}

export const revalidate = 0

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const userSongs = await getSongsByUserId()
  const products = await getActiveProductsWithPrices()

  return (
    <html lang="en">
      <body className={figtree.className}>
        <ToasterProvider />
        <SupabaseProvider>
          <UserProvider>
            {/* <ModalProvider products={products} /> */}
            <ModalProvider />
            <Sidebar songs={userSongs}>{children}</Sidebar> 
            <Player />
          </UserProvider>
        </SupabaseProvider>
      </body>
    </html>
  )
}
