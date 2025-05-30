"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Bell, User, LogOut, Settings, Menu, X } from "lucide-react"
import { mockNotifications, currentUser } from "@/lib/mock-data"

interface NavbarProps {
  isAuthenticated?: boolean
}

export default function Navbar({ isAuthenticated = false }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const unreadCount = mockNotifications.filter((n) => !n.read).length

  return (
    <nav className="bg-white border-b border-orange-100 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-pink-400 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">GB</span>
            </div>
            <span className="font-bold text-xl text-gray-800">GuruBantu</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" className="text-gray-600 hover:text-orange-500 transition-colors">
                  Dashboard
                </Link>
                <Link href="/forum" className="text-gray-600 hover:text-orange-500 transition-colors">
                  Forum
                </Link>
                <Link href="/library" className="text-gray-600 hover:text-orange-500 transition-colors">
                  Library
                </Link>
              </>
            ) : (
              <>
                <Link href="/" className="text-gray-600 hover:text-orange-500 transition-colors">
                  Home
                </Link>
                <Link href="/#features" className="text-gray-600 hover:text-orange-500 transition-colors">
                  Features
                </Link>
                <Link href="/#about" className="text-gray-600 hover:text-orange-500 transition-colors">
                  About
                </Link>
              </>
            )}
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="relative">
                      <Bell className="w-5 h-5" />
                      {unreadCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-red-500">
                          {unreadCount}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <div className="p-2">
                      <h3 className="font-semibold mb-2">Notifications</h3>
                      {mockNotifications.slice(0, 3).map((notification) => (
                        <div key={notification.id} className="p-2 hover:bg-gray-50 rounded-md cursor-pointer">
                          <div className="flex items-start space-x-2">
                            <div
                              className={`w-2 h-2 rounded-full mt-2 ${notification.read ? "bg-gray-300" : "bg-orange-500"}`}
                            />
                            <div className="flex-1">
                              <p className="text-sm font-medium">{notification.title}</p>
                              <p className="text-xs text-gray-500">{notification.message}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                      <Link href="/notifications">
                        <Button variant="ghost" size="sm" className="w-full mt-2">
                          View All
                        </Button>
                      </Link>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2 p-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={currentUser.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {currentUser.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden md:block text-sm">{currentUser.name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center space-x-2">
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="flex items-center space-x-2">
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/" className="flex items-center space-x-2 text-red-600">
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500">
                    Register
                  </Button>
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-orange-100 py-4">
            <div className="flex flex-col space-y-2">
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard" className="px-4 py-2 text-gray-600 hover:text-orange-500">
                    Dashboard
                  </Link>
                  <Link href="/forum" className="px-4 py-2 text-gray-600 hover:text-orange-500">
                    Forum
                  </Link>
                  <Link href="/library" className="px-4 py-2 text-gray-600 hover:text-orange-500">
                    Library
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/" className="px-4 py-2 text-gray-600 hover:text-orange-500">
                    Home
                  </Link>
                  <Link href="/#features" className="px-4 py-2 text-gray-600 hover:text-orange-500">
                    Features
                  </Link>
                  <Link href="/#about" className="px-4 py-2 text-gray-600 hover:text-orange-500">
                    About
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
