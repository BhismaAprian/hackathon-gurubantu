"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Heart, MessageSquare, Filter, FileText } from "lucide-react"
import AuthenticatedLayout from "@/components/authenticated-layout"
import { mockThreads } from "@/lib/mock-data"

export default function ForumPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("all")
  const [selectedLevel, setSelectedLevel] = useState("all")

  const filteredThreads = mockThreads.filter((thread) => {
    const matchesSearch =
      thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      thread.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSubject =
      selectedSubject === "all" || thread.tags.some((tag) => tag.includes(selectedSubject.toLowerCase()))
    const matchesLevel = selectedLevel === "all" || thread.author.level.toLowerCase() === selectedLevel.toLowerCase()

    return matchesSearch && matchesSubject && matchesLevel
  })

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

        {/* Search and Filters */}
        <Card className="border-0 shadow-lg bg-white mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Cari thread, topik, atau kata kunci..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-gray-200 focus:border-blue-500"
                />
              </div>
              <div className="flex gap-2">
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger className="w-40 border-gray-200">
                    <SelectValue placeholder="Mata Pelajaran" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua</SelectItem>
                    <SelectItem value="matematika">Matematika</SelectItem>
                    <SelectItem value="bahasa">Bahasa</SelectItem>
                    <SelectItem value="ipa">IPA</SelectItem>
                    <SelectItem value="ips">IPS</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger className="w-32 border-gray-200">
                    <SelectValue placeholder="Jenjang" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua</SelectItem>
                    <SelectItem value="sd">SD</SelectItem>
                    <SelectItem value="smp">SMP</SelectItem>
                    <SelectItem value="sma">SMA</SelectItem>
                    <SelectItem value="universitas">Universitas</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Thread List */}
        <div className="space-y-4">
          {filteredThreads.map((thread) => (
            <Card key={thread.id} className="border-0 shadow-lg bg-white hover:shadow-xl transition-shadow">
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
                      <Link href={`/forum/thread/${thread.id}`}>
                        <h3 className="font-semibold text-gray-800 hover:text-blue-600 transition-colors cursor-pointer">
                          {thread.title}
                        </h3>
                      </Link>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                        {thread.author.role === "guru" ? "Guru" : "Relawan"}
                      </Badge>
                      {thread.hasFile && (
                        <Badge variant="outline" className="text-xs">
                          <FileText className="w-3 h-3 mr-1" />
                          File
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-600 mb-3 line-clamp-2">{thread.content}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center space-x-1">
                          <Heart className="w-4 h-4" />
                          <span>{thread.votes}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <MessageSquare className="w-4 h-4" />
                          <span>{thread.comments.length} komentar</span>
                        </span>
                        <span>oleh {thread.author.name}</span>
                        <span>{new Date(thread.createdAt).toLocaleDateString("id-ID")}</span>
                      </div>
                      <div className="flex space-x-1">
                        {thread.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
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

        {filteredThreads.length === 0 && (
          <Card className="border-0 shadow-lg bg-white">
            <CardContent className="p-12 text-center">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Tidak ada thread ditemukan</h3>
              <p className="text-gray-500 mb-4">Coba ubah filter pencarian atau buat thread baru</p>
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
