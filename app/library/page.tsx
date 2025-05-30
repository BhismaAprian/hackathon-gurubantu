"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Plus,
  Download,
  FileText,
  ImageIcon,
  Filter,
  Grid,
  List,
  Star,
  Eye,
  User,
  Calendar,
  MapPin,
  Tag,
  SortAsc,
} from "lucide-react"
import AuthenticatedLayout from "@/components/authenticated-layout"
import { mockResources } from "@/lib/mock-data"

const SUBJECTS = [
  "Semua Mata Pelajaran",
  "Matematika",
  "Bahasa Indonesia",
  "IPA",
  "IPS",
  "Bahasa Inggris",
  "Fisika",
  "Kimia",
  "Biologi",
]

const FILE_FORMATS = ["Semua Format", "PDF", "DOC", "PPT", "Video", "Gambar"]

const REGIONS = [
  "Semua Wilayah",
  "DKI Jakarta",
  "Jawa Barat",
  "Jawa Tengah",
  "Jawa Timur",
  "Sumatera Utara",
  "Sumatera Barat",
  "Kalimantan Timur",
  "Sulawesi Selatan",
]

const SORT_OPTIONS = [
  { value: "created_at", label: "Terbaru" },
  { value: "downloads", label: "Paling Banyak Diunduh" },
  { value: "rating", label: "Rating Tertinggi" },
  { value: "title", label: "Nama A-Z" },
]

export default function LibraryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("Semua Mata Pelajaran")
  const [selectedFormat, setSelectedFormat] = useState("Semua Format")
  const [selectedRegion, setSelectedRegion] = useState("Semua Wilayah")
  const [sortBy, setSortBy] = useState("created_at")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="w-8 h-8 text-red-600" />
      case "ppt":
        return (
          <div className="w-8 h-8 bg-orange-600 rounded flex items-center justify-center text-white text-xs font-bold">
            PPT
          </div>
        )
      case "doc":
        return (
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
            DOC
          </div>
        )
      case "video":
        return (
          <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center text-white text-xs font-bold">
            VID
          </div>
        )
      case "image":
        return <ImageIcon className="w-8 h-8 text-green-600" />
      default:
        return <FileText className="w-8 h-8 text-gray-600" />
    }
  }

  const formatFileSize = (sizeStr: string) => {
    return sizeStr
  }

  // Filter resources based on selected filters
  const filteredResources = mockResources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesSubject = selectedSubject === "Semua Mata Pelajaran" || resource.subject === selectedSubject

    const matchesFormat = selectedFormat === "Semua Format" || resource.type.toUpperCase() === selectedFormat

    return matchesSearch && matchesSubject && matchesFormat
  })

  // Sort resources
  const sortedResources = [...filteredResources].sort((a, b) => {
    switch (sortBy) {
      case "downloads":
        return b.downloadCount - a.downloadCount
      case "title":
        return a.title.localeCompare(b.title)
      case "created_at":
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
  })

  return (
    <AuthenticatedLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-8 px-4">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Perpustakaan Digital</h1>
                <p className="text-gray-600">Berbagi dan akses materi pembelajaran dari guru di seluruh Indonesia</p>
              </div>

              <Link href="/library/upload">
                <Button size="lg" className="w-full lg:w-auto bg-green-600 hover:bg-green-700">
                  <Plus className="w-5 h-5 mr-2" />
                  Tambah Materi
                </Button>
              </Link>
            </div>
          </div>

          {/* Search and Filters */}
          <Card className="p-6 mb-6">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Cari materi pembelajaran..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 text-lg py-6 border-gray-200 focus:border-green-500 focus:ring-green-500"
                />
              </div>
            </div>

            {/* Filter Chips */}
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Filter:</span>
              </div>

              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="w-48 border-gray-200 focus:border-green-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SUBJECTS.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                <SelectTrigger className="w-40 border-gray-200 focus:border-green-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FILE_FORMATS.map((format) => (
                    <SelectItem key={format} value={format}>
                      {format}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger className="w-40 border-gray-200 focus:border-green-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {REGIONS.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort and View Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">{sortedResources.length} materi ditemukan</span>
                <div className="flex items-center space-x-2">
                  <SortAsc className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Urutkan:</span>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40 border-gray-200 focus:border-green-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SORT_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="p-2"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="p-2"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Materials Grid/List */}
          {viewMode === "grid" ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedResources.map((material) => (
                <Link key={material.id} href={`/library/resource/${material.id}`}>
                  <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-200 border-0 shadow-md">
                    {/* Preview Area */}
                    <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative">
                      {getFileIcon(material.type)}
                      <Badge className="absolute top-3 right-3 bg-green-500 text-white">Approved</Badge>
                      <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-medium">
                        {formatFileSize(material.fileSize)}
                      </div>
                    </div>

                    <CardContent className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            {material.subject}
                          </Badge>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {material.level}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-1 text-amber-500">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-xs font-medium">4.8</span>
                        </div>
                      </div>

                      {/* Content */}
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{material.title}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{material.description}</p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        <span className="inline-flex items-center text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                          <Tag className="w-3 h-3 mr-1" />
                          pembelajaran
                        </span>
                        <span className="inline-flex items-center text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                          <Tag className="w-3 h-3 mr-1" />
                          interaktif
                        </span>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-1">
                            <User className="w-3 h-3" />
                            <span>{material.author.name}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3" />
                            <span>Jakarta</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-1">
                            <Eye className="w-3 h-3" />
                            <span>245</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Download className="w-3 h-3" />
                            <span>{material.downloadCount}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {sortedResources.map((material) => (
                <Link key={material.id} href={`/library/resource/${material.id}`}>
                  <Card className="p-6 hover:shadow-lg transition-all duration-200 border-0 shadow-md">
                    <div className="flex items-start space-x-6">
                      {/* File Icon */}
                      <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center">
                        {getFileIcon(material.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              {material.subject}
                            </Badge>
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              {material.level}
                            </Badge>
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              Approved
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-1 text-amber-500">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="text-sm font-medium">4.8</span>
                          </div>
                        </div>

                        <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-1">{material.title}</h3>
                        <p className="text-gray-600 mb-3 line-clamp-2">{material.description}</p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className="inline-flex items-center text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                            <Tag className="w-3 h-3 mr-1" />
                            pembelajaran
                          </span>
                          <span className="inline-flex items-center text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                            <Tag className="w-3 h-3 mr-1" />
                            interaktif
                          </span>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <User className="w-4 h-4" />
                              <span>{material.author.name}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>Jakarta</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(material.createdAt).toLocaleDateString("id-ID")}</span>
                            </div>
                            <span className="text-gray-400">•</span>
                            <span>{formatFileSize(material.fileSize)}</span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <Eye className="w-4 h-4" />
                              <span>245</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Download className="w-4 h-4" />
                              <span>{material.downloadCount}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          {/* Load More */}
          {sortedResources.length > 0 && (
            <div className="text-center mt-8">
              <Button variant="outline" size="lg">
                Muat Lebih Banyak
              </Button>
            </div>
          )}

          {/* Empty State */}
          {sortedResources.length === 0 && (
            <Card className="p-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada materi ditemukan</h3>
              <p className="text-gray-600 mb-6">
                Coba ubah filter pencarian atau{" "}
                <Link href="/library/upload" className="text-green-600 hover:text-green-700 font-medium">
                  bagikan materi pertama Anda
                </Link>
              </p>
            </Card>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
