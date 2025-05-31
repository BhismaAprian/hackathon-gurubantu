"use client"

import UserLayout from "@/components/layout/UserLayout"
import { Input } from "@/components/ui/input"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { type ThreadForm, threadFormSchema } from "./schema"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MultiSelect } from "@/components/multi-select"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"
import { useEffect, useState } from "react"
import { redirect } from "next/navigation"
import FileAttachmentDropzone from "@/components/file-upload-dropzone"
import { v4 as uuidv4 } from "uuid"

export default function CreateThreadPage() {
  const { session } = useAuth()
  const [isUploading, setIsUploading] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ThreadForm>({
    resolver: zodResolver(threadFormSchema),
    defaultValues: {
      title: "",
      content: "",
      tags: [],
      slug: "",
      author_id: "",
      category_id: "",
      attachment_url: undefined,
      attachment_name: "",
    },
  })

  useEffect(() => {
    if (session?.user.id) {
      setValue("author_id", session.user.id)
    }
  }, [session, setValue])

  const handleFileChange = (file: File | null) => {
    setValue("attachment_url", file || undefined)
  }

  const handleFileNameChange = (name: string | null) => {
    setValue("attachment_name", name || "")
  }

  async function onSubmit(v: ThreadForm) {
    if (!session?.user.id) {
      toast.error("Anda harus login untuk membuat thread")
      return
    }

    try {
      setIsUploading(true)

      const slug = v.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/(^-|-$)/g, "")

      let attachmentUrl = ""

      // Handle file upload if present
      if (v.attachment_url instanceof File) {
        const file = v.attachment_url
        const fileExt = file.name.split(".").pop()
        const filePath = `forum-attachments/${uuidv4()}.${fileExt}`

        const { error: uploadError } = await supabase.storage.from("forum-attachments").upload(filePath, file)

        if (uploadError) {
          console.error("Error uploading file:", uploadError)
          toast.error("Failed to upload attachment")
          setIsUploading(false)
          return
        }

        const { data: publicUrlData } = supabase.storage.from("forum-attachments").getPublicUrl(filePath)

        attachmentUrl = publicUrlData.publicUrl
      }

      // Create thread
      const { data: thread_data, error } = await supabase
        .from("threads")
        .insert({
          title: v.title,
          content: v.content,
          slug: slug,
          author_id: session.user.id,
          category_id: v.category_id,
          attachment_url: attachmentUrl || null,
          attachment_name: v.attachment_name || null,
        })
        .select()
        .single()

      if (error) {
        console.error("Error creating thread:", error)
        toast.error("Failed to create thread")
        setIsUploading(false)
        return
      }

      // Add tags
      if (v.tags && v.tags.length > 0) {
        const tagPromises = v.tags.map(async (tag) => {
          await supabase.from("thread_tags").upsert({
            thread_id: thread_data.id,
            tag_id: tag,
          })
        })

        await Promise.all(tagPromises)
      }

      toast.success("Thread created successfully!")
      setIsUploading(false)
      redirect("/forum")
    } catch (error) {
      console.error("Error in form submission:", error)
      toast.error("An unexpected error occurred")
      setIsUploading(false)
    }
  }

  return (
    <UserLayout>
      <div className="container p-8 bg-white rounded-lg font-jakarta">
        <h1 className="text-3xl font-bold text-gray-800">Buat Postingan Baru</h1>
        <p className="text-gray-600 mt-2">Bagikan pengalaman, pertanyaan, atau diskusi dengan komunitas</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
          {/* Title */}
          <div className="flex flex-col gap-2">
            <label htmlFor="title" className="text-sm font-semibold text-gray-700">
              Judul Postingan
            </label>
            <Input
              type="text"
              id="title"
              placeholder="Masukkan judul postingan"
              className="border border-gray-200"
              {...register("title")}
              required
            />
            {errors.title?.message && <p className="text-xs font-medium text-red-500">{errors.title.message}</p>}
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <Label>Mata Pelajaran</Label>
            <Controller
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full border-gray-200 focus:border-blue-500">
                    <SelectValue placeholder="Pilih mata pelajaran" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Matematika</SelectItem>
                    <SelectItem value="2">Bahasa Indonesia</SelectItem>
                    <SelectItem value="3">IPA</SelectItem>
                    <SelectItem value="4">IPS</SelectItem>
                    <SelectItem value="5">Bahasa Inggris</SelectItem>
                    <SelectItem value="6">Umum</SelectItem>
                  </SelectContent>
                </Select>
              )}
              name="category_id"
              control={control}
              rules={{ required: "Mata pelajaran harus dipilih" }}
            />
            {errors.category_id?.message && (
              <p className="text-xs font-medium text-red-500">{errors.category_id.message}</p>
            )}
          </div>

          {/* Content */}
          <div className="flex flex-col gap-2">
            <label htmlFor="content" className="text-sm font-semibold text-gray-700">
              Konten Postingan
            </label>
            <Textarea
              id="content"
              placeholder="Masukkan konten postingan"
              className="resize-none border border-gray-200 min-h-[200px]"
              {...register("content")}
              required
            />
            {errors.content?.message && <p className="text-xs font-medium text-red-500">{errors.content.message}</p>}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <Controller
              render={({ field }) => (
                <MultiSelect
                  options={[
                    { value: "1", label: "tips-mengajar" },
                    { value: "2", label: "kurikulum-merdeka" },
                    { value: "3", label: "pembelajaran-online" },
                    { value: "4", label: "evaluasi" },
                    { value: "5", label: "kreatif" },
                    { value: "6", label: "teknologi" },
                  ]}
                  onValueChange={(value) => field.onChange([...value])}
                  value={field.value}
                  defaultValue={[]}
                  placeholder="Pilih atau tambahkan tag"
                  animation={2}
                  maxCount={5}
                />
              )}
              name="tags"
              control={control}
            />
            {errors.tags?.message && <p className="text-xs font-medium text-red-500">{errors.tags.message}</p>}
          </div>

          {/* File Attachment */}
          <div className="space-y-2">
            <Label>Lampiran File (Opsional)</Label>
            <Controller
              render={({ field }) => (
                <FileAttachmentDropzone
                  value={field.value}
                  onChange={handleFileChange}
                  onNameChange={handleFileNameChange}
                  maxSize={10 * 1024 * 1024} // 10MB
                />
              )}
              control={control}
              name="attachment_url"
            />
          </div>

          {/* Submit Button */}
          <Button type="submit" className="font-semibold w-full" disabled={isSubmitting || isUploading}>
            {isSubmitting || isUploading ? "Menyimpan..." : "Buat Thread"}
          </Button>
        </form>
      </div>
    </UserLayout>
  )
}
