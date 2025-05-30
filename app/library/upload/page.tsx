"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Upload, X, FileText, ImageIcon, File } from "lucide-react"
import AuthenticatedLayout from "@/components/authenticated-layout"

export default function UploadResourcePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "",
    level: "",
    tags: [] as string[],
    file: null as File | null,
  })
  const [newTag, setNewTag] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Mock submission
    setTimeout(() => {
      router.push("/library")
    }, 1500)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({ ...formData, file })
    }
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, newTag.trim()] })
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((tag) => tag !== tagToRemove) })
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return ImageIcon
    if (file.type.includes("pdf")) return FileText
    return File
  }

  return (
    <AuthenticatedLayout>
      <div className="p-8 max-w-4xl mx-auto">
        <Card className="border-0 shadow-lg bg-white">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-800">Upload Resource</CardTitle>
            <CardDescription>Bagikan materi pembelajaran dengan komunitas</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Judul Resource *</Label>
                <Input
                  id="title"
                  placeholder="Masukkan judul yang jelas dan deskriptif"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="border-gray-200 focus:border-blue-500"
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi *</Label>
                <Textarea
                  id="description"
                  placeholder="Jelaskan isi dan kegunaan resource ini"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="min-h-[120px] border-gray-200 focus:border-blue-500"
                  required
                />
              </div>

              {/* Subject and Level */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Mata Pelajaran *</Label>
                  <Select
                    value={formData.subject}
                    onValueChange={(value) => setFormData({ ...formData, subject: value })}
                  >
                    <SelectTrigger className="border-gray-200 focus:border-blue-500">
                      <SelectValue placeholder="Pilih mata pelajaran" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="matematika">Matematika</SelectItem>
                      <SelectItem value="bahasa-indonesia">Bahasa Indonesia</SelectItem>
                      <SelectItem value="ipa">IPA</SelectItem>
                      <SelectItem value="ips">IPS</SelectItem>
                      <SelectItem value="bahasa-inggris">Bahasa Inggris</SelectItem>
                      <SelectItem value="seni">Seni</SelectItem>
                      <SelectItem value="olahraga">Olahraga</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Jenjang Pendidikan *</Label>
                  <Select value={formData.level} onValueChange={(value) => setFormData({ ...formData, level: value })}>
                    <SelectTrigger className="border-gray-200 focus:border-blue-500">
                      <SelectValue placeholder="Pilih jenjang" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paud">PAUD</SelectItem>
                      <SelectItem value="sd">SD</SelectItem>
                      <SelectItem value="smp">SMP</SelectItem>
                      <SelectItem value="sma">SMA</SelectItem>
                      <SelectItem value="universitas">Universitas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Tambah tag (tekan Enter)"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    className="border-gray-200 focus:border-blue-500"
                  />
                  <Button type="button" onClick={addTag} variant="outline">
                    Tambah
                  </Button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
                        <span>{tag}</span>
                        <button type="button" onClick={() => removeTag(tag)} className="ml-1">
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* File Upload */}
              <div className="space-y-2">
                <Label>File Resource *</Label>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-6">
                  {formData.file ? (
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                        {(() => {
                          const FileIcon = getFileIcon(formData.file)
                          return <FileIcon className="w-6 h-6 text-white" />
                        })()}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{formData.file.name}</p>
                        <p className="text-sm text-gray-500">{(formData.file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setFormData({ ...formData, file: null })}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">Upload file resource</p>
                      <p className="text-sm text-gray-500 mb-4">PDF, Word, PowerPoint, gambar, atau video (Max 50MB)</p>
                      <Input
                        type="file"
                        accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.mp4,.mov"
                        onChange={handleFileChange}
                        className="hidden"
                        id="file-upload"
                        required
                      />
                      <Label htmlFor="file-upload">
                        <Button type="button" variant="outline" asChild>
                          <span>Pilih File</span>
                        </Button>
                      </Label>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex space-x-4 pt-6">
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800"
                  disabled={isLoading}
                >
                  {isLoading ? "Mengupload..." : "Upload Resource"}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Batal
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  )
}
