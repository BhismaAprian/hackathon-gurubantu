import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Users, MessageSquare, BookOpen, Plus, Heart, Download } from "lucide-react"
import Link from "next/link"
import AuthenticatedLayout from "@/components/authenticated-layout"
import { mockThreads, mockResources, currentUser } from "@/lib/mock-data"

export default function DashboardPage() {
  const stats = [
    { title: "Thread Dibuat", value: "12", icon: MessageSquare, color: "from-blue-400 to-blue-600" },
    { title: "Resource Dibagikan", value: "8", icon: BookOpen, color: "from-green-400 to-green-600" },
    { title: "Likes Diterima", value: "156", icon: Heart, color: "from-pink-400 to-pink-600" },
    { title: "Download Resource", value: "89", icon: Download, color: "from-purple-400 to-purple-600" },
  ]

  return (
    <AuthenticatedLayout>
      <div className="p-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <Avatar className="w-16 h-16">
              <AvatarImage src={currentUser.avatar || "/placeholder.svg"} />
              <AvatarFallback className="text-lg">
                {currentUser.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Selamat datang, {currentUser.name}!</h1>
              <p className="text-gray-600">
                {currentUser.role === "guru" ? "Guru" : "Relawan"} {currentUser.subject} • {currentUser.level}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-lg bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                  </div>
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}
                  >
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl text-gray-800">Aktivitas Terbaru</CardTitle>
                    <CardDescription>Thread dan diskusi terbaru dari komunitas</CardDescription>
                  </div>
                  <Link href="/forum">
                    <Button variant="outline" size="sm">
                      Lihat Semua
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockThreads.slice(0, 3).map((thread) => (
                  <div
                    key={thread.id}
                    className="flex items-start space-x-3 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={thread.author.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {thread.author.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-gray-800 text-sm">{thread.title}</h4>
                        <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                          {thread.author.role === "guru" ? "Guru" : "Relawan"}
                        </Badge>
                      </div>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-2">{thread.content}</p>
                      <div className="flex items-center space-x-3 text-xs text-gray-500">
                        <span className="flex items-center space-x-1">
                          <Heart className="w-3 h-3" />
                          <span>{thread.votes}</span>
                        </span>
                        <span>{thread.comments.length} komentar</span>
                        <span>{new Date(thread.createdAt).toLocaleDateString("id-ID")}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Resources */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader>
                <CardTitle className="text-lg text-gray-800">Aksi Cepat</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/forum/create">
                  <Button className="w-full justify-start bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800">
                    <Plus className="w-4 h-4 mr-2" />
                    Buat Thread Baru
                  </Button>
                </Link>
                <Link href="/library/upload">
                  <Button variant="outline" className="w-full justify-start">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Upload Resource
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Recent Resources */}
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-gray-800">Resource Terbaru</CardTitle>
                  <Link href="/library">
                    <Button variant="ghost" size="sm">
                      Lihat Semua
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockResources.slice(0, 3).map((resource) => (
                  <div
                    key={resource.id}
                    className="p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        {resource.type.toUpperCase()}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {resource.subject}
                      </Badge>
                    </div>
                    <h4 className="font-medium text-sm text-gray-800 mb-1 line-clamp-2">{resource.title}</h4>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{resource.author.name}</span>
                      <span className="flex items-center space-x-1">
                        <Download className="w-3 h-3" />
                        <span>{resource.downloadCount}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
