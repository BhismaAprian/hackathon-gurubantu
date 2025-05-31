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
import Dropzone from "react-dropzone"
import {v4 as uuidv4} from "uuid";

interface FileWithPreview extends File {
  preview?: string
  id: string
  uploadProgress: number
  status: "uploading" | "success" | "error" | "processing"
  processedUrl?: string
  error?: string
}

export default function CreateThreadPage() {
  const { session } = useAuth()
  const [file, setFile] = useState<string | null>(null)

  const {
    register,
    control,
    handleSubmit,
    setValue,
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
      attachment_url: "",
      attachment_name: "",
    },
  })

  useEffect(() => {
    if (session?.user.id) {
      setValue("author_id", session.user.id)
    }
  }, [session, setValue])



  async function onSubmit(v: ThreadForm) {
    if (!session?.user.id) {
      toast.error("Anda harus login untuk membuat thread")
      return
    }

    const slug = v.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/(^-|-$)/g, "")

    const file = v.attachment_url as FileWithPreview | string
    if (typeof file === "string") {
      v.attachment_url = file
    }
    
    if (file instanceof File) {
      const fileExt = `forum-attachments/${file.name.split(".").pop()}`
      const filePath = `forum-attachments/${uuidv4()}.${fileExt}`;

      const { error: upload } = await supabase.storage
        .from("forum-attachments")
        .upload(filePath, v.attachment_url)

        if (upload) {
          console.error("Error uploading file:", upload)
          toast.error("Failed to upload attachment")
          return
        }

        const {data: publicUrlData} = supabase.storage
          .from("forum-attachments")
          .getPublicUrl(filePath)

        v.attachment_url = publicUrlData.publicUrl
        v.slug = slug
        v.author_id = session.user.id
          
    
        const { data: thread_data, error } = await supabase
          .from("threads")
          .insert({
            title: v.title,
            content: v.content,
            slug: slug,
            author_id: session.user.id,
            category_id: v.category_id,
            attachment_url: v.attachment_url,
            attachment_name: file
          })
          .select()
          .single()
    
        if (error) {
          console.error("Error creating thread:", error)
          toast.error("Failed to create thread")
          return
        }
    
        // Add tags
        const tagPromises = v.tags.map(async (tag) => {
          await supabase.from("thread_tags").upsert({
            thread_id: thread_data.id,
            tag_id: tag,
          })
        })
    
        await Promise.all(tagPromises)
    
        toast.success("Thread created successfully!")
        redirect("/forum")
    }



  }

  const handleImageChange = (data: File) => {
    setFile(URL.createObjectURL(data))
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
          </div>

          {/* Enhanced File Upload */}
          <div className="space-y-2">
            <Label>Lampiran File (Opsional)</Label>
            <Controller
              render={({field}) => {
                console.log("File field:", field.value)
                return (
                  <Dropzone
                    onDrop={(acceptedFiles) => {
                      const file = acceptedFiles[0] as File
                      field.onChange(acceptedFiles[0])
                      handleImageChange(file)
                    }}
                  >
                    {({getRootProps, getInputProps}) => (
                      <div
                        {...getRootProps()}
                        className="relative rounded-md h-[18rem] w-full overflow-auto grid place-content-center cursor-pointer px-4 py-8 border border-dashed group-focus:border-primary-500 mx-auto"
                      >
                        {file ? (
                          <img
                            className="object-cover rounded-md"
                            src={file}
                            alt="attachment preview"
                          />
                        ) : (
                          <div className="space-y-1 text-center">
                            <input id="book-image" type="file" {...getInputProps()}/>
                            <svg
                              className='mx-auto h-12 w-12 text-gray-400'
                              stroke='currentColor'
                              fill='none'
                              viewBox='0 0 48 48'
                              aria-hidden='true'
                            >
                              <path
                                d='M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02'
                                strokeWidth={2}
                                strokeLinecap='round'
                                strokeLinejoin='round'
                              />
                            </svg>
                            <p className="text-sm text-gray-500">
                              Drag and drop cover book here, or click to choose file
                            </p>
                          </div>
                        )}
                      </div>

                    )}
                  </Dropzone>
                )
              }}
              key={file}
              control={control}
              name="attachment_url"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="font-semibold w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Menyimpan..." : "Buat Thread"}
          </Button>
        </form>
      </div>
    </UserLayout>
  )
}
