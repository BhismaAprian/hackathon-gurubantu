"use client";

import React from "react";
import { useState } from "react";
import { use } from 'react'
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
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
} from "lucide-react";
import AuthenticatedLayout from "@/components/authenticated-layout";
import {
  mockThreads,
  currentUser,
  generateAIResponse,
  type Comment,
} from "@/lib/mock-data";

interface ThreadDetailPageProps {
  params: { id: string } // Perbaikan 1: params adalah objek langsung, bukan Promise
}

interface VoteState {
  [key: string]: {
    userVote: "up" | "down" | null
    totalVotes: number
  }
}

export default function ThreadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params); // 👈 Wajib gunakan use()
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [commentFile, setCommentFile] = useState<File | null>(null)
  const [isAIGenerating, setIsAIGenerating] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const [voteStates, setVoteStates] = useState<VoteState>({})
  const [isLoading, setIsLoading] = useState(true) // Perbaikan 3: tambah state loading

  // Initialize params and thread data
  React.useEffect(() => {
    const threadId = params.id;
    const thread = mockThreads.find((t) => t.id === threadId);
    if (thread) {
      setComments(thread.comments);
      // Initialize vote states
      const initialVotes: VoteState = {
        [`thread-${threadId}`]: {
          userVote: null,
          totalVotes: thread.votes,
        },
      };
      thread.comments.forEach((comment) => {
        initialVotes[`comment-${comment.id}`] = {
          userVote: null,
          totalVotes: comment.votes,
        };
      });
      setVoteStates(initialVotes);
    }
  }, [params.id]);

  const thread = mockThreads.find((t) => t.id === id);

  if (!thread) {
    notFound();
  }

  const handleVote = (itemId: string, voteType: "up" | "down") => {
    setVoteStates((prev) => {
      const current = prev[itemId] || { userVote: null, totalVotes: 0 };
      let newVote: "up" | "down" | null = voteType;
      let voteDelta = 0;

      if (current.userVote === voteType) {
        // Remove vote if clicking same button
        newVote = null;
        voteDelta = voteType === "up" ? -1 : 1;
      } else if (current.userVote === null) {
        // New vote
        voteDelta = voteType === "up" ? 1 : -1;
      } else {
        // Change vote
        voteDelta = voteType === "up" ? 2 : -2;
      }

      return {
        ...prev,
        [itemId]: {
          userVote: newVote,
          totalVotes: current.totalVotes + voteDelta,
        },
      };
    });
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const commentId = `comment-${Date.now()}`;
    const comment: Comment = {
      id: commentId,
      content: newComment,
      author: currentUser,
      createdAt: new Date().toISOString(),
      votes: 0,
      hasFile: !!commentFile,
      fileName: commentFile?.name,
    };

    setComments((prev) => [...prev, comment]);
    setVoteStates((prev) => ({
      ...prev,
      [`comment-${commentId}`]: {
        userVote: null,
        totalVotes: 0,
      },
    }));
    setNewComment("");
    setCommentFile(null);
  };

  const handleAIAssist = async () => {
    setIsAIGenerating(true);

    // Simulate AI processing time
    setTimeout(() => {
      const aiCommentId = `ai-comment-${Date.now()}`;
      const aiComment = generateAIResponse(thread.title, thread.content);
      aiComment.id = aiCommentId;

      setComments((prev) => [...prev, aiComment]);
      setVoteStates((prev) => ({
        ...prev,
        [`comment-${aiCommentId}`]: {
          userVote: null,
          totalVotes: 0,
        },
      }));
      setIsAIGenerating(false);
    }, 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCommentFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setCommentFile(files[0]);
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return ImageIcon;
    if (file.type.includes("pdf")) return FileText;
    return File;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  const threadVoteState = voteStates[`thread-${id}`] || {
    userVote: null,
    totalVotes: thread.votes,
  };

  return (
    <AuthenticatedLayout>
      <div className="p-8 max-w-4xl mx-auto">
        {/* Thread Header */}
        <Card className="border-0 shadow-lg bg-white mb-6 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
            <div className="flex items-start space-x-4">
              <Avatar className="w-14 h-14 ring-2 ring-white shadow-md">
                <AvatarImage src={thread.author.avatar || "/placeholder.svg"} />
                <AvatarFallback className="bg-blue-500 text-white font-semibold">
                  {thread.author.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <h1 className="text-2xl font-bold text-gray-800 leading-tight">{thread.title}</h1>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 font-medium">
                    {thread.author.role === "guru" ? "Guru" : "Relawan"}
                  </Badge>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                  <span className="font-medium">{thread.author.name}</span>
                  <span className="flex items-center space-x-1">
                    <span>{thread.author.subject}</span>
                    <span>•</span>
                    <span>{thread.author.level}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(thread.createdAt).toLocaleDateString("id-ID")}</span>
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {thread.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs bg-white border-blue-200 text-blue-600">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="prose max-w-none mb-6">
              <p className="text-gray-700 leading-relaxed text-lg">{thread.content}</p>
            </div>

            {/* File Attachment */}
            {thread.hasFile && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-md">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{thread.fileName}</p>
                    <p className="text-sm text-gray-600">PDF • 2.5 MB</p>
                  </div>
                  <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white shadow-md">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            )}

            {/* Enhanced Action Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {/* Upvote/Downvote for Thread */}
                <div className="flex items-center bg-gray-50 rounded-full p-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleVote(`thread-${id}`, "up")}
                    className={`rounded-full transition-all duration-200 ${
                      threadVoteState.userVote === "up"
                        ? "bg-green-100 text-green-600 hover:bg-green-200"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <ChevronUp className="w-4 h-4" />
                  </Button>
                  <span
                    className={`px-3 py-1 text-sm font-semibold min-w-[2rem] text-center ${
                      threadVoteState.totalVotes > 0
                        ? "text-green-600"
                        : threadVoteState.totalVotes < 0
                          ? "text-red-600"
                          : "text-gray-600"
                    }`}
                  >
                    {threadVoteState.totalVotes}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleVote(`thread-${id}`, "down")}
                    className={`rounded-full transition-all duration-200 ${
                      threadVoteState.userVote === "down"
                        ? "bg-red-100 text-red-600 hover:bg-red-200"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </div>

                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4" />
                  <span>{comments.length} Komentar</span>
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
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
              <span>Diskusi ({comments.length})</span>
            </h2>
          </CardHeader>
          <CardContent className="p-6">
            {comments.length === 0 && (
              <div className="text-center py-12">
                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Belum ada komentar</h3>
                <p className="text-gray-500">Jadilah yang pertama untuk memulai diskusi!</p>
              </div>
            )}
            {/* Enhanced Add Comment */}
            <div className="mb-8">
              <div className="flex items-start space-x-4">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={currentUser.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-blue-500 text-white">
                    {currentUser.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-4">
                  <div className="relative">
                    <Textarea
                      placeholder="Bagikan pemikiran atau pengalaman Anda..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 min-h-[100px] resize-none"
                    />
                  </div>

                  {/* Enhanced File Upload */}
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
                      disabled={!newComment.trim()}
                      className="bg-blue-500 hover:bg-blue-600 text-white shadow-md transition-all duration-200 disabled:opacity-50"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Kirim Komentar
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="mb-8" />

            {/* Enhanced Comments List */}
            <div className="space-y-6">
              {comments.map((comment) => {
                const commentVoteState = voteStates[`comment-${comment.id}`] || {
                  userVote: null,
                  totalVotes: comment.votes,
                }

                return (
                  <div key={comment.id} className="space-y-4">
                    {/* Main Comment */}
                    <div className="flex items-start space-x-4">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={comment.author.avatar || "/placeholder.svg"} />
                        <AvatarFallback className={comment.isAI ? "bg-purple-500" : "bg-blue-500"}>
                          {comment.isAI ? (
                            <Bot className="w-5 h-5 text-white" />
                          ) : (
                            comment.author.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div
                          className={`rounded-xl p-4 transition-all duration-200 ${
                            comment.isAI
                              ? "bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200"
                              : "bg-gray-50 hover:bg-gray-100"
                          }`}
                        >
                          <div className="flex items-center space-x-2 mb-3">
                            <span className="font-semibold text-gray-800">{comment.author.name}</span>
                            {comment.isAI ? (
                              <Badge
                                variant="secondary"
                                className="text-xs bg-purple-100 text-purple-700 border-purple-200"
                              >
                                <Bot className="w-3 h-3 mr-1" />
                                AI Assistant
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                                {comment.author.role === "guru" ? "Guru" : "Relawan"}
                              </Badge>
                            )}
                            <span className="text-xs text-gray-500">
                              {new Date(comment.createdAt).toLocaleDateString("id-ID")}
                            </span>
                          </div>
                          <p className="text-gray-700 leading-relaxed">{comment.content}</p>

                          {/* Comment File Attachment */}
                          {comment.hasFile && comment.fileName && (
                            <div className="mt-4 p-3 bg-white border border-gray-200 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                                  <FileText className="w-4 h-4 text-white" />
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-800">{comment.fileName}</p>
                                  <p className="text-xs text-gray-500">Lampiran komentar</p>
                                </div>
                                <Button size="sm" variant="outline" className="text-xs">
                                  <Download className="w-3 h-3 mr-1" />
                                  Download
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Comment Actions */}
                        <div className="flex items-center space-x-2 mt-3">
                          {/* Upvote/Downvote for Comments */}
                          <div className="flex items-center bg-white border border-gray-200 rounded-full p-1 shadow-sm">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleVote(`comment-${comment.id}`, "up")}
                              className={`rounded-full transition-all duration-200 ${
                                commentVoteState.userVote === "up"
                                  ? "bg-green-100 text-green-600 hover:bg-green-200"
                                  : "hover:bg-gray-100"
                              }`}
                            >
                              <ChevronUp className="w-3 h-3" />
                            </Button>
                            <span
                              className={`px-2 text-xs font-semibold min-w-[1.5rem] text-center ${
                                commentVoteState.totalVotes > 0
                                  ? "text-green-600"
                                  : commentVoteState.totalVotes < 0
                                    ? "text-red-600"
                                    : "text-gray-600"
                              }`}
                            >
                              {commentVoteState.totalVotes}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleVote(`comment-${comment.id}`, "down")}
                              className={`rounded-full transition-all duration-200 ${
                                commentVoteState.userVote === "down"
                                  ? "bg-red-100 text-red-600 hover:bg-red-200"
                                  : "hover:bg-gray-100"
                              }`}
                            >
                              <ChevronDown className="w-3 h-3" />
                            </Button>
                          </div>

                          {!comment.isAI && (
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
                        {comment.replies.map((reply) => {
                          const replyVoteState = voteStates[`comment-${reply.id}`] || {
                            userVote: null,
                            totalVotes: reply.votes,
                          }

                          return (
                            <div key={reply.id} className="flex items-start space-x-3">
                              <Avatar className="w-8 h-8">
                                <AvatarImage src={reply.author.avatar || "/placeholder.svg"} />
                                <AvatarFallback className="text-xs bg-blue-500 text-white">
                                  {reply.author.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="bg-white border border-gray-200 rounded-lg p-3">
                                  <div className="flex items-center space-x-2 mb-2">
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
                                <div className="flex items-center space-x-2 mt-2">
                                  <div className="flex items-center bg-white border border-gray-200 rounded-full p-1 shadow-sm">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleVote(`comment-${reply.id}`, "up")}
                                      className={`rounded-full transition-all duration-200 ${
                                        replyVoteState.userVote === "up"
                                          ? "bg-green-100 text-green-600 hover:bg-green-200"
                                          : "hover:bg-gray-100"
                                      }`}
                                    >
                                      <ChevronUp className="w-3 h-3" />
                                    </Button>
                                    <span
                                      className={`px-2 text-xs font-semibold min-w-[1.5rem] text-center ${
                                        replyVoteState.totalVotes > 0
                                          ? "text-green-600"
                                          : replyVoteState.totalVotes < 0
                                            ? "text-red-600"
                                            : "text-gray-600"
                                      }`}
                                    >
                                      {replyVoteState.totalVotes}
                                    </span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleVote(`comment-${reply.id}`, "down")}
                                      className={`rounded-full transition-all duration-200 ${
                                        replyVoteState.userVote === "down"
                                          ? "bg-red-100 text-red-600 hover:bg-red-200"
                                          : "hover:bg-gray-100"
                                      }`}
                                    >
                                      <ChevronDown className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
