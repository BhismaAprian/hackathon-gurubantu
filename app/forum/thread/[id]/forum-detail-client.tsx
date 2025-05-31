"use client"

import type React from "react"

import { generateAIReplyStream } from '@/lib/generateAIReplyStream'
import { useState, useRef } from "react"
import Link from "next/link"
import { formatDate } from "@/utils/format-date"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ArrowBigDownDash,
  ArrowBigUpDash,
  MessageSquareText,
  Bot,
  FileText,
  Paperclip,
  Send,
  Download,
  CheckCircle,
  ArrowLeft,
} from "lucide-react"
import { createComment, toggleVote, generateAIReply, markAsSolution } from "./action"

interface ForumDetailClientProps {
  threadData: any
  currentUser: any
  initialVotes: any[]
}

export default function ForumDetailClient({ threadData, currentUser, initialVotes }: ForumDetailClientProps) {
  const { thread, comments } = threadData
  const [newComment, setNewComment] = useState("")
  const [attachedFile, setAttachedFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showAIReply, setShowAIReply] = useState(false)
  const [aiReplyContent, setAIReplyContent] = useState("")
  const [isGeneratingAI, setIsGeneratingAI] = useState(false)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [votingStates, setVotingStates] = useState<Record<string, boolean>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Initialize user votes with better mapping
  const initialVotesMap: Record<string, number> = {}
  if (Array.isArray(initialVotes)) {
    initialVotes.forEach((vote) => {
      const targetId = vote.thread_id || vote.comment_id
      if (targetId) {
        initialVotesMap[targetId] = vote.value || 0
      }
    })
  }
  const [userVotes, setUserVotes] = useState<Record<string, number>>(initialVotesMap)

  // Track like counts locally for optimistic updates
  const [localLikeCounts, setLocalLikeCounts] = useState<Record<string, number>>(() => {
    const counts: Record<string, number> = {}
    counts[thread.id] = thread.like_count || 0
    comments.forEach((comment: any) => {
      counts[comment.id] = comment.like_count || 0
    })
    return counts
  })

  // Get user initials for avatar fallback
  const getInitials = (name: string) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  console.log(thread)

  // Handle comment submission
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append("content", newComment)
      formData.append("post_id", thread.id)
      if (replyingTo) {
        formData.append("parent_id", replyingTo)
      }
      if (attachedFile) {
        formData.append("attachment", attachedFile)
      }
      formData.append("is_ai_generated", showAIReply ? "true" : "false")

      await createComment(formData)
      setNewComment("")
      setAttachedFile(null)
      setReplyingTo(null)
      setShowAIReply(false)
      // Refresh page to show new comment
      window.location.reload()
    } catch (error) {
      console.error("Error submitting comment:", error)
    } finally {
      setIsSubmitting(false)
    }
  }
 

  const handleGenerateAI = async () => {
    setIsGeneratingAI(true)
    setAIReplyContent('') // kosongkan balasan sebelumnya
    try {
      await generateAIReplyStream(thread.id, thread.content, (chunk) => {
        setAIReplyContent((prev) => prev + chunk)
      })
      setShowAIReply(true)
    } catch (err) {
      console.error('Gagal generate AI:', err)
    } finally {
      setIsGeneratingAI(false)
    }
  }


  // Handle voting
  const handleVote = async (targetId: string, targetType: "thread" | "comment", voteValue: number) => {
    // Prevent multiple simultaneous votes on the same target
    if (votingStates[targetId]) return

    // Check if user is logged in
    if (!currentUser) {
      alert("Anda harus login untuk memberikan vote")
      return
    }

    setVotingStates((prev) => ({ ...prev, [targetId]: true }))

    try {
      const currentVote = userVotes[targetId] || 0
      const newVote = currentVote === voteValue ? 0 : voteValue
      const voteDifference = newVote - currentVote

      console.log("Voting:", {
        targetId,
        targetType,
        currentVote,
        newVote,
        voteDifference,
      })

      // Optimistic update
      setUserVotes((prev) => ({ ...prev, [targetId]: newVote }))
      setLocalLikeCounts((prev) => ({
        ...prev,
        [targetId]: (prev[targetId] || 0) + voteDifference,
      }))

      // Call server action
      await toggleVote(targetId, targetType, newVote)

      console.log("Vote successful for:", targetId)
    } catch (error) {
      console.error("Error voting:", error)

      // Revert optimistic update on error
      const currentVote = userVotes[targetId] || 0
      const revertVote = currentVote === voteValue ? 0 : voteValue
      const revertDifference = revertVote - currentVote

      setUserVotes((prev) => ({ ...prev, [targetId]: currentVote }))
      setLocalLikeCounts((prev) => ({
        ...prev,
        [targetId]: (prev[targetId] || 0) - revertDifference,
      }))

      alert("Gagal memberikan vote. Silakan coba lagi.")
    } finally {
      setVotingStates((prev) => ({ ...prev, [targetId]: false }))
    }
  }

  // Handle marking comment as solution
  const handleMarkAsSolution = async (commentId: string) => {
    try {
      await markAsSolution(commentId)
      // Refresh page to show updated state
      window.location.reload()
    } catch (error) {
      console.error("Error marking as solution:", error)
    }
  }

  // Handle file attachment
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachedFile(e.target.files[0])
    }
  }

  // Organize comments into threads
  const organizeComments = (comments: any[]) => {
    const commentMap = new Map()
    const rootComments: any[] = []

    // First pass: create map of all comments
    comments.forEach((comment) => {
      commentMap.set(comment.id, { ...comment, replies: [] })
    })

    // Second pass: organize into tree structure
    comments.forEach((comment) => {
      if (comment.parent_comment_id) {
        const parent = commentMap.get(comment.parent_comment_id)
        if (parent) {
          parent.replies.push(commentMap.get(comment.id))
        }
      } else {
        rootComments.push(commentMap.get(comment.id))
      }
    })

    return rootComments
  }

  const organizedComments = organizeComments(comments)

  // Render vote buttons component
  const VoteButtons = ({ targetId, targetType }: { targetId: string; targetType: "thread" | "comment" }) => {
    const currentVote = userVotes[targetId] || 0
    const likeCount = localLikeCounts[targetId] || 0
    const isVoting = votingStates[targetId] || false

    return (
      <div className="flex items-center gap-1">
        <button
          onClick={() => handleVote(targetId, targetType, 1)}
          disabled={isVoting || !currentUser}
          className={`flex items-center p-1 rounded transition-colors ${
            currentVote === 1 ? "text-blue-600 bg-blue-50" : "text-gray-500 hover:text-blue-600 hover:bg-blue-50"
          } ${isVoting ? "opacity-50 cursor-not-allowed" : ""}`}
          title={!currentUser ? "Login untuk memberikan vote" : "Upvote"}
        >
          <ArrowBigUpDash
            className="w-5 h-5"
            color={currentVote === 1 ? "#4755F1" : "#6B7280"}
            fill={currentVote === 1 ? "#4755F1" : "none"}
          />
        </button>

        <span className="text-sm font-medium min-w-[2rem] text-center">{isVoting ? "..." : likeCount}</span>

        <button
          onClick={() => handleVote(targetId, targetType, -1)}
          disabled={isVoting || !currentUser}
          className={`flex items-center p-1 rounded transition-colors ${
            currentVote === -1 ? "text-red-600 bg-red-50" : "text-gray-500 hover:text-red-600 hover:bg-red-50"
          } ${isVoting ? "opacity-50 cursor-not-allowed" : ""}`}
          title={!currentUser ? "Login untuk memberikan vote" : "Downvote"}
        >
          <ArrowBigDownDash
            className="w-5 h-5"
            color={currentVote === -1 ? "#FF0000" : "#6B7280"}
            fill={currentVote === -1 ? "#FF0000" : "none"}
          />
        </button>
      </div>
    )
  }

  // Render comment component
  const CommentComponent = ({ comment, depth = 0 }: { comment: any; depth?: number }) => (
    <div className={`${depth > 0 ? "ml-8 mt-4" : "mt-6"}`}>
      <div
        className={`px-5 py-5 bg-white rounded-lg border ${
          comment.is_ai_generated
            ? "border-blue-200 bg-blue-50/30"
            : comment.is_solution
              ? "border-green-200 bg-green-50/30"
              : "border-gray-200"
        }`}
      >
        <div className="flex items-start gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={comment.author?.avatar_url || "/placeholder.svg"} />
            <AvatarFallback className="text-xs">
              {comment.is_ai_generated ? "AI" : getInitials(comment.author?.full_name || "User")}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold text-sm font-jakarta">
                {comment.is_ai_generated ? "AI Assistant" : comment.author?.full_name || "Unknown User"}
              </span>
              {comment.is_ai_generated && <Bot className="w-4 h-4 text-blue-500" />}
              {comment.is_solution && <CheckCircle className="w-4 h-4 text-green-500" />}
              <span className="text-xs text-gray-500 font-geist">
                {comment.created_at ? formatDate(comment.created_at) : "Unknown date"}
              </span>
            </div>

            <div className="prose prose-sm max-w-none mb-3 font-geist">
              <p className="text-gray-700">{comment.content || "No content"}</p>
            </div>

            {comment.attachment_url && (
              <div className="mb-3 p-2 bg-gray-50 rounded-lg flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-500" />
                <a
                  href={comment.attachment_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  {comment.attachment_name || "Download"}
                </a>
                <Download className="w-4 h-4 text-gray-400" />
              </div>
            )}

            <div className="flex items-center gap-4 font-jakarta">
              <VoteButtons targetId={comment.id} targetType="comment" />

              {/* <button
                onClick={() => setReplyingTo(comment.id)}
                className="flex items-center font-semibold gap-2 text-sm text-gray-600 hover:text-gray-800"
              >
                <MessageSquareText size={16} />
                Balas
              </button> */}

              {/* Mark as solution button (only for thread author) */}
              {currentUser?.id === thread.author_id && !thread.is_solved && !comment.is_solution && (
                <button
                  onClick={() => handleMarkAsSolution(comment.id)}
                  className="flex items-center font-semibold gap-2 text-sm text-green-600 hover:text-green-800"
                >
                  <CheckCircle size={16} />
                  Tandai Sebagai Solusi
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Render replies */}
      {comment.replies?.map((reply: any) => (
        <CommentComponent key={reply.id} comment={reply} depth={depth + 1} />
      ))}
    </div>
  )

  return (
    <>
      {/* Back button */}
      <div className="mb-6">
        <Button variant="outline" asChild className="font-jakarta">
          <Link href="/forum" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Forum
          </Link>
        </Button>
      </div>

      {/* Thread Content */}
      <div className="px-5 py-7 bg-white rounded-lg border border-gray-200">
        {/* Header */}
        <div className="header flex items-start justify-between mb-4">
          {/* Profile */}
          <div className="flex items-center gap-4">
            <Avatar className="w-10 h-10">
              <AvatarImage src={thread.author?.avatar_url || "/placeholder.svg"} />
              <AvatarFallback>{getInitials(thread.author?.full_name || "User")}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col font-jakarta -space-y-1">
              <h2 className="text-lg font-semibold text-gray-800">{thread.author?.full_name || "Unknown User"}</h2>
              <p className="text-sm font-semibold text-gray-500">
                {thread.author?.institution || "Institut Teknologi Kalimantan"}
              </p>
            </div>
          </div>
          {/* Date */}
          <div className="font-geist text-sm font-medium text-gray-500">
            <p>{thread.created_at ? formatDate(thread.created_at) : "Unknown date"}</p>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-2 my-6">
          <h3 className="text-3xl font-bold font-jakarta">{thread.title || "No title"}</h3>
          <p className="font-geist text-base font-medium">{thread.content || "No content"}</p>

          {/* Summary if available */}
          {thread.summary && (
            <Alert className="mt-4 bg-gray-50">
              <AlertDescription>
                <strong>Ringkasan:</strong> {thread.summary}
              </AlertDescription>
            </Alert>
          )}

          {/* Tags */}
          {thread.thread_tags && thread.thread_tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {thread.thread_tags.map((tagItem: any, index: number) => (
                <Badge key={index} variant="outline" className="text-sm">
                  #{tagItem.tag?.name || "Unknown tag"}
                </Badge>
              ))}
            </div>
          )}

          {/* Attachment if available */}
          {thread.attachment_url && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-600">Lampiran:</span>
                <a
                  href={thread.attachment_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-medium"
                >
                  {thread.attachment_name || "Download"}
                </a>
                <Download className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          )}
        </div>

        {/* Thread metadata */}
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-500 font-geist">
          <div className="flex items-center gap-1">
            <MessageSquareText className="w-4 h-4" />
            <span>{thread.reply_count || 0} balasan</span>
          </div>
          <div className="flex items-center gap-1">
            <ArrowBigUpDash className="w-4 h-4" />
            <span>{localLikeCounts[thread.id] || 0} votes</span>
          </div>
          <div className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-eye"
            >
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <span>{thread.view_count || 0} dilihat</span>
          </div>
        </div>

        {/* Action */}
        <div className="flex items-center justify-between font-jakarta">
          {/* Vote */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <VoteButtons targetId={thread.id} targetType="thread" />
              <span className="text-sm text-gray-500">{!currentUser && "(Login untuk vote)"}</span>
            </div>
          </div>

          {/* AI Assistance */}
          <Button
            variant="outline"
            onClick={handleGenerateAI}
            disabled={isGeneratingAI}
            className="flex items-center font-semibold gap-2"
          >
            <Bot className="w-4 h-4" />
            {isGeneratingAI ? "Generating..." : "AI Assistance"}
          </Button>
        </div>
      </div>

      {/* AI Reply Section */}
      {showAIReply && (
        <div className="mt-6 px-5 py-5 bg-white rounded-lg border border-blue-200 bg-blue-50/30">
          <div className="flex items-center gap-2 mb-4">
            <Bot className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold font-jakarta">AI Generated Response</h3>
          </div>
          <div className="prose max-w-none mb-4 font-geist">
            <blockquote className="border-l-4 border-blue-400 bg-blue-50 p-4 text-gray-800 italic rounded-md whitespace-pre-line">
              {aiReplyContent}
            </blockquote>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => {
                setNewComment(aiReplyContent)
                setShowAIReply(false)
              }}
            >
              Gunakan Respons Ini
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowAIReply(false)}>
              Tutup
            </Button>
          </div>
        </div>
      )}

      {/* Comments Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold font-jakarta mb-4">Balasan ({comments.length})</h2>

        {organizedComments.map((comment) => (
          <CommentComponent key={comment.id} comment={comment} />
        ))}

        {comments.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <MessageSquareText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="font-jakarta">Belum ada balasan. Jadilah yang pertama membalas!</p>
          </div>
        )}
      </div>

      {/* Reply Form */}
      <div className="mt-8 px-5 py-5 bg-white rounded-lg border border-gray-200">
        <h3 className="font-semibold font-jakarta mb-4">{replyingTo ? "Balas Komentar" : "Tambahkan Balasan Anda"}</h3>
        {replyingTo && (
          <Button variant="ghost" size="sm" onClick={() => setReplyingTo(null)} className="mb-4">
            Batalkan Balasan
          </Button>
        )}
        <form onSubmit={handleSubmitComment} className="space-y-4">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Tulis balasan Anda..."
            rows={4}
            required
            className="font-geist"
          />

          {attachedFile && (
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
              <FileText className="w-4 h-4" />
              <span className="text-sm font-geist">{attachedFile.name}</span>
              <Button type="button" variant="ghost" size="sm" onClick={() => setAttachedFile(null)}>
                Hapus
              </Button>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                <Paperclip className="w-4 h-4 mr-1" />
                Lampirkan File
              </Button>
              <Input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                className="hidden"
                accept=".pdf,.doc,.docx,.txt,.jpg,.png,.gif"
              />
            </div>

            <Button type="submit" disabled={isSubmitting || !newComment.trim()} className="bg-gray-900 text-white">
              <Send className="w-4 h-4 mr-2" />
              {isSubmitting ? "Mengirim..." : "Kirim Balasan"}
            </Button>
          </div>
        </form>
      </div>
    </>
  )
}
