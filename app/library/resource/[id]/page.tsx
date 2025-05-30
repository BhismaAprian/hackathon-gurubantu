"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { useLibraryMaterial, useLibraryMaterials } from "@/hooks/use-library-materials"
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
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  Info,
  BookOpenIcon,
  School,
  FileType,
  HardDrive,
} from "lucide-react"
import AuthenticatedLayout from "@/components/authenticated-layout"

export default function ResourceDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const { toast } = useToast()
  const { material, loading, error, refetch } = useLibraryMaterial(id)
  const { incrementDownloadCount, incrementViewCount } = useLibraryMaterials()
  const [isLiked, setIsLiked] = useState(false)
  const [downloadCount, setDownloadCount] = useState(0)
  const [viewCount, setViewCount] = useState(0)
  const [activeTab, setActiveTab] = useState("overview")

  // Increment view count on page load
  useEffect(() => {
    if (material && user?.id && id) {
      const handleViewCount = async () => {
        try {
          await incrementViewCount(id) // Pass the id parameter
          setViewCount(prev => prev + 1)
        } catch (error) {
          console.error("Failed to increment view count:", error)
          toast({
            title: "Error",
            description: "Failed to update view count",
            variant: "destructive",
          })
        }
      }
      handleViewCount()
    }
  }, [material, user?.id, id, incrementViewCount, toast])

  // Update local state when material changes
  useEffect(() => {
    if (material) {
      setDownloadCount(material.download_count || 0)
      setViewCount(material.view_count || 0)
    }
  }, [material])

  const getFileIcon = (type: string | null | undefined) => {
    if (!type) return <File className="w-4 h-4 text-gray-600" />

    switch (type.toLowerCase()) {
      case "pdf":
        return <FileText className="w-4 h-4 text-red-600" />
      case "ppt":
      case "pptx":
        return (
          <div className="w-4 h-4 bg-orange-600 rounded flex items-center justify-center text-white text-xs font-bold">
            P
          </div>
        )
      case "doc":
      case "docx":
        return (
          <div className="w-4 h-4 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
            D
          </div>
        )
      case "jpg":
      case "jpeg":
      case "png":
        return <File className="w-4 h-4 text-purple-600" />
      default:
        return <File className="w-4 h-4 text-[#084734]" />
    }
  }

  const formatFileSize = (bytes: number | null | undefined) => {
    if (!bytes) return "Unknown"
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i]
  }

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "Unknown"
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const handleDownload = async () => {
    if (!material || !user) {
      toast({
        title: "Error",
        description: "Anda harus login untuk mendownload",
        variant: "destructive",
      })
      return
    }

    try {
      await incrementDownloadCount(id)
      setDownloadCount((prev) => prev + 1)

      // Trigger actual download
      if (material.file_url) {
        const link = document.createElement("a")
        link.href = material.file_url
        link.download = material.file_name || "download"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }

      toast({
        title: "Berhasil!",
        description: "File berhasil didownload",
      })
    } catch (error: any) {
      console.error("Download error:", error)
      toast({
        title: "Error",
        description: "Gagal mendownload file",
        variant: "destructive",
      })
    }
  }

  const handleLike = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "Anda harus login untuk menyukai resource",
        variant: "destructive",
      })
      return
    }

    setIsLiked(!isLiked)
    toast({
      title: "Berhasil!",
      description: isLiked ? "Resource tidak disukai" : "Resource disukai",
    })
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: material?.title,
          text: material?.description,
          url: window.location.href,
        })
      } else {
        await navigator.clipboard.writeText(window.location.href)
        toast({
          title: "Berhasil!",
          description: "Link berhasil disalin ke clipboard",
        })
      }
    } catch (error) {
      console.error("Share error:", error)
      try {
        await navigator.clipboard.writeText(window.location.href)
        toast({
          title: "Berhasil!",
          description: "Link berhasil disalin ke clipboard",
        })
      } catch (clipboardError) {
        toast({
          title: "Error",
          description: "Gagal membagikan link",
          variant: "destructive",
        })
      }
    }
  }

  // Loading state
  if (loading) {
    return (
      <AuthenticatedLayout>
        <div className="min-h-screen" style={{ backgroundColor: "#CEEDB2" }}>
          <div className="max-w-6xl mx-auto py-8 px-4">
            <div className="flex items-center mb-6">
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Skeleton className="h-64 w-full rounded-xl" />
                <Skeleton className="h-32 w-full rounded-xl" />
              </div>
              <div className="space-y-6">
                <Skeleton className="h-48 w-full rounded-xl" />
                <Skeleton className="h-32 w-full rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </AuthenticatedLayout>
    )
  }

  // Error state
  if (error || !material) {
    return (
      <AuthenticatedLayout>
        <div className="min-h-screen" style={{ backgroundColor: "#CEEDB2" }}>
          <div className="max-w-6xl mx-auto py-8 px-4">
            <Link
              href="/library"
              className="inline-flex items-center mb-6 transition-colors"
              style={{ color: "#084734" }}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Perpustakaan
            </Link>

            <Card
              className="shadow-xl p-8 text-center border-0"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.9)" }}
            >
              <AlertCircle className="w-16 h-16 mx-auto mb-4" style={{ color: "#084734" }} />
              <h3 className="text-xl font-semibold mb-2" style={{ color: "#084734" }}>
                Resource Tidak Ditemukan
              </h3>
              <p className="text-gray-600 mb-6">
                {error || "Resource yang Anda cari tidak ditemukan atau telah dihapus"}
              </p>
              <Link href="/library">
                <Button className="text-white border-0" style={{ backgroundColor: "#084734" }}>
                  Kembali ke Perpustakaan
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </AuthenticatedLayout>
    )
  }

  const isOwner = user?.id === material.user_id

  return (
    <AuthenticatedLayout>
      <div className="min-h-screen" style={{ backgroundColor: "#CEEDB2" }}>
        <div className="max-w-6xl mx-auto py-8 px-4">
          {/* Back Button */}
          <Link
            href="/library"
            className="inline-flex items-center mb-6 transition-colors hover:opacity-80"
            style={{ color: "#084734" }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Perpustakaan
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Material Header */}
              <Card
                className="p-8 mb-6 border-0 shadow-xl backdrop-blur-sm"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.95)" }}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {material.subject && (
                        <Badge
                          variant="outline"
                          className="border-2 font-medium"
                          style={{
                            backgroundColor: "#CEF17B",
                            color: "#084734",
                            borderColor: "#084734",
                          }}
                        >
                          {material.subject}
                        </Badge>
                      )}

                      {material.education_level && (
                        <Badge
                          variant="outline"
                          className="border-2 font-medium"
                          style={{
                            backgroundColor: "rgba(206, 241, 123, 0.3)",
                            color: "#084734",
                            borderColor: "#084734",
                          }}
                        >
                          {material.education_level}
                        </Badge>
                      )}

                      {material.file_type && (
                        <Badge
                          variant="outline"
                          className="border-2 font-medium"
                          style={{
                            backgroundColor: "rgba(206, 241, 123, 0.2)",
                            color: "#084734",
                            borderColor: "#084734",
                          }}
                        >
                          {material.file_type.toUpperCase()}
                        </Badge>
                      )}

                      {material.curriculum && (
                        <Badge
                          variant="outline"
                          className="border-2 font-medium"
                          style={{
                            backgroundColor: "rgba(206, 241, 123, 0.1)",
                            color: "#084734",
                            borderColor: "#084734",
                          }}
                        >
                          {material.curriculum}
                        </Badge>
                      )}

                      {/* <Badge
                        className="text-white font-medium"
                        style={{
                          backgroundColor: material.is_approved ? "#084734" : "#f43f5e",
                        }}
                      >
                        {material.is_approved ? "✅ Approved" : "⏳ Pending"}
                      </Badge> */}
                    </div>

                    <h1 className="text-3xl font-bold mb-4" style={{ color: "#084734" }}>
                      {material.title}
                    </h1>

                    {/* Rating */}
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${i < Math.floor(material.rating || 0) ? "fill-current" : ""}`}
                            style={{ color: i < Math.floor(material.rating || 0) ? "#CEF17B" : "#d1d5db" }}
                          />
                        ))}
                        <span className="text-lg font-semibold ml-2" style={{ color: "#084734" }}>
                          {material.rating?.toFixed(1) || "0.0"}
                        </span>
                        <span className="text-gray-600">({material.rating_count || 0} ulasan)</span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center space-x-6 text-gray-600 mb-6">
                      
                      <div className="flex items-center space-x-2">
                        <Clock className="w-5 h-5" style={{ color: "#084734" }} />
                        <span>Diupload {formatDate(material.created_at)}</span>
                      </div>
                    </div>

                    {/* Tabs */}
                    <Tabs defaultValue="overview" className="mt-6" onValueChange={setActiveTab}>
                      <TabsList className="mb-4" style={{ backgroundColor: "rgba(206, 241, 123, 0.2)" }}>
                        <TabsTrigger
                          value="overview"
                          className={activeTab === "overview" ? "text-white" : "text-gray-600"}
                          style={{ backgroundColor: activeTab === "overview" ? "#084734" : "transparent" }}
                        >
                          Overview
                        </TabsTrigger>
                        <TabsTrigger
                          value="details"
                          className={activeTab === "details" ? "text-white" : "text-gray-600"}
                          style={{ backgroundColor: activeTab === "details" ? "#084734" : "transparent" }}
                        >
                          Detail
                        </TabsTrigger>
                        <TabsTrigger
                          value="preview"
                          className={activeTab === "preview" ? "text-white" : "text-gray-600"}
                          style={{ backgroundColor: activeTab === "preview" ? "#084734" : "transparent" }}
                        >
                          Preview
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="overview">
                        {/* Description */}
                        <div className="prose prose-gray max-w-none mb-6">
                          <h3 className="text-lg font-semibold mb-3" style={{ color: "#084734" }}>
                            Deskripsi
                          </h3>
                          <p className="text-gray-700 leading-relaxed">{material.description}</p>
                        </div>

                        {/* Learning Objectives */}
                        {material.learning_objectives && material.learning_objectives.length > 0 && (
                          <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-3" style={{ color: "#084734" }}>
                              Tujuan Pembelajaran:
                            </h3>
                            <ul className="space-y-2">
                              {material.learning_objectives.map((objective: string, index: number) => (
                                <li key={index} className="flex items-start space-x-2">
                                  <span
                                    className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                                    style={{ backgroundColor: "#CEF17B" }}
                                  ></span>
                                  <span className="text-gray-700">{objective}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Tags */}
                        {material.tags && material.tags.length > 0 && (
                          <div className="mb-6">
                            <h3 className="text-sm font-medium mb-3" style={{ color: "#084734" }}>
                              Tags:
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {material.tags.map((tag: string, index: number) => (
                                <span
                                  key={index}
                                  className="text-sm font-medium px-3 py-1 rounded-full"
                                  style={{
                                    backgroundColor: "rgba(206, 241, 123, 0.3)",
                                    color: "#084734",
                                  }}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </TabsContent>

                      <TabsContent value="details">
                        <div className="space-y-6">
                          {/* File Information */}
                          <div>
                            <h3 className="text-lg font-semibold mb-4" style={{ color: "#084734" }}>
                              Informasi File
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div
                                className="flex items-center space-x-3 p-3 rounded-lg"
                                style={{ backgroundColor: "rgba(206, 241, 123, 0.1)" }}
                              >
                                <FileType className="w-5 h-5" style={{ color: "#084734" }} />
                                <div>
                                  <p className="text-sm text-gray-500">Tipe File</p>
                                  <p className="font-medium" style={{ color: "#084734" }}>
                                    {material.file_type?.toUpperCase() || "Unknown"}
                                  </p>
                                </div>
                              </div>

                              <div
                                className="flex items-center space-x-3 p-3 rounded-lg"
                                style={{ backgroundColor: "rgba(206, 241, 123, 0.1)" }}
                              >
                                <HardDrive className="w-5 h-5" style={{ color: "#084734" }} />
                                <div>
                                  <p className="text-sm text-gray-500">Ukuran File</p>
                                  <p className="font-medium" style={{ color: "#084734" }}>
                                    {formatFileSize(material.file_size)}
                                  </p>
                                </div>
                              </div>

                              <div
                                className="flex items-center space-x-3 p-3 rounded-lg"
                                style={{ backgroundColor: "rgba(206, 241, 123, 0.1)" }}
                              >
                                <BookOpenIcon className="w-5 h-5" style={{ color: "#084734" }} />
                                <div>
                                  <p className="text-sm text-gray-500">Mata Pelajaran</p>
                                  <p className="font-medium" style={{ color: "#084734" }}>
                                    {material.subject || "General"}
                                  </p>
                                </div>
                              </div>

                              <div
                                className="flex items-center space-x-3 p-3 rounded-lg"
                                style={{ backgroundColor: "rgba(206, 241, 123, 0.1)" }}
                              >
                                <School className="w-5 h-5" style={{ color: "#084734" }} />
                                <div>
                                  <p className="text-sm text-gray-500">Tingkat Pendidikan</p>
                                  <p className="font-medium" style={{ color: "#084734" }}>
                                    {material.education_level || "Semua Tingkat"}
                                  </p>
                                </div>
                              </div>

                              <div
                                className="flex items-center space-x-3 p-3 rounded-lg"
                                style={{ backgroundColor: "rgba(206, 241, 123, 0.1)" }}
                              >
                                <Info className="w-5 h-5" style={{ color: "#084734" }} />
                                <div>
                                  <p className="text-sm text-gray-500">Kurikulum</p>
                                  <p className="font-medium" style={{ color: "#084734" }}>
                                    {material.curriculum || "General"}
                                  </p>
                                </div>
                              </div>

                              <div
                                className="flex items-center space-x-3 p-3 rounded-lg"
                                style={{ backgroundColor: "rgba(206, 241, 123, 0.1)" }}
                              >
                                <Calendar className="w-5 h-5" style={{ color: "#084734" }} />
                                <div>
                                  <p className="text-sm text-gray-500">Terakhir Diperbarui</p>
                                  <p className="font-medium" style={{ color: "#084734" }}>
                                    {formatDate(material.updated_at)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Statistics */}
                          <div>
                            <h3 className="text-lg font-semibold mb-4" style={{ color: "#084734" }}>
                              Statistik
                            </h3>
                            <div className="space-y-4">
                              <div>
                                <div className="flex justify-between mb-1">
                                  <span className="text-sm font-medium" style={{ color: "#084734" }}>
                                    Rating
                                  </span>
                                  <span className="text-sm font-medium" style={{ color: "#084734" }}>
                                    {material.rating?.toFixed(1) || "0"}/5
                                  </span>
                                </div>
                                <Progress
                                  value={(material.rating || 0) * 20}
                                  className="h-2"
                                  style={{
                                    backgroundColor: "rgba(206, 241, 123, 0.3)",
                                  }}
                                  indicatorStyle={{
                                    backgroundColor: "#084734",
                                  }}
                                />
                              </div>

                              <div>
                                <div className="flex justify-between mb-1">
                                  <span className="text-sm font-medium" style={{ color: "#084734" }}>
                                    Downloads
                                  </span>
                                  <span className="text-sm font-medium" style={{ color: "#084734" }}>
                                    {downloadCount}
                                  </span>
                                </div>
                                <Progress
                                  value={Math.min((downloadCount / 10) * 100, 100)}
                                  className="h-2"
                                  style={{
                                    backgroundColor: "rgba(206, 241, 123, 0.3)",
                                  }}
                                  indicatorStyle={{
                                    backgroundColor: "#084734",
                                  }}
                                />
                              </div>

                              <div>
                                <div className="flex justify-between mb-1">
                                  <span className="text-sm font-medium" style={{ color: "#084734" }}>
                                    Views
                                  </span>
                                  <span className="text-sm font-medium" style={{ color: "#084734" }}>
                                    {viewCount}
                                  </span>
                                </div>
                                <Progress
                                  value={Math.min((viewCount / 20) * 100, 100)}
                                  className="h-2"
                                  style={{
                                    backgroundColor: "rgba(206, 241, 123, 0.3)",
                                  }}
                                  indicatorStyle={{
                                    backgroundColor: "#084734",
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="preview">
                        <div
                          className="border-2 border-dashed rounded-xl p-16 text-center"
                          style={{
                            backgroundColor: "rgba(206, 241, 123, 0.1)",
                            borderColor: "#084734",
                          }}
                        >
                          <div
                            className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                            style={{ backgroundColor: "rgba(255, 255, 255, 0.9)" }}
                          >
                            {getFileIcon(material.file_type)}
                          </div>
                          <h3 className="text-lg font-semibold mb-2" style={{ color: "#084734" }}>
                            {material.file_type === "pdf" ? "PDF Preview" : "Preview Tidak Tersedia"}
                          </h3>
                          <p className="text-gray-600 mb-4">
                            {material.file_name || "Unnamed file"}
                            {material.file_size ? ` (${formatFileSize(material.file_size)})` : ""}
                          </p>
                          <Button
                            onClick={handleDownload}
                            variant="outline"
                            className="border-2 hover:opacity-80 transition-opacity"
                            style={{
                              borderColor: "#084734",
                              color: "#084734",
                              backgroundColor: "rgba(206, 241, 123, 0.2)",
                            }}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download untuk Preview
                          </Button>
                        </div>
                      </TabsContent>
                    </Tabs>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-gray-100 mt-6">
                      <Button
                        onClick={handleDownload}
                        className="flex-1 min-w-[200px] text-white border-0 hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: "#084734" }}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download {material.file_size ? `(${formatFileSize(material.file_size)})` : ""}
                      </Button>

                      <Button
                        variant="outline"
                        onClick={handleLike}
                        className={`border-2 transition-all ${
                          isLiked ? "text-red-600 bg-red-50 border-red-300" : "hover:opacity-80"
                        }`}
                        style={
                          !isLiked
                            ? {
                                borderColor: "#084734",
                                color: "#084734",
                                backgroundColor: "rgba(206, 241, 123, 0.1)",
                              }
                            : {}
                        }
                      >
                        <Heart className={`w-4 h-4 mr-2 ${isLiked ? "fill-current" : ""}`} />
                        {isLiked ? "Disukai" : "Suka"}
                      </Button>

                      <Button
                        variant="outline"
                        onClick={handleShare}
                        className="border-2 hover:opacity-80 transition-opacity"
                        style={{
                          borderColor: "#084734",
                          color: "#084734",
                          backgroundColor: "rgba(206, 241, 123, 0.1)",
                        }}
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        Bagikan
                      </Button>

                      {isOwner && (
                        <>
                          <Button
                            variant="outline"
                            className="border-2 hover:opacity-80 transition-opacity"
                            style={{
                              borderColor: "#084734",
                              color: "#084734",
                              backgroundColor: "rgba(206, 241, 123, 0.1)",
                            }}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            className="text-red-600 hover:text-red-700 border-red-300 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Uploader Info */}
              <Card
                className="p-6 border-0 shadow-xl backdrop-blur-sm"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.95)" }}
              >
                <h3 className="text-lg font-semibold mb-4" style={{ color: "#084734" }}>
                  Tentang Pembuat
                </h3>
                <div className="flex items-center space-x-4 mb-4">
                  <Avatar className="w-12 h-12 ring-2" style={{ ringColor: "#CEF17B" }}>
                    <AvatarImage src={material.uploader?.avatar_url || "/placeholder.svg"} />
                    <AvatarFallback className="text-white" style={{ backgroundColor: "#084734" }}>
                      {material.uploader?.full_name
                        ?.split(" ")
                        .map((n: string) => n[0])
                        .join("") || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium" style={{ color: "#084734" }}>
                      {material.uploader?.full_name || "Anonymous"}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {material.uploader?.role === "guru" ? "Guru" : "Relawan"} {material.subject}
                    </p>
                    <p className="text-xs text-gray-500">{material.education_level}</p>
                  </div>
                </div>

                <Separator className="my-4" style={{ backgroundColor: "#CEF17B" }} />

                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Calendar className="w-4 h-4" style={{ color: "#084734" }} />
                    <span>Bergabung {formatDate(material.uploader?.created_at || material.created_at)}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <BookOpen className="w-4 h-4" style={{ color: "#084734" }} />
                    <span>Pengalaman: 2+ tahun</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <User className="w-4 h-4" style={{ color: "#084734" }} />
                    <span>15 resource dibagikan</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MapPin className="w-4 h-4" style={{ color: "#084734" }} />
                    <span>Indonesia</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full mt-4 border-2 hover:opacity-80 transition-opacity"
                  style={{
                    borderColor: "#084734",
                    color: "#084734",
                    backgroundColor: "rgba(206, 241, 123, 0.1)",
                  }}>
                  Lihat Profil
                </Button>
              </Card>

            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
