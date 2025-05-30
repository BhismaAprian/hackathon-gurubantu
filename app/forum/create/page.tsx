// app/forum/create/page.tsx
"use client";

import UserLayout from "@/components/layout/UserLayout";
import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ThreadForm, threadFormSchema } from "./schema";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, X } from "lucide-react";
import { MultiSelect } from "@/components/multi-select";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { useEffect } from "react";
import { redirect } from "next/navigation";


export default function CreateThreadPage() {
  const {session} = useAuth();
  

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<ThreadForm>({
    resolver: zodResolver(threadFormSchema),
    defaultValues: {
      title: "",
      content: "",
      tags: [],
      slug: "",
      author_id: "",
      category_id: "",
      // attechment_url: ""
    }
  });


  useEffect(() => {
    if (session?.user.id) {
      setValue("author_id", session.user.id);
    }
  }, [session]);


  console.log("errors", errors);
  async function onSubmit(v: ThreadForm) {
    if(!session?.user.id) {
      toast.error("Anda harus login untuk membuat thread");
      return;
    }

    const slug = v.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "") // Remove special characters except spaces and hyphens
        .replace(/\s+/g, "-") // Replace spaces with hyphens
        .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
        .replace(/(^-|-$)/g, "") // Remove leading/trailing hyphens

    v.slug = slug;
    v.author_id = session.user.id
    

    const {data: thread_data, error} = await supabase.from("threads").insert({
      title: v.title,
      content: v.content,
      slug: slug,
      author_id: session.user.id,
      category_id: v.category_id,
    })
    .select()
    .single();

    if (error) {
      console.error("Error creating thread:", error);
      return;
    }

    v.tags.map(async(tag) => {
      await supabase.from("thread_tags").upsert({
        thread_id: thread_data.id,
        tag_id: tag // Assuming tag is a string
      })
    });

    redirect("/forum")
    toast.success("Thread created successfully!");
  }

  return (
    <UserLayout>
      <div className="container p-8 bg-white rounded-lg font-jakarta">
        <h1 className="text-3xl font-bold text-gray-800">Buat Postingan Baru</h1>
        <p className="text-gray-600 mt-2">Bagikan pengalaman, pertanyaan, atau diskusi dengan komunitas</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          {/* Title */}
          <div className="flex flex-col gap-2">
            <label htmlFor="title" className="text-sm font-semibold text-gray-700">Judul Postingan</label>
            <Input 
              type="text" 
              id="title"
              placeholder="Masukkan judul postingan"
              className="border border-gray-200"
              {...register("title")}
              required
            />
            {errors.title?.message && (
              <p className="text-xs font-medium text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <Label>Mata Pelajaran</Label>
            <Controller
              render={({ field }) => (
                <Select 
                  onValueChange={(field.onChange)} 
                  value={field.value}
                >
                  <SelectTrigger  className="w-full border-gray-200 focus:border-blue-500">
                    <SelectValue placeholder="Pilih mata pelajaran" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Matematika</SelectItem>
                    <SelectItem value="2">Bahasa Indonesia</SelectItem>
                    <SelectItem value="3">IPA</SelectItem>
                    <SelectItem value="4">IPS</SelectItem>
                    <SelectItem value="5">Bahasa Inggris</SelectItem>
                    <SelectItem value="6">Umum</SelectItem>
                    {/* <SelectItem value="olahraga">Olahraga</SelectItem>
                    <SelectItem value="umum">Umum</SelectItem> */}
                  </SelectContent>
                </Select>
              )}
              name="category_id"
              control={control}
              rules={{ required: "Mata pelajaran harus dipilih" }}  
            />
            {errors.category_id?.message && (<p className="text-xs font-medium text-red-500">{errors.category_id.message}</p>)}
          </div>

          {/* Content */}
          <div className="flex flex-col gap-2">
            <label htmlFor="content" className="text-sm font-semibold text-gray-700">Konten Postingan</label>
            <Textarea 
              id="content"
              placeholder="Masukkan konten postingan"
              className="resize-none border border-gray-200 min-h-[200px]"
              {...register("content")}
              required
            />
            {errors.content?.message && (
              <p className="text-xs font-medium text-red-500">{errors.content.message}</p>
            )}
          </div>

         
          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex space-x-2">
              <Controller
                render={({ field }) => {
                  console.log(field.value);
                  return (
                    <MultiSelect 
                      options={[
                        { value: "1", label: "tips-mengajar" },
                        { value: "2", label: "kurikulum-merdeka" },
                        { value: "3", label: "pembelajaran-online" },
                        { value: "4", label: "evaluasi" },
                        { value: "5", label: "kreatif" },
                        { value: "6", label: "teknologi" }
                      ]}
                      onValueChange={(value) => field.onChange([...value])}
                      value={field.value}
                      defaultValue={[]}
                      placeholder="Pilih atau tambahkan tag"
                      animation={2}
                      maxCount={5}
                    />
                  )
                }}
                name="tags"
                control={control}
              />
            
            </div>
          </div>

          {/* File Upload */}
           <div className="space-y-2">
              <Label>Lampiran File (Opsional)</Label>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-6">
                {true ? (
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      {/* {(() => {
                        const FileIcon = getFileIcon('formData.file')
                        return <FileIcon className="w-5 h-5 text-white" />
                      })()} */}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{'formData.file.name'}</p>
                      <p className="text-sm text-gray-500">{'(formData.file.size / 1024 / 1024).toFixed(2)'} MB</p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
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
                      className="hidden"
                      id="file-upload"
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

          {/* Submit Button */}
          <Button 
            type="submit"
            className="font-semibold" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Menyimpan..." : "Buat Thread"}
          </Button>
        </form>
      </div>
    </UserLayout>
  );
}