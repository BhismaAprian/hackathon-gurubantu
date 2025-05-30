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
import { usePosts } from "@/hooks/use-posts"
import { useAuth } from "@/hooks/use-auth"
import { uploadFile, getPublicUrl, STORAGE_BUCKETS, supabase } from "@/lib/supabase"
import { toast } from "@/hooks/use-toast"

export default function CreateThreadPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { createPost, loading: postsLoading } = usePosts()

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    subject: "",
    tags: [] as string[],
    file: null as File | null,
  })
  const [newTag, setNewTag] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    console.log("=== FORM SUBMISSION STARTED ===")
    console.log("User:", user)
    console.log("Form Data:", formData)

    if (!user) {
      console.error("No user found")
      toast({
        title: "Error",
        description: "Anda harus login untuk membuat thread",
        variant: "destructive",
      })
      return
    }

    if (!formData.title.trim() || !formData.content.trim()) {
      console.error("Title or content is empty")
      toast({
        title: "Error",
        description: "Judul dan konten harus diisi",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      let attachmentUrl = ""
      let attachmentName = ""

      // Upload file if exists
      if (formData.file) {
        console.log("Uploading file:", formData.file.name)
        try {
          const filePath = `${user.id}/${Date.now()}-${formData.file.name}`
          const uploadResult = await uploadFile(STORAGE_BUCKETS.FORUM_ATTACHMENTS, filePath, formData.file)
          console.log("File upload result:", uploadResult)

          attachmentUrl = getPublicUrl(STORAGE_BUCKETS.FORUM_ATTACHMENTS, filePath)
          attachmentName = formData.file.name
          console.log("File uploaded successfully:", { attachmentUrl, attachmentName })
        } catch (uploadError) {
          console.error("File upload error:", uploadError)
          toast({
            title: "Error",
            description: "Gagal mengupload file",
            variant: "destructive",
          })
          setIsLoading(false)
          return
        }
      }

      // Get category_id based on subject
      const getCategoryId = (subject: string) => {
        const categoryMap: Record<string, number> = {
          matematika: 1,
          "bahasa-indonesia": 2,
          ipa: 3,
          ips: 4,
          "bahasa-inggris": 5,
          seni: 6,
          olahraga: 7,
          umum: 8,
        }
        return categoryMap[subject] || null
      }

      // Create slug from title
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "") // Remove special characters except spaces and hyphens
        .replace(/\s+/g, "-") // Replace spaces with hyphens
        .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
        .replace(/(^-|-$)/g, "") // Remove leading/trailing hyphens

      // Prepare post data according to database schema
      const postData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        author_id: user.id,
        status: "published" as const,
        slug: slug,
        category_id: formData.subject ? getCategoryId(formData.subject) : null,
        attachment_url: attachmentUrl || null,
        attachment_name: attachmentName || null,
        is_pinned: false,
        is_solved: false,
        has_ai_responded: false,
        view_count: 0,
        like_count: 0,
        reply_count: 0,
      }

      console.log("Post data to be inserted:", postData)

      // Try direct Supabase insert first for debugging
      console.log("Attempting direct Supabase insert...")
      const { data: directInsertData, error: directInsertError } = await supabase
        .from("posts")
        .insert([postData])
        .select()
        .single()

      if (directInsertError) {
        console.error("Direct Supabase insert error:", directInsertError)
        throw directInsertError
      }

      console.log("Direct insert successful:", directInsertData)

      // If direct insert works, the issue might be with the hook
      // Let's also try the hook method
      try {
        console.log("Attempting hook-based insert...")
        const hookResult = await createPost(postData)
        console.log("Hook insert successful:", hookResult)
      } catch (hookError) {
        console.error("Hook insert error:", hookError)
        // Continue with direct insert result if hook fails
      }

      toast({
        title: "Berhasil!",
        description: "Thread berhasil dibuat",
      })

      // Use the direct insert result for navigation
      router.push(`/forum/thread/${directInsertData.id}`)
    } catch (error) {
      console.error("=== FORM SUBMISSION ERROR ===")
      console.error("Error details:", error)
      console.error("Error message:", error instanceof Error ? error.message : "Unknown error")

      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Gagal membuat thread",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      console.log("=== FORM SUBMISSION ENDED ===")
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "Ukuran file maksimal 10MB",
          variant: "destructive",
        })
        return
      }
      console.log("File selected:", file.name, file.size)
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

  // Debug: Check if user is loaded
  console.log("Current user state:", user)
  console.log("Posts loading state:", postsLoading)
  console.log("Form loading state:", isLoading)

  return (
    <AuthenticatedLayout>
      <div className="p-8 max-w-4xl mx-auto">
        <Card className="border-0 shadow-lg bg-white">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-800">Buat Thread Baru</CardTitle>
            <CardDescription>Bagikan pengalaman, pertanyaan, atau diskusi dengan komunitas</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Judul Thread *</Label>
                <Input
                  id="title"
                  placeholder="Masukkan judul yang menarik dan deskriptif"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="border-gray-200 focus:border-blue-500"
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Subject */}
              <div className="space-y-2">
                <Label>Mata Pelajaran</Label>
                <Select
                  value={formData.subject}
                  onValueChange={(value) => setFormData({ ...formData, subject: value })}
                  disabled={isLoading}
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
                    <SelectItem value="umum">Umum</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Content */}
              <div className="space-y-2">
                <Label htmlFor="content">Konten Thread *</Label>
                <Textarea
                  id="content"
                  placeholder="Tulis konten thread Anda di sini. Jelaskan dengan detail agar mudah dipahami oleh komunitas."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="min-h-[200px] border-gray-200 focus:border-blue-500"
                  required
                  disabled={isLoading}
                />
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
                <Label>Lampiran File (Opsional)</Label>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-6">
                  {formData.file ? (
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                        {(() => {
                          const FileIcon = getFileIcon(formData.file)
                          return <FileIcon className="w-5 h-5 text-white" />
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
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">Upload file pendukung</p>
                      <p className="text-sm text-gray-500 mb-4">PDF, Word, PowerPoint, atau gambar (Max 10MB)</p>
                      <Input
                        type="file"
                        accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png"
                        onChange={handleFileChange}
                        className="hidden"
                        id="file-upload"
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
                  className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Memposting...
                    </>
                  ) : (
                    "Posting Thread"
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
