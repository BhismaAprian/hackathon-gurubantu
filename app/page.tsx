import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, BookOpen, MessageSquare, Heart, Download, ArrowRight, Lock } from "lucide-react"
import Navbar from "@/components/navbar"
import { mockThreads, mockResources } from "@/lib/mock-data"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      <Navbar />

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
              Platform Kolaborasi untuk Guru Indonesia
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Bergabunglah dengan komunitas guru dan relawan pendidik untuk berbagi pengetahuan, sumber daya, dan
              pengalaman mengajar di seluruh Indonesia.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button
                  size="lg"
                  className="px-8 py-4 bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 text-lg"
                >
                  Bergabung Sekarang
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 py-4 text-lg border-orange-300 text-orange-600 hover:bg-orange-50"
                >
                  Masuk ke Akun
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">Kenapa GuruBantu?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Platform yang dirancang khusus untuk mendukung pendidik Indonesia dengan fitur-fitur yang mudah digunakan
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-800">Komunitas Supportif</CardTitle>
                <CardDescription>
                  Terhubung dengan sesama guru dan relawan dari seluruh Indonesia untuk saling mendukung dan berbagi
                  pengalaman.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-800">Forum Diskusi Interaktif</CardTitle>
                <CardDescription>
                  Diskusikan strategi mengajar, berbagi tips, dan temukan solusi untuk tantangan pendidikan
                  bersama-sama.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-teal-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-800">Perpustakaan Digital</CardTitle>
                <CardDescription>
                  Akses dan bagikan materi pembelajaran, modul, dan sumber daya pendidikan berkualitas tinggi.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Forum Preview */}
      <section className="py-16 px-4 bg-white/50">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Forum Diskusi Terbaru</h2>
              <p className="text-gray-600">Lihat diskusi terbaru dari komunitas guru</p>
            </div>
            <Link href="/login">
              <Button variant="outline" className="flex items-center space-x-2">
                <span>Lihat Semua</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid gap-6">
            {mockThreads.slice(0, 3).map((thread) => (
              <Card key={thread.id} className="border-0 shadow-md hover:shadow-lg transition-shadow bg-white">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={thread.author.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {thread.author.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-800">{thread.title}</h3>
                        <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                          {thread.author.role === "guru" ? "Guru" : "Relawan"}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-3 line-clamp-2">{thread.content}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center space-x-1">
                            <Heart className="w-4 h-4" />
                            <span>{thread.votes}</span>
                          </span>
                          <span>{thread.comments.length} komentar</span>
                          <div className="flex space-x-1">
                            {thread.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Link href="/login">
                          <Button size="sm" variant="ghost" className="flex items-center space-x-1">
                            <Lock className="w-3 h-3" />
                            <span>Baca Selengkapnya</span>
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Library Preview */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Perpustakaan Digital</h2>
              <p className="text-gray-600">Sumber daya pembelajaran terbaru</p>
            </div>
            <Link href="/login">
              <Button variant="outline" className="flex items-center space-x-2">
                <span>Jelajahi Library</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {mockResources.slice(0, 3).map((resource) => (
              <Card key={resource.id} className="border-0 shadow-md hover:shadow-lg transition-shadow bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-400 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <Badge variant="outline">{resource.type.toUpperCase()}</Badge>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">{resource.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{resource.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>
                      {resource.subject} • {resource.level}
                    </span>
                    <span className="flex items-center space-x-1">
                      <Download className="w-3 h-3" />
                      <span>{resource.downloadCount}</span>
                    </span>
                  </div>
                  <Link href="/login">
                    <Button size="sm" variant="outline" className="w-full flex items-center space-x-1">
                      <Lock className="w-3 h-3" />
                      <span>Login untuk Download</span>
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-orange-400 to-pink-400">
        <div className="container mx-auto text-center">
          <div className="max-w-2xl mx-auto text-white">
            <h2 className="text-3xl font-bold mb-4">Siap Bergabung dengan Komunitas?</h2>
            <p className="text-xl mb-8 opacity-90">
              Mulai berbagi dan belajar bersama ribuan guru dan relawan pendidik di seluruh Indonesia.
            </p>
            <Link href="/register">
              <Button
                size="lg"
                variant="secondary"
                className="px-8 py-4 text-lg bg-white text-orange-600 hover:bg-gray-50"
              >
                Daftar Gratis Sekarang
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-pink-400 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">GB</span>
                </div>
                <span className="font-bold text-xl">GuruBantu</span>
              </div>
              <p className="text-gray-400">
                Platform kolaborasi untuk mendukung pendidik Indonesia dalam menciptakan pembelajaran yang berkualitas.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/forum" className="hover:text-white">
                    Forum
                  </Link>
                </li>
                <li>
                  <Link href="/library" className="hover:text-white">
                    Library
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-white">
                    Tentang Kami
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Dukungan</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/help" className="hover:text-white">
                    Bantuan
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Kontak
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-white">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/privacy" className="hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} GuruBantu. Semua hak dilindungi.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
