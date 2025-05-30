"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Download, FileText, Video, ImageIcon, Filter } from "lucide-react"
import AuthenticatedLayout from "@/components/authenticated-layout"
import { mockResources } from "@/lib/mock-data"

export default function LibraryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedSubject, setSelectedSubject] = useState("all")

  const getFileIcon = (type: string) => {
    switch (type) {
      case "video":
        return Video
      case "image":
        return ImageIcon
      default:
        return FileText
    }
  }

  const filteredResources = mockResources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType === "all" || resource.type === selectedType
    const matchesSubject = selectedSubject === "all" || resource.subject.toLowerCase() === selectedSubject.toLowerCase()

    return matchesSearch && matchesType && matchesSubject
  })

  return (
    <AuthenticatedLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Perpustakaan Digital</h1>
            <p className="text-gray-600">Koleksi sumber daya pembelajaran untuk mendukung kegiatan mengajar</p>
          </div>
          <Link href="/library/upload">
            <Button className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 mt-4 md:mt-0">
              <Plus className="w-4 h-4 mr-2" />
              Upload Resource
            </Button>
          </Link>
        </div>

        {/* Search and Filters */}
        <Card className="border-0 shadow-lg bg-white mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Cari resource, judul, atau deskripsi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-gray-200 focus:border-blue-500"
                />
              </div>
              <div className="flex gap-2">
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-32 border-gray-200">
                    <SelectValue placeholder="Tipe File" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="doc">DOC</SelectItem>
                    <SelectItem value="ppt">PPT</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="image">Gambar</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger className="w-40 border-gray-200">
                    <SelectValue placeholder="Mata Pelajaran" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua</SelectItem>
                    <SelectItem value="matematika">Matematika</SelectItem>
                    <SelectItem value="bahasa indonesia">Bahasa Indonesia</SelectItem>
                    <SelectItem value="fisika">Fisika</SelectItem>
                    <SelectItem value="kimia">Kimia</SelectItem>
                    <SelectItem value="biologi">Biologi</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resource Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => {
            const FileIcon = getFileIcon(resource.type)
            return (
              <Card key={resource.id} className="border-0 shadow-lg bg-white hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                      <FileIcon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex space-x-2">
                      <Badge variant="outline">{resource.type.toUpperCase()}</Badge>
                      <Badge variant="secondary">{resource.level}</Badge>
                    </div>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">{resource.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{resource.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3 mb-4">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={resource.author.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="text-xs">
                        {resource.author.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{resource.author.name}</p>
                      <p className="text-xs text-gray-500">{resource.subject}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{resource.fileSize}</span>
                    <span className="flex items-center space-x-1">
                      <Download className="w-3 h-3" />
                      <span>{resource.downloadCount} downloads</span>
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Link href={`/library/resource/${resource.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        Lihat Detail
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800"
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredResources.length === 0 && (
          <Card className="border-0 shadow-lg bg-white">
            <CardContent className="p-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Tidak ada resource ditemukan</h3>
              <p className="text-gray-500 mb-4">Coba ubah filter pencarian atau upload resource baru</p>
              <Link href="/library/upload">
                <Button className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800">
                  <Plus className="w-4 h-4 mr-2" />
                  Upload Resource
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </AuthenticatedLayout>
  )
}
