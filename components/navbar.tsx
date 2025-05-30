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
    <nav className="bg-white border-b border-blue-100 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">GB</span>
            </div>
            <span className="font-bold text-xl text-gray-800">GuruBantu</span>
          </Link>

          {/* Desktop Navigation - Only show for non-authenticated */}
          {!isAuthenticated && (
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
                Home
              </Link>
              <Link href="/#features" className="text-gray-600 hover:text-blue-600 transition-colors">
                Features
              </Link>
              <Link href="/#about" className="text-gray-600 hover:text-blue-600 transition-colors">
                About
              </Link>
            </div>
          )}

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
                              className={`w-2 h-2 rounded-full mt-2 ${notification.read ? "bg-gray-300" : "bg-blue-500"}`}
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
                        <span>View Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile/edit" className="flex items-center space-x-2">
                        <Settings className="w-4 h-4" />
                        <span>Edit Profile</span>
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
                  <Button className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800">
                    Register
                  </Button>
                </Link>
              </>
            )}

            {/* Mobile Menu Button - Only for non-authenticated */}
            {!isAuthenticated && (
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Menu - Only for non-authenticated */}
        {!isAuthenticated && isMobileMenuOpen && (
          <div className="md:hidden border-t border-blue-100 py-4">
            <div className="flex flex-col space-y-2">
              <Link href="/" className="px-4 py-2 text-gray-600 hover:text-blue-600">
                Home
              </Link>
              <Link href="/#features" className="px-4 py-2 text-gray-600 hover:text-blue-600">
                Features
              </Link>
              <Link href="/#about" className="px-4 py-2 text-gray-600 hover:text-blue-600">
                About
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
