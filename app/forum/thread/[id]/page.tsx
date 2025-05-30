"use client"

import type React from "react"
import { useState } from "react"
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
  Share2,
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
} from "lucide-react"
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
  const { createComment, loading: commentLoading } = useComments(id)
  const { vote, loading: voteLoading } = useVotes()

  const [newComment, setNewComment] = useState("")
  const [commentFile, setCommentFile] = useState<File | null>(null)
  const [isAIGenerating, setIsAIGenerating] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)

  if (postLoading) {
    return (
      <AuthenticatedLayout>
        <div className="p-8 max-w-4xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <span className="ml-2 text-gray-600">Memuat thread...</span>
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
        title: "Error",
        description: "Anda harus login untuk memberikan vote",
        variant: "destructive",
      })
      return
    }

    try {
      console.log("Voting:", { itemType, itemId, voteValue, userId: user.id })

      await vote({
        user_id: user.id,
        [itemType === "post" ? "post_id" : "comment_id"]: itemId,
        value: voteValue,
      })

      await refetch() // Refresh post data

      toast({
        title: "Berhasil!",
        description: "Vote berhasil diberikan",
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

  const handleAddComment = async () => {
    console.log("=== COMMENT SUBMISSION STARTED ===")
    console.log("User:", user)
    console.log("Comment content:", newComment)
    console.log("Comment file:", commentFile)

    if (!user) {
      console.error("No user found")
      toast({
        title: "Error",
        description: "Anda harus login untuk menambahkan komentar",
        variant: "destructive",
      })
      return
    }

    if (!newComment.trim()) {
      console.error("Comment content is empty")
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

      // Upload file if exists
      if (commentFile) {
        console.log("Uploading comment file:", commentFile.name)
        try {
          const filePath = `${user.id}/${Date.now()}-${commentFile.name}`
          const uploadResult = await uploadFile(STORAGE_BUCKETS.FORUM_ATTACHMENTS, filePath, commentFile)
          console.log("Comment file upload result:", uploadResult)

          attachmentUrl = getPublicUrl(STORAGE_BUCKETS.FORUM_ATTACHMENTS, filePath)
          attachmentName = commentFile.name
          console.log("Comment file uploaded successfully:", { attachmentUrl, attachmentName })
        } catch (uploadError) {
          console.error("Comment file upload error:", uploadError)
          toast({
            title: "Error",
            description: "Gagal mengupload file",
            variant: "destructive",
          })
          setIsSubmittingComment(false)
          return
        }
      }

      // Prepare comment data according to database schema
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

      console.log("Comment data to be inserted:", commentData)

      // Try direct Supabase insert first for debugging
      console.log("Attempting direct Supabase comment insert...")
      const { data: directInsertData, error: directInsertError } = await supabase
        .from("comments")
        .insert([commentData])
        .select(`
          *,
          author:users(*)
        `)
        .single()

      if (directInsertError) {
        console.error("Direct Supabase comment insert error:", directInsertError)
        throw directInsertError
      }

      console.log("Direct comment insert successful:", directInsertData)

      // Try hook method as well
      try {
        console.log("Attempting hook-based comment insert...")
        const hookResult = await createComment(commentData)
        console.log("Hook comment insert successful:", hookResult)
      } catch (hookError) {
        console.error("Hook comment insert error:", hookError)
        // Continue with direct insert result if hook fails
      }

      // Update post reply count
      try {
        const { error: updateError } = await supabase
          .from("posts")
          .update({ reply_count: supabase.sql`reply_count + 1` })
          .eq("id", id)

        if (updateError) {
          console.error("Error updating post reply count:", updateError)
        }
      } catch (updateError) {
        console.error("Error updating post reply count:", updateError)
      }

      setNewComment("")
      setCommentFile(null)
      await refetch() // Refresh post data

      toast({
        title: "Berhasil!",
        description: "Komentar berhasil ditambahkan",
      })
    } catch (error) {
      console.error("=== COMMENT SUBMISSION ERROR ===")
      console.error("Error details:", error)
      console.error("Error message:", error instanceof Error ? error.message : "Unknown error")

      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Gagal menambahkan komentar",
        variant: "destructive",
      })
    } finally {
      setIsSubmittingComment(false)
      console.log("=== COMMENT SUBMISSION ENDED ===")
    }
  }

  const handleAIAssist = async () => {
    setIsAIGenerating(true)

    // Simulate AI processing - in real implementation, this would call an AI service
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

        console.log("Creating AI comment:", aiCommentData)

        const { data: aiComment, error: aiError } = await supabase
          .from("comments")
          .insert([aiCommentData])
          .select(`
            *,
            author:users(*)
          `)
          .single()

        if (aiError) {
          console.error("AI comment error:", aiError)
          throw aiError
        }

        console.log("AI comment created:", aiComment)

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
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "Ukuran file maksimal 5MB",
          variant: "destructive",
        })
        return
      }
      console.log("Comment file selected:", file.name, file.size)
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

  // Debug logging
  console.log("Current post:", post)
  console.log("Current user:", user)
  console.log("Comment loading state:", commentLoading)
  console.log("Is submitting comment:", isSubmittingComment)

  return (
    <AuthenticatedLayout>
      <div className="p-8 max-w-4xl mx-auto">
        {/* Thread Header */}
        <Card className="border-0 shadow-lg bg-white mb-6 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
            <div className="flex items-start space-x-4">
              <Avatar className="w-14 h-14 ring-2 ring-white shadow-md">
                <AvatarImage src={post.author?.avatar_url || "/placeholder.svg"} />
                <AvatarFallback className="bg-blue-500 text-white font-semibold">
                  {post.author?.full_name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("") || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <h1 className="text-2xl font-bold text-gray-800 leading-tight">{post.title}</h1>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 font-medium">
                    {post.author?.role === "guru" ? "Guru" : "Relawan"}
                  </Badge>
                  {post.is_solved && (
                    <Badge variant="secondary" className="bg-green-100 text-green-700 font-medium">
                      Terjawab
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                  <span className="font-medium">{post.author?.full_name}</span>
                  <span className="flex items-center space-x-1">
                    <span>{post.author?.subject}</span>
                    <span>•</span>
                    <span>{post.author?.education_level}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(post.created_at).toLocaleDateString("id-ID")}</span>
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {post.tags?.map((tag) => (
                    <Badge key={tag.id} variant="outline" className="text-xs bg-white border-blue-200 text-blue-600">
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="prose max-w-none mb-6">
              <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">{post.content}</p>
            </div>

            {/* File Attachment */}
            {post.attachment_url && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-md">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{post.attachment_name}</p>
                    <p className="text-sm text-gray-600">Lampiran thread</p>
                  </div>
                  <Button
                    size="sm"
                    className="bg-blue-500 hover:bg-blue-600 text-white shadow-md"
                    onClick={() => window.open(post.attachment_url, "_blank")}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {/* Upvote/Downvote for Thread */}
                <div className="flex items-center bg-gray-50 rounded-full p-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleVote("post", post.id, userVote === 1 ? 0 : 1)}
                    disabled={voteLoading}
                    className={`rounded-full transition-all duration-200 ${
                      userVote === 1 ? "bg-green-100 text-green-600 hover:bg-green-200" : "hover:bg-gray-100"
                    }`}
                  >
                    <ChevronUp className="w-4 h-4" />
                  </Button>
                  <span
                    className={`px-3 py-1 text-sm font-semibold min-w-[2rem] text-center ${
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
                      userVote === -1 ? "bg-red-100 text-red-600 hover:bg-red-200" : "hover:bg-gray-100"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </div>

                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4" />
                  <span>{post.reply_count} Komentar</span>
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>

              <Button
                onClick={handleAIAssist}
                disabled={isAIGenerating}
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white shadow-md transition-all duration-200"
              >
                {isAIGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>AI sedang berpikir...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Tanya AI</span>
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <Card className="border-0 shadow-lg bg-white">
          <CardHeader className="bg-gray-50 border-b">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
              <MessageSquare className="w-5 h-5" />
              <span>Diskusi ({post.comments?.length || 0})</span>
            </h2>
          </CardHeader>
          <CardContent className="p-6">
            {/* Add Comment */}
            <div className="mb-8">
              <div className="flex items-start space-x-4">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={user?.avatar_url || "/placeholder.svg"} />
                  <AvatarFallback className="bg-blue-500 text-white">
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
                      className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 min-h-[100px] resize-none"
                      disabled={isSubmittingComment}
                    />
                  </div>

                  {/* File Upload */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-700">Lampiran (opsional)</Label>
                    {commentFile ? (
                      <div className="flex items-center space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                          {(() => {
                            const FileIcon = getFileIcon(commentFile)
                            return <FileIcon className="w-5 h-5 text-white" />
                          })()}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{commentFile.name}</p>
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
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <div
                        className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 ${
                          isDragOver
                            ? "border-blue-400 bg-blue-50"
                            : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                      >
                        <div className="flex flex-col items-center space-y-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                            <Paperclip className="w-6 h-6 text-gray-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">
                              Seret file ke sini atau{" "}
                              <label
                                htmlFor="comment-file-upload"
                                className="text-blue-600 hover:text-blue-700 cursor-pointer underline"
                              >
                                pilih file
                              </label>
                            </p>
                            <p className="text-xs text-gray-500 mt-1">PDF, Word, atau gambar (Max 5MB)</p>
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
                      className="bg-blue-500 hover:bg-blue-600 text-white shadow-md transition-all duration-200 disabled:opacity-50"
                    >
                      {isSubmittingComment ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <MessageSquare className="w-4 h-4 mr-2" />
                      )}
                      Kirim Komentar
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="mb-8" />

            {/* Comments List */}
            <div className="space-y-6">
              {post.comments?.map((comment) => {
                const commentUserVote = comment.user_vote?.value || 0

                return (
                  <div key={comment.id} className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={comment.author?.avatar_url || "/placeholder.svg"} />
                        <AvatarFallback className={comment.is_ai_generated ? "bg-purple-500" : "bg-blue-500"}>
                          {comment.is_ai_generated ? (
                            <Bot className="w-5 h-5 text-white" />
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
                          className={`rounded-xl p-4 transition-all duration-200 ${
                            comment.is_ai_generated
                              ? "bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200"
                              : "bg-gray-50 hover:bg-gray-100"
                          }`}
                        >
                          <div className="flex items-center space-x-2 mb-3">
                            <span className="font-semibold text-gray-800">
                              {comment.is_ai_generated ? "AI Assistant" : comment.author?.full_name}
                            </span>
                            {comment.is_ai_generated ? (
                              <Badge
                                variant="secondary"
                                className="text-xs bg-purple-100 text-purple-700 border-purple-200"
                              >
                                <Bot className="w-3 h-3 mr-1" />
                                AI Assistant
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                                {comment.author?.role === "guru" ? "Guru" : "Relawan"}
                              </Badge>
                            )}
                            {comment.is_solution && (
                              <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                                Solusi
                              </Badge>
                            )}
                            <span className="text-xs text-gray-500">
                              {new Date(comment.created_at).toLocaleDateString("id-ID")}
                            </span>
                          </div>
                          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{comment.content}</p>

                          {/* Comment File Attachment */}
                          {comment.attachment_url && comment.attachment_name && (
                            <div className="mt-4 p-3 bg-white border border-gray-200 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                                  <FileText className="w-4 h-4 text-white" />
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-800">{comment.attachment_name}</p>
                                  <p className="text-xs text-gray-500">Lampiran komentar</p>
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-xs"
                                  onClick={() => window.open(comment.attachment_url, "_blank")}
                                >
                                  <Download className="w-3 h-3 mr-1" />
                                  Download
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Comment Actions */}
                        <div className="flex items-center space-x-2 mt-3">
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
                              <ChevronUp className="w-3 h-3" />
                            </Button>
                            <span
                              className={`px-2 text-xs font-semibold min-w-[1.5rem] text-center ${
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
                              <ChevronDown className="w-3 h-3" />
                            </Button>
                          </div>

                          {!comment.is_ai_generated && (
                            <Button variant="ghost" size="sm" className="text-xs text-gray-500 hover:text-blue-600">
                              <Reply className="w-3 h-3 mr-1" />
                              Balas
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="ml-14 space-y-4">
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
                              <div className="bg-white border border-gray-200 rounded-lg p-3">
                                <div className="flex items-center space-x-2 mb-2">
                                  <span className="font-medium text-gray-800 text-sm">{reply.author?.full_name}</span>
                                  <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                                    {reply.author?.role === "guru" ? "Guru" : "Relawan"}
                                  </Badge>
                                  <span className="text-xs text-gray-500">
                                    {new Date(reply.created_at).toLocaleDateString("id-ID")}
                                  </span>
                                </div>
                                <p className="text-gray-700 text-sm whitespace-pre-wrap">{reply.content}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {(!post.comments || post.comments.length === 0) && (
              <div className="text-center py-12">
                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Belum ada komentar</h3>
                <p className="text-gray-500">Jadilah yang pertama untuk memulai diskusi!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  )
}
