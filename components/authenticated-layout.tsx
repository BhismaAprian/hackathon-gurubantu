import type React from "react"
import Navbar from "@/components/navbar"
import Sidebar from "@/components/sidebar"

interface AuthenticatedLayoutProps {
  children: React.ReactNode
}

export default function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  return (
    <div className="min-h-screen bg-blue-50">
      <Navbar isAuthenticated />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
