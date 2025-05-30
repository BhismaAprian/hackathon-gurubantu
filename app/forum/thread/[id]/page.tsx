"use client"

import type React from "react"
import { useState, useRef } from "react"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  MessageSquare,
  FileText,
  Download,
  ChevronUp,
  ChevronDown,
  Reply,
  Bot,
  X,
  ImageIcon,
  File,
  Paperclip,
  Sparkles,
  Clock,
  Loader2,
  Send,
  CheckCircle,
  Award,
  Heart,
  Eye,
  ArrowLeft,
  MoreVertical,
  Flag,
  Bookmark,
  Share,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import Link from "next/link"
import AuthenticatedLayout from "@/components/authenticated-layout"
import { usePost } from "@/hooks/use-posts"
import { useComments } from "@/hooks/use-comments"
import { useVotes } from "@/hooks/use-votes"
import { useAuth } from "@/hooks/use-auth"
import { uploadFile, getPublicUrl, STORAGE_BUCKETS, supabase } from "@/lib/supabase"
import { toast } from "@/hooks/use-toast"

interface ThreadDetailPageProps {
  params: { id: string }
}

export default function ThreadDetailPage({ params }: ThreadDetailPageProps) {
  const { id } = params
  const { user } = useAuth()
  const { post, loading: postLoading, error: postError, refetch } = usePost(id)
  const { createComment, markAsSolution, loading: commentLoading } = useComments(id)
  const { vote, loading: voteLoading } = useVotes()

  const [newComment, setNewComment] = useState("")
  const [commentFile, setCommentFile] = useState<File | null>(null)
  const [isAIGenerating, setIsAIGenerating] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  // Reply states
  const [submitting, setSubmitting] = useState(false)
  const isSubmittingRef = useRef(false)

  if (postLoading) {
    return (
      <AuthenticatedLayout>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
          <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">Memuat diskusi...</p>
              </div>
            </div>
          </div>
        </div>
      </AuthenticatedLayout>
    )
  }

  if (postError || !post) {
    notFound()
  }

  const handleVote = async (itemType: "post" | "comment", itemId: string, voteValue: number) => {
    if (!user) {
      toast({
        title: "Login Diperlukan",
        description: "Anda harus login untuk memberikan vote",
        variant: "destructive",
      })
      return
    }

    try {
      console.log("Voting:", { itemType, itemId, voteValue, userId: user.id })

      const validValue = voteValue === 1 ? 1 : -1

      await vote(user.id, itemId, itemType, validValue)


      await refetch()

      toast({
        title: "Berhasil!",
        description: `${voteValue === 1 ? "Upvote" : "Downvote"} berhasil diberikan`,
      })
    } catch (error) {
      console.error("Vote error:", error)
      toast({
        title: "Error",
        description: "Gagal memberikan vote",
        variant: "destructive",
      })
    }
  }

  const handleMarkAsSolution = async (commentId: string) => {
    if (!user) {
      toast({
        title: "Login Diperlukan",
        description: "Anda harus login untuk menandai solusi",
        variant: "destructive",
      })
      return
    }

    if (user.id !== post.author_id) {
      toast({
        title: "Tidak Diizinkan",
        description: "Hanya penulis post yang dapat menandai solusi",
        variant: "destructive",
      })
      return
    }

    try {
      await markAsSolution(commentId)
      await refetch()

      toast({
        title: "Berhasil!",
        description: "Komentar telah ditandai sebagai solusi",
      })
    } catch (error) {
      console.error("Mark as solution error:", error)
      toast({
        title: "Error",
        description: "Gagal menandai sebagai solusi",
        variant: "destructive",
      })
    }
  }

  const handleAddComment = async () => {
    if (!user) {
      toast({
        title: "Login Diperlukan",
        description: "Anda harus login untuk menambahkan komentar",
        variant: "destructive",
      })
      return
    }

    if (!newComment.trim()) {
      toast({
        title: "Error",
        description: "Komentar tidak boleh kosong",
        variant: "destructive",
      })
      return
    }

    setIsSubmittingComment(true)

    try {
      let attachmentUrl = ""
      let attachmentName = ""

      if (commentFile) {
        const filePath = `${user.id}/${Date.now()}-${commentFile.name}`
        await uploadFile(STORAGE_BUCKETS.FORUM_ATTACHMENTS, filePath, commentFile)
        attachmentUrl = getPublicUrl(STORAGE_BUCKETS.FORUM_ATTACHMENTS, filePath)
        attachmentName = commentFile.name
      }

      const commentData = {
        content: newComment.trim(),
        post_id: id,
        author_id: user.id,
        attachment_url: attachmentUrl || null,
        attachment_name: attachmentName || null,
        parent_comment_id: null,
        is_solution: false,
        is_ai_generated: false,
        like_count: 0,
      }

      const { data, error } = await supabase
        .from("comments")
        .insert([commentData])
        .select(`
          *,
          author:users(*)
        `)
        .single()

      if (error) throw error

      setNewComment("")
      setCommentFile(null)
      await refetch()

      toast({
        title: "Berhasil!",
        description: "Komentar berhasil ditambahkan",
      })
    } catch (error) {
      console.error("Comment submission error:", error)
      toast({
        title: "Error",
        description: "Gagal menambahkan komentar",
        variant: "destructive",
      })
    } finally {
      setIsSubmittingComment(false)
    }
  }

  const handleReply = async (parentCommentId: string) => {
    if (!user) {
      toast({
        title: "Login Diperlukan",
        description: "Anda harus login untuk membalas",
        variant: "destructive",
      })
      return
    }

    if (!replyContent.trim()) {
      toast({
        title: "Error",
        description: "Balasan tidak boleh kosong",
        variant: "destructive",
      })
      return
    }

    if (isSubmittingRef.current || submitting) {
      return
    }

    setSubmitting(true)
    isSubmittingRef.current = true

    try {
      const replyData = {
        content: replyContent.trim(),
        post_id: id,
        author_id: user.id,
        parent_comment_id: parentCommentId,
        is_solution: false,
        is_ai_generated: false,
        like_count: 0,
      }

      const { data, error } = await supabase
        .from("comments")
        .insert([replyData])
        .select(`
          *,
          author:users(*)
        `)
        .single()

      if (error) throw error

      setReplyContent("")
      setReplyingTo(null)
      await refetch()

      toast({
        title: "Berhasil!",
        description: "Balasan berhasil ditambahkan",
      })
    } catch (error) {
      console.error("Reply submission error:", error)
      toast({
        title: "Error",
        description: "Gagal menambahkan balasan",
        variant: "destructive",
      })
    } finally {
      setTimeout(() => {
        setSubmitting(false)
        isSubmittingRef.current = false
      }, 1000)
    }
  }

  const handleAIAssist = async () => {
    setIsAIGenerating(true)

    setTimeout(async () => {
      try {
        const aiResponse = `Berdasarkan pertanyaan "${post.title}", saya dapat membantu dengan beberapa poin:

1. Pastikan Anda memahami konsep dasar terlebih dahulu
2. Coba latihan soal yang serupa untuk memperkuat pemahaman
3. Jangan ragu untuk bertanya jika ada bagian yang masih belum jelas

Apakah ada aspek spesifik yang ingin Anda dalami lebih lanjut?`

        const aiCommentData = {
          content: aiResponse,
          post_id: id,
          author_id: user?.id || "ai-assistant",
          is_ai_generated: true,
          is_solution: false,
          like_count: 0,
          attachment_url: null,
          attachment_name: null,
          parent_comment_id: null,
        }

        const { data, error } = await supabase
          .from("comments")
          .insert([aiCommentData])
          .select(`
            *,
            author:users(*)
          `)
          .single()

        if (error) throw error

        await refetch()

        toast({
          title: "AI Assistant",
          description: "AI telah memberikan respons untuk thread ini",
        })
      } catch (error) {
        console.error("AI assist error:", error)
        toast({
          title: "Error",
          description: "Gagal mendapatkan respons AI",
          variant: "destructive",
        })
      } finally {
        setIsAIGenerating(false)
      }
    }, 2000)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "Ukuran file maksimal 5MB",
          variant: "destructive",
        })
        return
      }
      setCommentFile(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      setCommentFile(files[0])
    }
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return ImageIcon
    if (file.type.includes("pdf")) return FileText
    return File
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const userVote = post.user_vote?.value || 0
  const emojis = ["😊", "👍", "❤️", "🎉", "🤔", "💡", "👏", "🙏"]

  return (
    <AuthenticatedLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Navigation */}
          <div className="mb-8">
            <Link
              href="/forum"
              className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200 group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
              <span className="font-medium">Kembali ke Forum</span>
            </Link>
          </div>

          {/* Post Header */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm mb-8 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <Avatar className="w-16 h-16 ring-4 ring-white/20 shadow-lg">
                    <AvatarImage src={post.author?.avatar_url || "/placeholder.svg"} />
                    <AvatarFallback className="bg-white/20 text-white font-bold text-lg">
                      {post.author?.full_name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("") || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h1 className="text-2xl font-bold leading-tight">{post.title}</h1>
                      {post.is_solved && (
                        <Badge className="bg-green-500 text-white border-0 shadow-md">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Terjawab
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-blue-100 mb-3">
                      <span className="font-medium">{post.author?.full_name}</span>
                      <Badge variant="secondary" className="bg-white/20 text-white border-0">
                        {post.author?.role === "guru" ? "Guru" : "Relawan"}
                      </Badge>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{new Date(post.created_at).toLocaleDateString("id-ID")}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{post.view_count} views</span>
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {post.tags?.map((tag) => (
                        <Badge
                          key={tag.id}
                          variant="outline"
                          className="text-xs bg-white/10 border-white/30 text-white hover:bg-white/20"
                        >
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Bookmark className="w-4 h-4 mr-2" />
                      Simpan Post
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Share className="w-4 h-4 mr-2" />
                      Bagikan
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Flag className="w-4 h-4 mr-2" />
                      Laporkan
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="prose max-w-none mb-8">
                <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">{post.content}</p>
              </div>

              {/* File Attachment */}
              {post.attachment_url && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-8">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                      <FileText className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 text-lg">{post.attachment_name}</p>
                      <p className="text-gray-600">Lampiran thread</p>
                    </div>
                    <Button
                      size="lg"
                      className="bg-blue-500 hover:bg-blue-600 text-white shadow-lg"
                      onClick={() => window.open(post.attachment_url, "_blank")}
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              )}

              {/* Enhanced Action Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* Enhanced Voting */}
                  <div className="flex items-center bg-gray-50 rounded-full p-1 shadow-sm">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleVote("post", post.id, userVote === 1 ? 0 : 1)}
                      disabled={voteLoading}
                      className={`rounded-full transition-all duration-200 ${
                        userVote === 1
                          ? "bg-green-100 text-green-600 hover:bg-green-200 shadow-sm"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <ChevronUp className="w-5 h-5" />
                    </Button>
                    <span
                      className={`px-4 py-2 text-lg font-bold min-w-[3rem] text-center ${
                        post.like_count > 0 ? "text-green-600" : post.like_count < 0 ? "text-red-600" : "text-gray-600"
                      }`}
                    >
                      {post.like_count}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleVote("post", post.id, userVote === -1 ? 0 : -1)}
                      disabled={voteLoading}
                      className={`rounded-full transition-all duration-200 ${
                        userVote === -1 ? "bg-red-100 text-red-600 hover:bg-red-200 shadow-sm" : "hover:bg-gray-100"
                      }`}
                    >
                      <ChevronDown className="w-5 h-5" />
                    </Button>
                  </div>

                  <Button variant="outline" size="lg" className="flex items-center space-x-2 shadow-sm">
                    <MessageSquare className="w-5 h-5" />
                    <span className="font-medium">{post.reply_count} Komentar</span>
                  </Button>

                  <Button variant="outline" size="lg" className="flex items-center space-x-2 shadow-sm">
                    <Heart className="w-5 h-5" />
                    <span className="font-medium">Suka</span>
                  </Button>
                </div>

                <Button
                  onClick={handleAIAssist}
                  disabled={isAIGenerating}
                  size="lg"
                  className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white shadow-lg transition-all duration-200"
                >
                  {isAIGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>AI sedang berpikir...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>Tanya AI</span>
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Comments Section */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-3">
                <MessageSquare className="w-6 h-6 text-blue-600" />
                <span>Diskusi ({post.comments?.length || 0})</span>
              </h2>
            </CardHeader>
            <CardContent className="p-8">
              {/* Enhanced Add Comment */}
              <div className="mb-10">
                <div className="flex items-start space-x-4">
                  <Avatar className="w-12 h-12 shadow-md">
                    <AvatarImage src={user?.avatar_url || "/placeholder.svg"} />
                    <AvatarFallback className="bg-blue-500 text-white font-semibold">
                      {user?.full_name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("") || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-4">
                    <div className="relative">
                      <Textarea
                        placeholder="Bagikan pemikiran atau pengalaman Anda..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 min-h-[120px] resize-none text-lg"
                        disabled={isSubmittingComment}
                      />
                    </div>

                    {/* Enhanced File Upload */}
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold text-gray-700">Lampiran (opsional)</Label>
                      {commentFile ? (
                        <div className="flex items-center space-x-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                          <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center shadow-md">
                            {(() => {
                              const FileIcon = getFileIcon(commentFile)
                              return <FileIcon className="w-6 h-6 text-white" />
                            })()}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800">{commentFile.name}</p>
                            <p className="text-sm text-gray-600">{formatFileSize(commentFile.size)}</p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setCommentFile(null)}
                            className="text-gray-500 hover:text-red-500 hover:bg-red-50"
                            disabled={isSubmittingComment}
                          >
                            <X className="w-5 h-5" />
                          </Button>
                        </div>
                      ) : (
                        <div
                          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                            isDragOver
                              ? "border-blue-400 bg-blue-50"
                              : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
                          }`}
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                        >
                          <div className="flex flex-col items-center space-y-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                              <Paperclip className="w-8 h-8 text-gray-400" />
                            </div>
                            <div>
                              <p className="text-lg font-medium text-gray-700">
                                Seret file ke sini atau{" "}
                                <label
                                  htmlFor="comment-file-upload"
                                  className="text-blue-600 hover:text-blue-700 cursor-pointer underline"
                                >
                                  pilih file
                                </label>
                              </p>
                              <p className="text-sm text-gray-500 mt-2">PDF, Word, atau gambar (Max 5MB)</p>
                            </div>
                          </div>
                          <Input
                            type="file"
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            onChange={handleFileChange}
                            className="hidden"
                            id="comment-file-upload"
                            disabled={isSubmittingComment}
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>💡 Tip: Bagikan pengalaman konkret untuk diskusi yang lebih bermakna</span>
                      </div>
                      <Button
                        onClick={handleAddComment}
                        disabled={!newComment.trim() || isSubmittingComment}
                        size="lg"
                        className="bg-blue-500 hover:bg-blue-600 text-white shadow-lg transition-all duration-200 disabled:opacity-50"
                      >
                        {isSubmittingComment ? (
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        ) : (
                          <MessageSquare className="w-5 h-5 mr-2" />
                        )}
                        Kirim Komentar
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="mb-10" />

              {/* Enhanced Comments List */}
              <div className="space-y-8">
                {post.comments?.map((comment) => {
                  const commentUserVote = comment.user_vote?.value || 0

                  return (
                    <div key={comment.id} className="space-y-6">
                      <div className="flex items-start space-x-4">
                        <Avatar className="w-12 h-12 shadow-md">
                          <AvatarImage src={comment.author?.avatar_url || "/placeholder.svg"} />
                          <AvatarFallback className={comment.is_ai_generated ? "bg-purple-500" : "bg-blue-500"}>
                            {comment.is_ai_generated ? (
                              <Bot className="w-6 h-6 text-white" />
                            ) : (
                              comment.author?.full_name
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("") || "U"
                            )}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div
                            className={`rounded-xl p-6 transition-all duration-200 ${
                              comment.is_solution
                                ? "bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 shadow-lg"
                                : comment.is_ai_generated
                                  ? "bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 shadow-md"
                                  : "bg-gray-50 hover:bg-gray-100 border border-gray-200 shadow-sm"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center space-x-3">
                                <span className="font-bold text-gray-800 text-lg">
                                  {comment.is_ai_generated ? "AI Assistant" : comment.author?.full_name}
                                </span>
                                {comment.is_solution && (
                                  <Badge className="bg-green-500 text-white border-0 shadow-md">
                                    <Award className="w-4 h-4 mr-1" />
                                    Solusi Terbaik
                                  </Badge>
                                )}
                                {comment.is_ai_generated ? (
                                  <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                                    <Bot className="w-4 h-4 mr-1" />
                                    AI Assistant
                                  </Badge>
                                ) : (
                                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                                    {comment.author?.role === "guru" ? "Guru" : "Relawan"}
                                  </Badge>
                                )}
                                <span className="text-sm text-gray-500">
                                  {new Date(comment.created_at).toLocaleDateString("id-ID")}
                                </span>
                              </div>
                              {user?.id === post.author_id && !comment.is_solution && !comment.is_ai_generated && (
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="outline" size="sm" className="text-green-600 border-green-200">
                                      <CheckCircle className="w-4 h-4 mr-1" />
                                      Tandai Solusi
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Tandai sebagai Solusi?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Apakah Anda yakin ingin menandai komentar ini sebagai solusi terbaik untuk
                                        pertanyaan Anda?
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Batal</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleMarkAsSolution(comment.id)}>
                                        Ya, Tandai Solusi
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              )}
                            </div>
                            <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap mb-4">
                              {comment.content}
                            </p>

                            {/* Comment File Attachment */}
                            {comment.attachment_url && comment.attachment_name && (
                              <div className="mt-6 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                                <div className="flex items-center space-x-4">
                                  <div className="w-10 h-10 bg-blue-500 rounded flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-white" />
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-semibold text-gray-800">{comment.attachment_name}</p>
                                    <p className="text-sm text-gray-500">Lampiran komentar</p>
                                  </div>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => window.open(comment.attachment_url, "_blank")}
                                  >
                                    <Download className="w-4 h-4 mr-1" />
                                    Download
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Enhanced Comment Actions */}
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center bg-white border border-gray-200 rounded-full p-1 shadow-sm">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleVote("comment", comment.id, commentUserVote === 1 ? 0 : 1)}
                                  disabled={voteLoading}
                                  className={`rounded-full transition-all duration-200 ${
                                    commentUserVote === 1
                                      ? "bg-green-100 text-green-600 hover:bg-green-200"
                                      : "hover:bg-gray-100"
                                  }`}
                                >
                                  <ChevronUp className="w-4 h-4" />
                                </Button>
                                <span
                                  className={`px-3 text-sm font-bold min-w-[2rem] text-center ${
                                    comment.like_count > 0
                                      ? "text-green-600"
                                      : comment.like_count < 0
                                        ? "text-red-600"
                                        : "text-gray-600"
                                  }`}
                                >
                                  {comment.like_count}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleVote("comment", comment.id, commentUserVote === -1 ? 0 : -1)}
                                  disabled={voteLoading}
                                  className={`rounded-full transition-all duration-200 ${
                                    commentUserVote === -1
                                      ? "bg-red-100 text-red-600 hover:bg-red-200"
                                      : "hover:bg-gray-100"
                                  }`}
                                >
                                  <ChevronDown className="w-4 h-4" />
                                </Button>
                              </div>

                              {!comment.is_ai_generated && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                                  className="text-gray-500 hover:text-blue-600"
                                >
                                  <Reply className="w-4 h-4 mr-1" />
                                  Balas
                                </Button>
                              )}
                            </div>
                          </div>

                          {/* Reply Form */}
                          {replyingTo === comment.id && (
                            <div className="mt-6 ml-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                              <div className="flex items-start space-x-3">
                                <Avatar className="w-8 h-8">
                                  <AvatarImage src={user?.avatar_url || "/placeholder.svg"} />
                                  <AvatarFallback className="bg-blue-500 text-white text-sm">
                                    {user?.full_name
                                      ?.split(" ")
                                      .map((n) => n[0])
                                      .join("") || "U"}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <Textarea
                                    value={replyContent}
                                    onChange={(e) => setReplyContent(e.target.value)}
                                    className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none"
                                    rows={3}
                                    placeholder="Tulis balasan Anda..."
                                    disabled={submitting}
                                  />
                                  <div className="flex items-center justify-end space-x-2 mt-3">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        setReplyingTo(null)
                                        setReplyContent("")
                                      }}
                                      disabled={submitting}
                                    >
                                      Batal
                                    </Button>
                                    <Button
                                      size="sm"
                                      onClick={() => handleReply(comment.id)}
                                      disabled={submitting || !replyContent.trim()}
                                      className="bg-blue-500 hover:bg-blue-600"
                                    >
                                      {submitting ? (
                                        <>
                                          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                          Mengirim...
                                        </>
                                      ) : (
                                        <>
                                          <Send className="w-4 h-4 mr-1" />
                                          Kirim
                                        </>
                                      )}
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Nested Replies */}
                          {comment.replies && comment.replies.length > 0 && (
                            <div className="ml-8 mt-6 space-y-4">
                              {comment.replies.map((reply) => (
                                <div key={reply.id} className="flex items-start space-x-3">
                                  <Avatar className="w-8 h-8">
                                    <AvatarImage src={reply.author?.avatar_url || "/placeholder.svg"} />
                                    <AvatarFallback className="text-xs bg-blue-500 text-white">
                                      {reply.author?.full_name
                                        ?.split(" ")
                                        .map((n) => n[0])
                                        .join("") || "U"}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                                      <div className="flex items-center space-x-2 mb-2">
                                        <span className="font-semibold text-gray-800">{reply.author?.full_name}</span>
                                        <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                                          {reply.author?.role === "guru" ? "Guru" : "Relawan"}
                                        </Badge>
                                        <span className="text-xs text-gray-500">
                                          {new Date(reply.created_at).toLocaleDateString("id-ID")}
                                        </span>
                                      </div>
                                      <p className="text-gray-700 whitespace-pre-wrap">{reply.content}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {(!post.comments || post.comments.length === 0) && (
                <div className="text-center py-16">
                  <MessageSquare className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-gray-600 mb-3">Belum ada komentar</h3>
                  <p className="text-gray-500 text-lg">Jadilah yang pertama untuk memulai diskusi!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
