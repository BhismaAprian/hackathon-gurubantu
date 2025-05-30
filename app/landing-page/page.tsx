"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User, BookOpen, MessageSquare, Home } from "lucide-react"
import Link from "next/link"

export default function Component() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">L</span>
              </div>
              <span className="font-bold text-xl">Guru Bantu</span>
            </div>

            {/* Navigation Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/"
                className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors"
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>
              <Link
                href="/forum"
                className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Forum</span>
              </Link>
              <Link
                href="/library"
                className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                <span>Library</span>
              </Link>

              {/* Account Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>Akun</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Link href="/login" className="w-full">
                      Login
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/register" className="w-full">
                      Register
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="sm" className="md:hidden">
              <span className="sr-only">Menu</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Selamat Datang di <span className="text-primary">Guru Bantu</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Platform pembelajaran terpadu dengan forum diskusi dan perpustakaan digital untuk mendukung perjalanan
            belajar Anda.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="px-8">
              Mulai Belajar
            </Button>
            <Button size="lg" variant="outline" className="px-8">
              Jelajahi Library
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Fitur Utama</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <MessageSquare className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Forum Diskusi</CardTitle>
                <CardDescription>
                  Berinteraksi dengan sesama pelajar dan berbagi pengetahuan melalui forum diskusi yang aktif.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <BookOpen className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Digital Library</CardTitle>
                <CardDescription>
                  Akses ribuan materi pembelajaran, e-book, dan sumber daya pendidikan berkualitas tinggi.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <User className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Profil Personal</CardTitle>
                <CardDescription>
                  Kelola progres belajar Anda dan pantau pencapaian melalui dashboard personal yang komprehensif.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">1000+</div>
              <div className="text-muted-foreground">Pengguna Aktif</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-muted-foreground">Materi Pembelajaran</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">50+</div>
              <div className="text-muted-foreground">Kategori Topik</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">24/7</div>
              <div className="text-muted-foreground">Akses Platform</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Siap Memulai Perjalanan Belajar?</h2>
          <p className="text-xl mb-8 opacity-90">
            Bergabunglah dengan ribuan pelajar lainnya dan mulai eksplorasi pengetahuan hari ini.
          </p>
          <Button size="lg" variant="secondary" className="px-8">
            Daftar Sekarang
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">L</span>
                </div>
                <span className="font-bold text-xl">Guru Bantu</span>
              </div>
              <p className="text-muted-foreground">
                Platform pembelajaran terpadu untuk mendukung perjalanan pendidikan Anda.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Navigasi</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/" className="hover:text-primary">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/forum" className="hover:text-primary">
                    Forum
                  </Link>
                </li>
                <li>
                  <Link href="/library" className="hover:text-primary">
                    Library
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Akun</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/login" className="hover:text-primary">
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="hover:text-primary">
                    Register
                  </Link>
                </li>
                <li>
                  <Link href="/profile" className="hover:text-primary">
                    Profil
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Bantuan</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/help" className="hover:text-primary">
                    Pusat Bantuan
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-primary">
                    Kontak
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-primary">
                    Tentang Kami
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Guru Bantu. Semua hak dilindungi.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
