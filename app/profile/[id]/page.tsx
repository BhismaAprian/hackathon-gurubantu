"use client"

import { useState, useEffect, use } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, BookOpen, MessageSquare, Download, Heart, Loader2, User, ArrowLeft, Mail } from "lucide-react"
import Link from "next/link"
import AuthenticatedLayout from "@/components/authenticated-layout"
import { useAuth } from "@/hooks/use-auth"
import { usePosts } from "@/hooks/use-posts"
import { useLibraryMaterials } from "@/hooks/use-library-materials"
import { supabase } from "@/lib/supabase"

interface UserProfilePageProps {
  params: Promise<{ id: string }>
}

export default function UserProfilePage({ params }: UserProfilePageProps) {
  const { id } = use(params)
  const { user: currentUser } = useAuth()
  const { posts } = usePosts()
  const { materials } = useLibraryMaterials()

  const [profileUser, setProfileUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userStats, setUserStats] = useState({
    threadsCount: 0,
    resourcesCount: 0,
    totalDownloads: 0,
    totalLikes: 0,
  })
  const [userThreads, setUserThreads] = useState<any[]>([])
  const [userResources, setUserResources] = useState<any[]>([])

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true)
        setError(null)

        console.log("Fetching user profile for ID:", id)

        const { data: userData, error: userError } = await supabase.from("users").select("*").eq("id", id).single()

        if (userError) {
          console.error("Error fetching user:", userError)
          if (userError.code === "PGRST116") {
            setError("User tidak ditemukan")
          } else {
            setError("Gagal memuat profil user")
          }
          return
        }

        console.log("User data:", userData)
        setProfileUser(userData)
      } catch (err: any) {
        console.error("Error:", err)
        setError("Terjadi kesalahan saat memuat profil")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchUserProfile()
    }
  }, [id])

  useEffect(() => {
    if (profileUser && posts && materials) {
      // Filter user's posts
      const userPosts = posts.filter((post) => post.author_id === profileUser.id)
      setUserThreads(userPosts)

      // Filter user's materials
      const userMaterials = materials.filter((material) => material.user_id === profileUser.id)
      setUserResources(userMaterials)

      // Calculate stats
      const totalDownloads = userMaterials.reduce((sum, material) => sum + (material.download_count || 0), 0)
      const totalLikes = userPosts.reduce((sum, post) => sum + (post.like_count || 0), 0)

      setUserStats({
        threadsCount: userPosts.length,
        resourcesCount: userMaterials.length,
        totalDownloads,
        totalLikes,
      })
    }
  }, [profileUser, posts, materials])

  const stats = [
    { label: "Thread Dibuat", value: userStats.threadsCount, icon: MessageSquare },
    { label: "Resource Dibagikan", value: userStats.resourcesCount, icon: BookOpen },
    { label: "Total Downloads", value: userStats.totalDownloads, icon: Download },
    { label: "Total Likes", value: userStats.totalLikes, icon: Heart },
  ]

  const isOwnProfile = currentUser?.id === profileUser?.id

  if (loading) {
    return (
      <AuthenticatedLayout>
        <div className="p-8 max-w-4xl mx-auto">
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Memuat profil...</span>
          </div>
        </div>
      </AuthenticatedLayout>
    )
  }

  if (error || !profileUser) {
    return (
      <AuthenticatedLayout>
        <div className="p-8 max-w-4xl mx-auto">
          <Link href="/forum" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Link>

          <Card className="border-0 shadow-lg bg-white">
            <CardContent className="p-8 text-center">
              <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Profil Tidak Ditemukan</h3>
              <p className="text-gray-600 mb-6">{error || "User yang Anda cari tidak ditemukan"}</p>
              <Link href="/forum">
                <Button>Kembali ke Forum</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </AuthenticatedLayout>
    )
  }

  return (
    <AuthenticatedLayout>
      <div className="p-8 max-w-4xl mx-auto">
        {/* Back Button */}
        <Link href="/forum" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali
        </Link>

        {/* Profile Header */}
        <Card className="border-0 shadow-lg bg-white mb-6">
          <CardContent className="p-8">
            <div className="flex items-start space-x-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={profileUser.avatar_url || "/placeholder.svg"} />
                <AvatarFallback className="text-2xl">
                  {profileUser.full_name
                    ?.split(" ")
                    .map((n: string) => n[0])
                    .join("") || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">{profileUser.full_name || "User"}</h1>
                    <div className="flex items-center space-x-4 text-gray-600">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                        {profileUser.role === "guru" ? "Guru" : "Relawan"}
                      </Badge>
                      {profileUser.subject && (
                        <span className="flex items-center space-x-1">
                          <BookOpen className="w-4 h-4" />
                          <span>{profileUser.subject}</span>
                        </span>
                      )}
                      {profileUser.education_level && <span>{profileUser.education_level}</span>}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {isOwnProfile ? (
                      <Link href="/profile/edit">
                        <Button variant="outline">Edit Profile</Button>
                      </Link>
                    ) : (
                      <Button variant="outline">
                        <Mail className="w-4 h-4 mr-2" />
                        Kontak
                      </Button>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-6 text-sm text-gray-500 mb-4">
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Bergabung {new Date(profileUser.created_at).toLocaleDateString("id-ID")}</span>
                  </span>
                  {profileUser.teaching_experience && <span>Pengalaman: {profileUser.teaching_experience}</span>}
                </div>
                <p className="text-gray-600">
                  {profileUser.bio ||
                    `Seorang ${profileUser.role === "guru" ? "guru" : "relawan"} ${profileUser.subject || ""} yang aktif berbagi pengalaman dan sumber daya pembelajaran dengan komunitas GuruBantu.`}
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
              <CardDescription>Thread yang dibuat oleh {profileUser.full_name}</CardDescription>
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
                          <span>{thread.like_count || 0}</span>
                        </span>
                        <span>{thread.comment_count || 0} komentar</span>
                        <span>{new Date(thread.created_at).toLocaleDateString("id-ID")}</span>
                      </div>
                    </div>
                  ))}
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
              <CardDescription>Resource yang dibagikan oleh {profileUser.full_name}</CardDescription>
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
                            {resource.file_type?.toUpperCase()}
                          </Badge>
                          <span>{resource.subject}</span>
                        </div>
                        <span className="flex items-center space-x-1">
                          <Download className="w-3 h-3" />
                          <span>{resource.download_count || 0}</span>
                        </span>
                      </div>
                    </div>
                  ))}
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
