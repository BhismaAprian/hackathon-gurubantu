"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Heart, MessageSquare, Filter, FileText, X, Loader2 } from "lucide-react"
import AuthenticatedLayout from "@/components/authenticated-layout"
import { usePosts } from "@/hooks/use-posts"
import type { PostFilters } from "@/lib/types"

const availableSubjects = ["Matematika", "Bahasa Indonesia", "IPA", "IPS", "Bahasa Inggris", "Seni", "Olahraga"]
const availableTags = ["pembelajaran", "kurikulum", "teknologi", "metode", "evaluasi", "kreativitas"]

export default function ForumPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("all")
  const [selectedLevel, setSelectedLevel] = useState("all")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showTagFilter, setShowTagFilter] = useState(false)

 const filters: PostFilters = useMemo(() => ({
  search: searchQuery || undefined,
  subject: selectedSubject !== "all" ? selectedSubject : undefined,
  level: selectedLevel !== "all" ? selectedLevel : undefined,
  tags: selectedTags.length > 0 ? selectedTags : undefined,
}), [searchQuery, selectedSubject, selectedLevel, selectedTags])


  const { posts, loading, error, fetchPosts } = usePosts(filters)

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const removeTag = (tag: string) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag))
  }

  const clearAllFilters = () => {
    setSearchQuery("")
    setSelectedSubject("all")
    setSelectedLevel("all")
    setSelectedTags([])
  }

  // Filter posts client-side for subject and level (since these might be in tags or user profile)
  const filteredPosts = posts.filter((post) => {
    const matchesSubject =
      selectedSubject === "all" ||
      post.tags?.some((tag) => tag.name.toLowerCase().includes(selectedSubject.toLowerCase())) ||
      post.author?.subject?.toLowerCase().includes(selectedSubject.toLowerCase())

    const matchesLevel =
      selectedLevel === "all" || post.author?.education_level?.toLowerCase() === selectedLevel.toLowerCase()

    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.some((selectedTag) => post.tags?.some((tag) => tag.name === selectedTag))

    return matchesSubject && matchesLevel && matchesTags
  })

  if (error) {
    return (
      <AuthenticatedLayout>
        <div className="p-8">
          <Card className="border-0 shadow-lg bg-white">
            <CardContent className="p-12 text-center">
              <h3 className="text-lg font-semibold text-red-600 mb-2">Error Loading Forum</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={fetchPosts}>Try Again</Button>
            </CardContent>
          </Card>
        </div>
      </AuthenticatedLayout>
    )
  }

  return (
    <AuthenticatedLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Forum Diskusi</h1>
            <p className="text-gray-600">Berbagi pengalaman dan diskusi dengan sesama pendidik</p>
          </div>
          <Link href="/forum/create">
            <Button className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 mt-4 md:mt-0">
              <Plus className="w-4 h-4 mr-2" />
              Buat Thread Baru
            </Button>
          </Link>
        </div>

        {/* Enhanced Search and Filters */}
        <Card className="border-0 shadow-lg bg-white mb-6">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Cari thread, topik, atau kata kunci..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-gray-200 focus:border-blue-500"
                />
              </div>

              {/* Filter Row */}
              <div className="flex flex-wrap gap-3">
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger className="w-48 border-gray-200">
                    <SelectValue placeholder="Mata Pelajaran" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Mata Pelajaran</SelectItem>
                    {availableSubjects.map((subject) => (
                      <SelectItem key={subject} value={subject.toLowerCase()}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger className="w-32 border-gray-200">
                    <SelectValue placeholder="Jenjang" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua</SelectItem>
                    <SelectItem value="paud">PAUD</SelectItem>
                    <SelectItem value="sd">SD</SelectItem>
                    <SelectItem value="smp">SMP</SelectItem>
                    <SelectItem value="sma">SMA</SelectItem>
                    <SelectItem value="universitas">Universitas</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  onClick={() => setShowTagFilter(!showTagFilter)}
                  className={selectedTags.length > 0 ? "border-blue-500 text-blue-600" : ""}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Tags {selectedTags.length > 0 && `(${selectedTags.length})`}
                </Button>

                {(searchQuery || selectedSubject !== "all" || selectedLevel !== "all" || selectedTags.length > 0) && (
                  <Button variant="ghost" onClick={clearAllFilters} className="text-gray-500">
                    <X className="w-4 h-4 mr-2" />
                    Clear Filters
                  </Button>
                )}
              </div>

              {/* Selected Tags Display */}
              {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-gray-600 mr-2">Tags terpilih:</span>
                  {selectedTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-blue-100 text-blue-700 cursor-pointer"
                      onClick={() => removeTag(tag)}
                    >
                      {tag}
                      <X className="w-3 h-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              )}

              {/* Tag Filter Dropdown */}
              {showTagFilter && (
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <p className="text-sm font-medium text-gray-700 mb-3">Pilih Tags:</p>
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={selectedTags.includes(tag) ? "default" : "outline"}
                        className={`cursor-pointer transition-colors ${
                          selectedTags.includes(tag) ? "bg-blue-500 text-white" : "hover:bg-blue-50"
                        }`}
                        onClick={() => toggleTag(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        {(searchQuery || selectedSubject !== "all" || selectedLevel !== "all" || selectedTags.length > 0) && (
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Menampilkan {filteredPosts.length} dari {posts.length} thread
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <Card className="border-0 shadow-lg bg-white">
            <CardContent className="p-12 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
              <p className="text-gray-600">Memuat forum...</p>
            </CardContent>
          </Card>
        )}

        {/* Thread List */}
        {!loading && (
          <div className="space-y-4">
            {filteredPosts.map((thread) => (
              <Card key={thread.id} className="border-0 shadow-lg bg-white hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={thread.author?.avatar_url || "/placeholder.svg"} />
                      <AvatarFallback>
                        {thread.author?.full_name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("") || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Link href={`/forum/thread/${thread.id}`}>
                          <h3 className="font-semibold text-gray-800 hover:text-blue-600 transition-colors cursor-pointer">
                            {thread.title}
                          </h3>
                        </Link>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                          {thread.author?.role === "guru" ? "Guru" : "Relawan"}
                        </Badge>
                        {thread.attachment_url && (
                          <Badge variant="outline" className="text-xs">
                            <FileText className="w-3 h-3 mr-1" />
                            File
                          </Badge>
                        )}
                        {thread.is_pinned && (
                          <Badge variant="default" className="text-xs bg-yellow-500">
                            Pinned
                          </Badge>
                        )}
                        {thread.is_solved && (
                          <Badge variant="default" className="text-xs bg-green-500">
                            Solved
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-600 mb-3 line-clamp-2">{thread.content}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center space-x-1">
                            <Heart className="w-4 h-4" />
                            <span>{thread.like_count}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <MessageSquare className="w-4 h-4" />
                            <span>{thread.reply_count} komentar</span>
                          </span>
                          <span>oleh {thread.author?.full_name}</span>
                          <span>{new Date(thread.created_at).toLocaleDateString("id-ID")}</span>
                        </div>
                        <div className="flex space-x-1">
                          {thread.tags?.map((tag) => (
                            <Badge
                              key={tag.id}
                              variant="outline"
                              className={`text-xs cursor-pointer ${
                                selectedTags.includes(tag.name) ? "bg-blue-100 border-blue-300" : ""
                              }`}
                              onClick={() => toggleTag(tag.name)}
                            >
                              {tag.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredPosts.length === 0 && (
          <Card className="border-0 shadow-lg bg-white">
            <CardContent className="p-12 text-center">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                {posts.length === 0 ? "Belum ada thread" : "Tidak ada thread ditemukan"}
              </h3>
              <p className="text-gray-500 mb-4">
                {posts.length === 0
                  ? "Jadilah yang pertama membuat thread diskusi"
                  : "Coba ubah filter pencarian atau buat thread baru"}
              </p>
              <Link href="/forum/create">
                <Button className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800">
                  <Plus className="w-4 h-4 mr-2" />
                  Buat Thread Baru
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </AuthenticatedLayout>
  )
}
