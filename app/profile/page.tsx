import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Edit, Calendar, BookOpen, MessageSquare, Download, Heart } from "lucide-react"
import Link from "next/link"
import AuthenticatedLayout from "@/components/authenticated-layout"
import { currentUser, mockThreads, mockResources } from "@/lib/mock-data"

export default function ProfilePage() {
  const userThreads = mockThreads.filter((thread) => thread.author.id === currentUser.id)
  const userResources = mockResources.filter((resource) => resource.author.id === currentUser.id)

  const stats = [
    { label: "Thread Dibuat", value: userThreads.length, icon: MessageSquare },
    { label: "Resource Dibagikan", value: userResources.length, icon: BookOpen },
    { label: "Total Downloads", value: userResources.reduce((sum, r) => sum + r.downloadCount, 0), icon: Download },
    { label: "Total Likes", value: userThreads.reduce((sum, t) => sum + t.votes, 0), icon: Heart },
  ]

  return (
    <AuthenticatedLayout>
      <div className="p-8 max-w-4xl mx-auto">
        {/* Profile Header */}
        <Card className="border-0 shadow-lg bg-white mb-6">
          <CardContent className="p-8">
            <div className="flex items-start space-x-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={currentUser.avatar || "/placeholder.svg"} />
                <AvatarFallback className="text-2xl">
                  {currentUser.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">{currentUser.name}</h1>
                    <div className="flex items-center space-x-4 text-gray-600">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                        {currentUser.role === "guru" ? "Guru" : "Relawan"}
                      </Badge>
                      <span className="flex items-center space-x-1">
                        <BookOpen className="w-4 h-4" />
                        <span>{currentUser.subject}</span>
                      </span>
                      <span>{currentUser.level}</span>
                    </div>
                  </div>
                  <Link href="/profile/edit">
                    <Button variant="outline" className="flex items-center space-x-2">
                      <Edit className="w-4 h-4" />
                      <span>Edit Profile</span>
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center space-x-6 text-sm text-gray-500 mb-4">
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Bergabung {new Date(currentUser.joinedAt).toLocaleDateString("id-ID")}</span>
                  </span>
                  <span>Pengalaman: {currentUser.experience}</span>
                </div>
                <p className="text-gray-600">
                  Seorang {currentUser.role === "guru" ? "guru" : "relawan"} {currentUser.subject} yang berpengalaman{" "}
                  {currentUser.experience} dalam mengajar di tingkat {currentUser.level}. Aktif berbagi pengalaman dan
                  sumber daya pembelajaran dengan komunitas GuruBantu.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-lg bg-white">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Threads */}
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader>
              <CardTitle className="text-lg text-gray-800">Thread Terbaru</CardTitle>
              <CardDescription>Thread yang telah Anda buat</CardDescription>
            </CardHeader>
            <CardContent>
              {userThreads.length > 0 ? (
                <div className="space-y-4">
                  {userThreads.slice(0, 3).map((thread) => (
                    <div
                      key={thread.id}
                      className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Link href={`/forum/thread/${thread.id}`}>
                        <h4 className="font-medium text-gray-800 hover:text-blue-600 mb-2 line-clamp-2">
                          {thread.title}
                        </h4>
                      </Link>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center space-x-1">
                          <Heart className="w-3 h-3" />
                          <span>{thread.votes}</span>
                        </span>
                        <span>{thread.comments.length} komentar</span>
                        <span>{new Date(thread.createdAt).toLocaleDateString("id-ID")}</span>
                      </div>
                    </div>
                  ))}
                  {userThreads.length > 3 && (
                    <Link href="/history">
                      <Button variant="ghost" size="sm" className="w-full">
                        Lihat Semua Thread
                      </Button>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Belum ada thread yang dibuat</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Resources */}
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader>
              <CardTitle className="text-lg text-gray-800">Resource Terbaru</CardTitle>
              <CardDescription>Resource yang telah Anda bagikan</CardDescription>
            </CardHeader>
            <CardContent>
              {userResources.length > 0 ? (
                <div className="space-y-4">
                  {userResources.slice(0, 3).map((resource) => (
                    <div
                      key={resource.id}
                      className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Link href={`/library/resource/${resource.id}`}>
                        <h4 className="font-medium text-gray-800 hover:text-blue-600 mb-2 line-clamp-2">
                          {resource.title}
                        </h4>
                      </Link>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {resource.type.toUpperCase()}
                          </Badge>
                          <span>{resource.subject}</span>
                        </div>
                        <span className="flex items-center space-x-1">
                          <Download className="w-3 h-3" />
                          <span>{resource.downloadCount}</span>
                        </span>
                      </div>
                    </div>
                  ))}
                  {userResources.length > 3 && (
                    <Link href="/library">
                      <Button variant="ghost" size="sm" className="w-full">
                        Lihat Semua Resource
                      </Button>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Belum ada resource yang dibagikan</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
