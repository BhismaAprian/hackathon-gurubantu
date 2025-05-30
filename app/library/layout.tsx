import type React from "react"
import UserLayout from "@/components/layout/UserLayout"

export default function LibraryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <UserLayout>{children}</UserLayout>
}
