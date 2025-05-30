"use client"

import React from "react"
import { useState, useEffect, use } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Download,
  FileText,
  Eye,
  Star,
  Heart,
  File,
  Edit,
  Trash2,
  User,
  Calendar,
  MapPin,
  Share2,
  BookOpen,
} from "lucide-react"
import AuthenticatedLayout from "@/components/authenticated-layout"
import { mockResources, currentUser } from "@/lib/mock-data"

interface ResourceDetailPageProps {
  params: Promise<{ id: string }>
}

export default function ResourceDetailPage({ params }: ResourceDetailPageProps) {
  const { id } = use(params) // ✅ Wajib gunakan use()
  const [isLiked, setIsLiked] = useState(false)
  const [downloadCount, setDownloadCount] = useState(0)

  const resource = mockResources.find((r) => r.id === id)

  useEffect(() => {
    if (resource) {
      setDownloadCount(resource.downloadCount)
    }
  }, [id])

  if (!resource) {
    notFound()
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="w-4 h-4 text-red-600" />
      case "ppt":
        return (
          <div className="w-4 h-4 bg-orange-600 rounded flex items-center justify-center text-white text-xs font-bold">
            P
          </div>
        )
      case "doc":
        return (
          <div className="w-4 h-4 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
            D
          </div>
        )
      default:
        return <File className="w-4 h-4 text-gray-600" />
    }
  }
  const formatFileSize = (sizeStr: string) => {
    return sizeStr
  }

  const handleDownload = () => {
    setDownloadCount((prev) => prev + 1)
    console.log("Downloading:", resource.title)
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
  }

  const isOwner = currentUser.id === resource.author.id

  // Mock learning objectives
  const learningObjectives = [
    "Memahami konsep dasar matematika dengan pendekatan visual",
    "Mengembangkan kemampuan berpikir logis dan sistematis",
    "Menerapkan konsep matematika dalam kehidupan sehari-hari",
  ]

  // Mock tags
  const tags = ["pembelajaran", "interaktif", "visual", "praktis"]

  // Mock related resources
  const relatedResources = mockResources.filter((r) => r.id !== id && r.subject === resource.subject).slice(0, 3)

  return (
    <AuthenticatedLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto py-8 px-4">
          {/* Back Button */}
          <Link href="/library" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Perpustakaan
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Material Header */}
              <Card className="p-8 mb-6 border-0 shadow-lg">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        {resource.subject}
                      </Badge>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {resource.level}
                      </Badge>
                      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                        Kurikulum Merdeka
                      </Badge>
                      <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                        {resource.type.toUpperCase()}
                      </Badge>
                      <Badge className="bg-green-500 text-white">Approved</Badge>
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900 mb-4">{resource.title}</h1>

                    {/* Rating */}
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${i < 4 ? "text-amber-400 fill-current" : "text-gray-300"}`}
                          />
                        ))}
                        <span className="text-lg font-semibold text-gray-900 ml-2">4.8</span>
                        <span className="text-gray-600">(24 ulasan)</span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center space-x-6 text-gray-600 mb-6">
                      <div className="flex items-center space-x-2">
                        <Eye className="w-5 h-5" />
                        <span>245 dilihat</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Download className="w-5 h-5" />
                        <span>{downloadCount} unduhan</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FileText className="w-5 h-5" />
                        <span>{formatFileSize(resource.fileSize)}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="prose prose-gray max-w-none mb-6">
                      <p className="text-gray-700 leading-relaxed text-lg">{resource.description}</p>
                    </div>

                    {/* Learning Objectives */}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Tujuan Pembelajaran:</h3>
                      <ul className="space-y-2">
                        {learningObjectives.map((objective, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                            <span className="text-gray-700">{objective}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Tags */}
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-gray-900 mb-3">Tags:</h3>
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag, index) => (
                          <span
                            key={index}
                            className="bg-gray-100 text-gray-700 text-sm font-medium px-3 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* File Info */}
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-gray-900 mb-3">Informasi File:</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <span className="block text-gray-600 text-sm mb-1">Ukuran File:</span>
                          <span className="text-gray-700 font-medium">{formatFileSize(resource.fileSize)}</span>
                        </div>
                        <div>
                          <span className="block text-gray-600 text-sm mb-1">Kurikulum:</span>
                          <span className="text-gray-700 font-medium">Kurikulum Merdeka</span>
                        </div>
                        <div>
                          <span className="block text-gray-600 text-sm mb-1">Tanggal Upload:</span>
                          <span className="text-gray-700 font-medium">
                            {new Date(resource.createdAt).toLocaleDateString("id-ID")}
                          </span>
                        </div>
                        <div>
                          <span className="block text-gray-600 text-sm mb-1">Wilayah:</span>
                          <span className="text-gray-700 font-medium">DKI Jakarta</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-4 pt-6 border-t border-gray-100">
                      <Button onClick={handleDownload} className="flex-1 bg-green-600 hover:bg-green-700">
                        <Download className="w-4 h-4 mr-2" />
                        Download ({formatFileSize(resource.fileSize)})
                      </Button>

                      <Button
                        variant="outline"
                        onClick={handleLike}
                        className={isLiked ? "border-red-300 text-red-600 bg-red-50" : ""}
                      >
                        <Heart className={`w-4 h-4 mr-2 ${isLiked ? "fill-current" : ""}`} />
                        {isLiked ? "Disukai" : "Suka"}
                      </Button>

                      <Button variant="outline">
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </Button>


                      {isOwner && (
                        <>
                          <Button variant="outline">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                          <Button variant="outline" className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Card>

              {/* File Preview */}
              <Card className="p-8 border-0 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>Preview File</span>
                </h3>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-200 rounded-xl p-16 text-center">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <FileText className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Preview Tidak Tersedia</h3>
                  <p className="text-gray-500 mb-4">Download file untuk melihat konten lengkap</p>
                  <Button
                    onClick={handleDownload}
                    variant="outline"
                    className="border-green-300 text-green-600 hover:bg-green-50"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download untuk Preview
                  </Button>
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Uploader Info */}
              <Card className="p-6 border-0 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tentang Pembuat</h3>
                <div className="flex items-center space-x-4 mb-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={resource.author.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-blue-500 text-white">
                      {resource.author.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium text-gray-900">{resource.author.name}</h4>
                    <p className="text-sm text-gray-600">
                      {resource.author.role === "guru" ? "Guru" : "Relawan"} {resource.author.subject}
                    </p>
                    <p className="text-xs text-gray-500">{resource.author.level}</p>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Bergabung {new Date(resource.author.joinedAt).toLocaleDateString("id-ID")}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <BookOpen className="w-4 h-4" />
                    <span>Pengalaman: {resource.author.experience}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <User className="w-4 h-4" />
                    <span>15 resource dibagikan</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>DKI Jakarta</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full mt-4">
                  Lihat Profil
                </Button>
              </Card>

              {/* Related Materials */}
              {relatedResources.length > 0 && (
                <Card className="p-6 border-0 shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Materi Terkait</h3>
                  <div className="space-y-4">
                    {relatedResources.map((related) => (
                      <Link key={related.id} href={`/library/resource/${related.id}`}>
                        <div className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            {getFileIcon(related.type)}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 line-clamp-1">{related.title}</h4>
                            <p className="text-sm text-gray-600">oleh {related.author.name}</p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center space-x-1 text-amber-500 mb-1">
                              <Star className="w-3 h-3 fill-current" />
                              <span className="text-xs">4.8</span>
                            </div>
                            <p className="text-xs text-gray-500">{related.downloadCount} unduhan</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
