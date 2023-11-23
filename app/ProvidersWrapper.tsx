"use client"

import Navigation from "@/components/Navigation"
import { SessionProvider } from "next-auth/react"
import { usePathname } from "next/navigation"

export default function ProvidersWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  return (
    <SessionProvider>
      {children}
      {pathname !== '/login' && <Navigation/>}
    </SessionProvider>
  )
}