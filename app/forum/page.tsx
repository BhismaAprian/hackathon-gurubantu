import UserLayout from "@/components/layout/UserLayout";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowBigDownDash, ArrowBigUpDash, MessageSquareText, Plus } from "lucide-react";
import Link from "next/link";
import { Thread } from "./create/schema";
import { createClient } from "@/utils/supabase/server";
import { formatDate } from "@/utils/format-date";

export default async function ForumPage() {

  const supabase = await createClient();
  const { data, error } = await supabase
  .from("threads")
  .select(`
    *,
    author:author_id (
      full_name
    ),
    thread_tags (
      tag:tag_id (
        name
      )
    )
  `)
  .order("created_at", { ascending: false });



  console.log("data", data);
  
  return (
    <UserLayout>
      <div className="container p-8 bg-white rounded-lg h-screen overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between">

          {/* Title */}
          <h1 className="text-4xl font-bold mb-4 font-jakarta">#General Discussion</h1>

          {/* Action */}
          <Button asChild className="bg-gray-900 text-white font-semibold font-jakarta cursor-pointer">
            <Link href="/forum/create">
              <Plus size={20}/>
              Buat Postingan
            </Link>
          </Button>
        </div>

        {/* Discussion */}
        <div className="mt-10 flex flex-col gap-6">

          {data?.map((thread: Thread) => {
            return (
                <div key={thread.id} className="px-5 py-7 bg-white rounded-lg border border-gray-200">

                  {/* Header */}
                  <Link href={`/forum/thread/slug=${thread.slug}&id=${thread.id}`} className="cursor-pointer">
                    <div className="cursor-pointer header flex items-start justify-between mb-4">
                      {/* Profile */}
                      <div className="flex items-center gap-4">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src="./image.png"/>
                        </Avatar>
                        <div className="flex flex-col font-jakarta -pace-y-1">
                          <h2 className="text-lg font-semibold text-gray-800">{thread.author.full_name}</h2>
                          <p className="text-sm font-semibold text-gray-500">Institut Teknologi Kalimantan</p>
                        </div>
                      </div>
                      {/* Date */}
                      <div className="font-geist text-sm font-medium text-gray-500">
                        <p>{formatDate(thread.created_at)}</p>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col gap-2 my-6">
                      <h3 className="text-3xl font-bold font-jakarta">{thread.title}</h3>
                      <p className="font-geist text-base font-medium">{thread.content}</p>
                    </div>
                  </Link>

                  {/* Action */}
                  <div className="flex items-center justify-between font-jakarta">

                    {/* Vote */}
                    <div className="flex items-center gap-4">
                      <button className="flex items-center font-semibold gap-4">
                        <ArrowBigUpDash color="#4755F1" />
                        {/* {threa} */}
                      </button>
                      <button className="flex items-center font-semibold gap-4">
                        <ArrowBigDownDash color="#FF0000" />
                        Downvote
                      </button>
                    </div>

                    {/* Reply */}
                    <button className="flex items-center font-semibold gap-2">
                      <MessageSquareText size={20} />
                        Balasan
                    </button>
                  
                  </div>
                </div>
            )
          })}

        </div>
      </div>
    </UserLayout>
  );
}