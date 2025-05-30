"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LayoutDashboard, MessageSquare, BookOpen, History, ChevronLeft, ChevronRight } from "lucide-react"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Forum",
    href: "/forum",
    icon: MessageSquare,
  },
  {
    title: "Perpustakaan",
    href: "/library",
    icon: BookOpen,
  },
  {
    title: "Riwayat Diskusi",
    href: "/history",
    icon: History,
  },
]

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <div
      className={cn(
        "bg-white border-r border-blue-100 transition-all duration-300 flex flex-col",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      {/* Sidebar Header */}
      <div className="p-4 border-b border-blue-100">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">GB</span>
              </div>
              <span className="font-bold text-lg text-gray-800">GuruBantu</span>
            </div>
          )}
          <Button variant="ghost" size="sm" onClick={() => setIsCollapsed(!isCollapsed)} className="ml-auto">
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <li key={item.href}>
                <Link href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      isActive
                        ? "bg-blue-500 text-white hover:bg-blue-600"
                        : "text-gray-600 hover:text-blue-600 hover:bg-blue-50",
                      isCollapsed && "px-2",
                    )}
                  >
                    <item.icon className={cn("w-5 h-5", !isCollapsed && "mr-3")} />
                    {!isCollapsed && <span>{item.title}</span>}
                  </Button>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
