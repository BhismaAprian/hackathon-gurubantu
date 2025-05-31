import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MessageSquareX, ArrowLeft } from "lucide-react"
import UserLayout from "@/components/layout/UserLayout"

export default function NotFound() {
  return (
    <UserLayout>
      <div className="container p-8 bg-white rounded-lg h-screen overflow-y-auto">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="text-gray-400 mb-6">
            <MessageSquareX className="w-24 h-24" />
          </div>
          <h1 className="text-3xl font-bold font-jakarta text-gray-900 mb-4">Thread Tidak Ditemukan</h1>
          <p className="text-gray-600 font-geist text-center mb-8 max-w-md">
            Thread forum yang Anda cari tidak ada atau mungkin telah dihapus.
          </p>
          <Button asChild className="font-jakarta bg-gray-900 text-white">
            <Link href="/forum" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Forum
            </Link>
          </Button>
        </div>
      </div>
    </UserLayout>
  )
}
