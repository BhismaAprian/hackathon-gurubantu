import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { MessageSquare, Share2, FileText, Download, ChevronUp, ChevronDown, Reply } from "lucide-react"
import AuthenticatedLayout from "@/components/authenticated-layout"
import { mockThreads, currentUser } from "@/lib/mock-data"

interface ThreadDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function ThreadDetailPage({ params }: ThreadDetailPageProps) {
  const { id } = await params
  const thread = mockThreads.find((t) => t.id === id)

  if (!thread) {
    notFound()
  }

  return (
    <AuthenticatedLayout>
      <div className="p-8 max-w-4xl mx-auto">
        {/* Thread Header */}
        <Card className="border-0 shadow-lg bg-white mb-6">
          <CardHeader>
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
                  <h1 className="text-2xl font-bold text-gray-800">{thread.title}</h1>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    {thread.author.role === "guru" ? "Guru" : "Relawan"}
                  </Badge>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                  <span>oleh {thread.author.name}</span>
                  <span>
                    {thread.author.subject} • {thread.author.level}
                  </span>
                  <span>{new Date(thread.createdAt).toLocaleDateString("id-ID")}</span>
                </div>
                <div className="flex space-x-2 mb-4">
                  {thread.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none mb-6">
              <p className="text-gray-700 leading-relaxed">{thread.content}</p>
            </div>

            {/* File Attachment */}
            {thread.hasFile && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{thread.fileName}</p>
                    <p className="text-sm text-gray-500">PDF • 2.5 MB</p>
                  </div>
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <ChevronUp className="w-4 h-4" />
                <span>{thread.votes}</span>
              </Button>
              <Button variant="outline" size="sm">
                <ChevronDown className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <MessageSquare className="w-4 h-4" />
                <span>{thread.comments.length} Komentar</span>
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <Card className="border-0 shadow-lg bg-white">
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-800">Komentar ({thread.comments.length})</h2>
          </CardHeader>
          <CardContent>
            {/* Add Comment */}
            <div className="mb-6">
              <div className="flex items-start space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={currentUser.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {currentUser.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    placeholder="Tulis komentar Anda..."
                    className="mb-3 border-gray-200 focus:border-blue-500"
                  />
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800"
                  >
                    Kirim Komentar
                  </Button>
                </div>
              </div>
            </div>

            <Separator className="mb-6" />

            {/* Comments List */}
            <div className="space-y-6">
              {thread.comments.map((comment) => (
                <div key={comment.id} className="space-y-4">
                  {/* Main Comment */}
                  <div className="flex items-start space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={comment.author.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {comment.author.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-medium text-gray-800">{comment.author.name}</span>
                          <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                            {comment.author.role === "guru" ? "Guru" : "Relawan"}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {new Date(comment.createdAt).toLocaleDateString("id-ID")}
                          </span>
                        </div>
                        <p className="text-gray-700">{comment.content}</p>
                      </div>
                      <div className="flex items-center space-x-4 mt-2">
                        <Button variant="ghost" size="sm" className="text-xs">
                          <ChevronUp className="w-3 h-3 mr-1" />
                          {comment.votes}
                        </Button>
                        <Button variant="ghost" size="sm" className="text-xs">
                          <ChevronDown className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-xs">
                          <Reply className="w-3 h-3 mr-1" />
                          Balas
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="ml-12 space-y-4">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex items-start space-x-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={reply.author.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="text-xs">
                              {reply.author.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="bg-gray-50 rounded-lg p-3">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-medium text-gray-800 text-sm">{reply.author.name}</span>
                                <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                                  {reply.author.role === "guru" ? "Guru" : "Relawan"}
                                </Badge>
                                <span className="text-xs text-gray-500">
                                  {new Date(reply.createdAt).toLocaleDateString("id-ID")}
                                </span>
                              </div>
                              <p className="text-gray-700 text-sm">{reply.content}</p>
                            </div>
                            <div className="flex items-center space-x-4 mt-2">
                              <Button variant="ghost" size="sm" className="text-xs">
                                <ChevronUp className="w-3 h-3 mr-1" />
                                {reply.votes}
                              </Button>
                              <Button variant="ghost" size="sm" className="text-xs">
                                <ChevronDown className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  )
}
