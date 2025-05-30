"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, Clock, Filter } from "lucide-react"
import Link from "next/link"
import AuthenticatedLayout from "@/components/authenticated-layout"
import { mockUserHistory } from "@/lib/mock-data"

export default function HistoryPage() {
  const [threadFilter, setThreadFilter] = useState("all")
  const [commentFilter, setCommentFilter] = useState("all")

  const filteredThreads = mockUserHistory.threads.filter((thread) => {
    if (threadFilter === "all") return true
    if (threadFilter === "active") return thread.status === "active"
    if (threadFilter === "closed") return thread.status === "closed"
    return true
  })

  const filteredComments = mockUserHistory.comments.filter((comment) => {
    if (commentFilter === "all") return true
    // Add more filtering logic as needed
    return true
  })

  return (
    <AuthenticatedLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Riwayat Diskusi</h1>
          <p className="text-gray-600">Lihat semua thread dan komentar yang pernah Anda buat</p>
        </div>

        <Tabs defaultValue="threads" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="threads">Thread Saya</TabsTrigger>
            <TabsTrigger value="comments">Komentar Saya</TabsTrigger>
          </TabsList>

          <TabsContent value="threads" className="space-y-4">
            {/* Thread Filters */}
            <Card className="border-0 shadow-lg bg-white">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <Select value={threadFilter} onValueChange={setThreadFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Status</SelectItem>
                      <SelectItem value="active">Aktif</SelectItem>
                      <SelectItem value="closed">Ditutup</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter subjek" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Subjek</SelectItem>
                      <SelectItem value="matematika">Matematika</SelectItem>
                      <SelectItem value="bahasa">Bahasa</SelectItem>
                      <SelectItem value="ipa">IPA</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Thread List */}
            <div className="space-y-4">
              {filteredThreads.map((thread) => (
                <Card key={thread.id} className="border-0 shadow-lg bg-white hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Link href={`/forum/thread/${thread.id}`}>
                            <h3 className="font-semibold text-gray-800 hover:text-blue-600 transition-colors cursor-pointer">
                              {thread.title}
                            </h3>
                          </Link>
                          <Badge
                            variant={thread.status === "active" ? "default" : "secondary"}
                            className={thread.status === "active" ? "bg-green-500" : ""}
                          >
                            {thread.status === "active" ? "Aktif" : "Ditutup"}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center space-x-1">
                            <MessageSquare className="w-4 h-4" />
                            <span>{thread.replies} balasan</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>Terakhir aktif {new Date(thread.lastActivity).toLocaleDateString("id-ID")}</span>
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {thread.subject}
                          </Badge>
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
                  <p className="text-gray-500 mb-4">Coba ubah filter atau buat thread baru</p>
                  <Link href="/forum/create">
                    <Button className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800">
                      Buat Thread Baru
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="comments" className="space-y-4">
            {/* Comment Filters */}
            <Card className="border-0 shadow-lg bg-white">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <Select value={commentFilter} onValueChange={setCommentFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter waktu" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Waktu</SelectItem>
                      <SelectItem value="week">Minggu Ini</SelectItem>
                      <SelectItem value="month">Bulan Ini</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Comments List */}
            <div className="space-y-4">
              {filteredComments.map((comment, index) => (
                <Card key={index} className="border-0 shadow-lg bg-white hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="mb-3">
                      <Link href={`/forum/thread/${comment.threadId}`}>
                        <h4 className="font-medium text-blue-600 hover:text-blue-700 transition-colors cursor-pointer">
                          {comment.threadTitle}
                        </h4>
                      </Link>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 mb-3">
                      <p className="text-gray-700">{comment.comment}</p>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{new Date(comment.createdAt).toLocaleDateString("id-ID")}</span>
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredComments.length === 0 && (
              <Card className="border-0 shadow-lg bg-white">
                <CardContent className="p-12 text-center">
                  <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Tidak ada komentar ditemukan</h3>
                  <p className="text-gray-500 mb-4">Mulai berpartisipasi dalam diskusi komunitas</p>
                  <Link href="/forum">
                    <Button className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800">
                      Lihat Forum
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AuthenticatedLayout>
  )
}
