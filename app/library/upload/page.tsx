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
import { Upload, X, FileText, ImageIcon, File, Loader2 } from "lucide-react"
import AuthenticatedLayout from "@/components/authenticated-layout"
import { useLibraryMaterials } from "@/hooks/use-library-materials"
import { useAuth } from "@/hooks/use-auth"
import { uploadFile, getPublicUrl, STORAGE_BUCKETS } from "@/lib/supabase"
import { toast } from "@/hooks/use-toast"

export default function UploadResourcePage() {
  const router = useRouter()
  const { user } = useAuth()
  const { createMaterial } = useLibraryMaterials()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "",
    level: "",
    curriculum: "",
    tags: [] as string[],
    learningObjectives: [] as string[],
    file: null as File | null,
  })
  const [newTag, setNewTag] = useState("")
  const [newObjective, setNewObjective] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Error",
        description: "Anda harus login untuk mengupload materi",
        variant: "destructive",
      })
      return
    }

    if (!formData.title.trim() || !formData.description.trim() || !formData.file) {
      toast({
        title: "Error",
        description: "Judul, deskripsi, dan file harus diisi",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Upload file
      const filePath = `${user.id}/${Date.now()}-${formData.file.name}`
      await uploadFile(STORAGE_BUCKETS.LIBRARY_MATERIALS, filePath, formData.file)
      const fileUrl = getPublicUrl(STORAGE_BUCKETS.LIBRARY_MATERIALS, filePath)

      // Determine file type
      const fileExtension = formData.file.name.split(".").pop()?.toLowerCase()
      let fileType = "other"

      if (["pdf"].includes(fileExtension || "")) fileType = "pdf"
      else if (["doc", "docx"].includes(fileExtension || "")) fileType = "doc"
      else if (["ppt", "pptx"].includes(fileExtension || "")) fileType = "ppt"
      else if (["jpg", "jpeg", "png", "gif"].includes(fileExtension || "")) fileType = "image"
      else if (["mp4", "mov", "avi"].includes(fileExtension || "")) fileType = "video"

      // Create the material
      const materialData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        file_url: fileUrl,
        file_name: formData.file.name,
        file_size: formData.file.size,
        file_type: fileType,
        subject: formData.subject || undefined,
        education_level: (formData.level as any) || undefined,
        curriculum: formData.curriculum || undefined,
        tags: formData.tags,
        learning_objectives: formData.learningObjectives,
        user_id: user.id,
        is_approved: false, // Requires approval
        download_count: 0,
        view_count: 0,
        rating: 0,
        rating_count: 0,
      }

      await createMaterial(materialData)

      toast({
        title: "Berhasil!",
        description: "Materi berhasil diupload dan menunggu persetujuan",
      })

      router.push("/library")
    } catch (error) {
      console.error("Error creating material:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Gagal mengupload materi",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "Ukuran file maksimal 50MB",
          variant: "destructive",
        })
        return
      }
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

  const addObjective = () => {
    if (newObjective.trim() && !formData.learningObjectives.includes(newObjective.trim())) {
      setFormData({ ...formData, learningObjectives: [...formData.learningObjectives, newObjective.trim()] })
      setNewObjective("")
    }
  }

  const removeObjective = (objectiveToRemove: string) => {
    setFormData({
      ...formData,
      learningObjectives: formData.learningObjectives.filter((obj) => obj !== objectiveToRemove),
    })
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
                  className="border-gray-200 focus:border-green-500"
                  required
                  disabled={isLoading}
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
                  className="min-h-[120px] border-gray-200 focus:border-green-500"
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Subject and Level */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Mata Pelajaran</Label>
                  <Select
                    value={formData.subject}
                    onValueChange={(value) => setFormData({ ...formData, subject: value })}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="border-gray-200 focus:border-green-500">
                      <SelectValue placeholder="Pilih mata pelajaran" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Matematika">Matematika</SelectItem>
                      <SelectItem value="Bahasa Indonesia">Bahasa Indonesia</SelectItem>
                      <SelectItem value="IPA">IPA</SelectItem>
                      <SelectItem value="IPS">IPS</SelectItem>
                      <SelectItem value="Bahasa Inggris">Bahasa Inggris</SelectItem>
                      <SelectItem value="Fisika">Fisika</SelectItem>
                      <SelectItem value="Kimia">Kimia</SelectItem>
                      <SelectItem value="Biologi">Biologi</SelectItem>
                      <SelectItem value="Seni">Seni</SelectItem>
                      <SelectItem value="Olahraga">Olahraga</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Jenjang Pendidikan</Label>
                  <Select
                    value={formData.level}
                    onValueChange={(value) => setFormData({ ...formData, level: value })}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="border-gray-200 focus:border-green-500">
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

              {/* Curriculum */}
              {/* <div className="space-y-2">
                <Label htmlFor="curriculum">Kurikulum</Label>
                <Input
                  id="curriculum"
                  placeholder="Contoh: Kurikulum Merdeka, K13, Cambridge"
                  value={formData.curriculum}
                  onChange={(e) => setFormData({ ...formData, curriculum: e.target.value })}
                  className="border-gray-200 focus:border-green-500"
                  disabled={isLoading}
                />
              </div> */}

              {/* Learning Objectives */}
              <div className="space-y-2">
                <Label>Tujuan Pembelajaran</Label>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Tambah tujuan pembelajaran"
                    value={newObjective}
                    onChange={(e) => setNewObjective(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addObjective())}
                    className="border-gray-200 focus:border-green-500"
                    disabled={isLoading}
                  />
                  <Button type="button" onClick={addObjective} variant="outline" disabled={isLoading}>
                    Tambah
                  </Button>
                </div>
                {formData.learningObjectives.length > 0 && (
                  <div className="space-y-2 mt-2">
                    {formData.learningObjectives.map((objective, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <span className="text-sm">{objective}</span>
                        <button type="button" onClick={() => removeObjective(objective)} disabled={isLoading}>
                          <X className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
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
                    className="border-gray-200 focus:border-green-500"
                    disabled={isLoading}
                  />
                  <Button type="button" onClick={addTag} variant="outline" disabled={isLoading}>
                    Tambah
                  </Button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
                        <span>{tag}</span>
                        <button type="button" onClick={() => removeTag(tag)} className="ml-1" disabled={isLoading}>
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
                      <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
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
                        disabled={isLoading}
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
                        disabled={isLoading}
                      />
                      <Label htmlFor="file-upload">
                        <Button type="button" variant="outline" asChild disabled={isLoading}>
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
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Mengupload...
                    </>
                  ) : (
                    "Upload Resource"
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
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
