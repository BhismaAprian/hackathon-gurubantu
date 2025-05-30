"use client";
import UserLayout from "@/components/layout/UserLayout";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ThreadForm, threadSchema } from "./schema";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function CreateThreadPage() {

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ThreadForm>({
    resolver: zodResolver(threadSchema),
    defaultValues: {
      title: "",
      content: "",
      tags: [],
      slug: "",
      authorId: "",
      categoryId: ""
    }
  })
  console.log("Form errors:", errors);
  async function onSubmit(data: ThreadForm) {
    // console.log("Form submitted:", data);
    console.log('1')
  }

  return (
    <UserLayout>
      <div className="container p-8 bg-white rounded-lg font-jakarta">
        <h1 className="text-3xl font-bold text-gray-800">Buat Postingan Baru</h1>
        <p className="text-gray-600 mt-2">Bagikan pengalaman, pertanyaan, atau diskusi dengan komunitas</p>

        {/* Add your form content here */}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">

          {/* Title  */}
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
            {errors.title?.message && <p className="text-xs font-medium text-red-500">{errors.title.message}</p>}
          </div>

          {/* Content */}
          <div className="flex flex-col gap-2">
            <label htmlFor="content" className="text-sm font-semibold text-gray-700">Konten Postingan</label>
            <Textarea 
              id="content"
              placeholder="Masukkan konten postingan"
              className="resize-none border border-gray-200"
              {...register("content")}
              required
            />
            {errors.content?.message && <p className="text-xs font-medium text-red-500">{errors.content.message}</p>}
          </div>

          {/* Tags */}
          <Button className="cursor-pointer w-full bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200" type="submit">
            Submit
          </Button>
        </form>
      </div>
    </UserLayout>
  );
}