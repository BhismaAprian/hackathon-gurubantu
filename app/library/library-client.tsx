"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Download, Eye, FileText, ImageIcon, Video, Music, Archive, Filter, SortDesc } from "lucide-react"
import Link from "next/link"

// Type definition for library material
interface LibraryMaterial {
  id: string
  user_id: string
  title: string
  description: string
  file_url: string
  file_name: string
  file_size: number
  file_type: string
  subject: string
  education_level: string
  curriculum: string
  tags: string[]
  learning_objectives: string
  download_count: number
  view_count: number
  created_at: string
}

interface LibraryClientProps {
  initialMaterials: LibraryMaterial[]
}

// Helper functions
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

const getFileTypeIcon = (fileType: string) => {
  switch (fileType.toLowerCase()) {
    case "pdf":
      return <FileText className="w-5 h-5 text-red-500" />
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
      return <ImageIcon className="w-5 h-5 text-green-500" />
    case "mp4":
    case "avi":
    case "mov":
      return <Video className="w-5 h-5 text-blue-500" />
    case "mp3":
    case "wav":
      return <Music className="w-5 h-5 text-purple-500" />
    case "zip":
    case "rar":
      return <Archive className="w-5 h-5 text-orange-500" />
    default:
      return <FileText className="w-5 h-5 text-gray-500" />
  }
}

const getFileTypeColor = (fileType: string): string => {
  switch (fileType.toLowerCase()) {
    case "pdf":
      return "bg-red-100 text-red-800"
    case "pptx":
    case "ppt":
      return "bg-orange-100 text-orange-800"
    case "docx":
    case "doc":
      return "bg-blue-100 text-blue-800"
    case "xlsx":
    case "xls":
      return "bg-green-100 text-green-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

// Client Component - handles all interactive UI
export default function LibraryClient({ initialMaterials }: LibraryClientProps) {
  const [materials] = useState<LibraryMaterial[]>(initialMaterials)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("all")
  const [selectedEducationLevel, setSelectedEducationLevel] = useState("all")
  const [sortBy, setSortBy] = useState("recent")
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())

  // Get unique subjects and education levels for filters
  const subjects = useMemo(() => [...new Set(materials.map((item) => item.subject))], [materials])
  const educationLevels = useMemo(() => [...new Set(materials.map((item) => item.education_level))], [materials])

  // Filter and sort materials
  const filteredMaterials = useMemo(() => {
    const filtered = materials.filter((material) => {
      const matchesSearch =
        searchQuery === "" ||
        material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        material.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        material.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        material.education_level.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesSubject = selectedSubject === "all" || material.subject === selectedSubject
      const matchesEducationLevel =
        selectedEducationLevel === "all" || material.education_level === selectedEducationLevel

      return matchesSearch && matchesSubject && matchesEducationLevel
    })

    // Sort materials
    switch (sortBy) {
      case "recent":
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        break
      case "popular":
        filtered.sort((a, b) => b.view_count - a.view_count)
        break
      case "downloads":
        filtered.sort((a, b) => b.download_count - a.download_count)
        break
      case "title":
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
    }

    return filtered
  }, [materials, searchQuery, selectedSubject, selectedEducationLevel, sortBy])

  const toggleCardExpansion = (cardId: string) => {
    setExpandedCards((prev) => {
      const newExpanded = new Set(prev)
      if (newExpanded.has(cardId)) {
        newExpanded.delete(cardId)
      } else {
        newExpanded.add(cardId)
      }
      return newExpanded
    })
  }

  const truncateText = (text: string, maxLength = 150) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  return (
    <div className="bg-white rounded-lg p-8 min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
          <Button asChild className="bg-gray-900 text-white font-semibold font-jakarta">
              <Link href="/library/upload">
                <Plus className="mr-2" size={20} />
                Upload Materi
              </Link>
            </Button>
        <h1 className="text-4xl font-bold font-jakarta text-gray-900">📚 Library</h1>
        <div className="text-sm font-geist text-gray-500">{filteredMaterials.length} materials found</div>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search by title, subject, tags, or education level..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 text-base font-geist"
          />
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-semibold font-jakarta text-gray-700">Filters:</span>
          </div>

          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Subjects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              {subjects.map((subject) => (
                <SelectItem key={subject} value={subject}>
                  {subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedEducationLevel} onValueChange={setSelectedEducationLevel}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              {educationLevels.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2 ml-auto">
            <SortDesc className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-semibold font-jakarta text-gray-700">Sort by:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="popular">Most Viewed</SelectItem>
                <SelectItem value="downloads">Most Downloaded</SelectItem>
                <SelectItem value="title">Title A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMaterials.map((material) => {
          const isExpanded = expandedCards.has(material.id)
          const shouldTruncate = material.description.length > 150

          return (
            <Card key={material.id} className="hover:shadow-lg transition-shadow duration-200 border border-gray-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-bold font-jakarta text-gray-900 leading-tight">
                      <Link href={`/library/${material.id}`} className="hover:text-blue-600 transition-colors">
                        {material.title}
                      </Link>
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs font-semibold">
                        {material.subject}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {material.education_level}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">{getFileTypeIcon(material.file_type)}</div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <CardDescription className="text-sm font-geist text-gray-600 mb-4 leading-relaxed">
                  {isExpanded || !shouldTruncate ? material.description : truncateText(material.description)}
                  {shouldTruncate && (
                    <button
                      onClick={() => toggleCardExpansion(material.id)}
                      className="text-blue-600 hover:text-blue-800 ml-1 font-semibold"
                    >
                      {isExpanded ? "Show less" : "Read more"}
                    </button>
                  )}
                </CardDescription>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {material.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs px-2 py-1">
                      #{tag}
                    </Badge>
                  ))}
                  {material.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs px-2 py-1">
                      +{material.tags.length - 3} more
                    </Badge>
                  )}
                </div>

                {/* File Info */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4 text-sm text-gray-500 font-geist">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{material.view_count.toLocaleString()}</span>
                    </div>
                  </div>
                  <Badge className={`text-xs ${getFileTypeColor(material.file_type)}`}>
                    {material.file_type.toUpperCase()}
                  </Badge>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 font-semibold font-jakarta"
                    onClick={() => window.open(material.file_url, "_blank")}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 font-semibold font-jakarta" asChild>
                    <Link href={`/library/${material.id}`}>
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Link>
                  </Button>
                </div>

                {/* Upload Date */}
                <div className="text-xs text-gray-400 font-geist mt-3 text-center">
                  Uploaded {new Date(material.created_at).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredMaterials.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold font-jakarta text-gray-600 mb-2">No materials found</h3>
          <p className="text-gray-500 font-geist">
            Try adjusting your search terms or filters to find what you're looking for.
          </p>
        </div>
      )}
    </div>
  )
}
