import Link from "next/link"
import { Button } from "@/components/ui/button"
import { UserX, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="bg-white rounded-lg p-8 min-h-full">
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-gray-400 mb-6">
          <UserX className="w-24 h-24" />
        </div>
        <h1 className="text-3xl font-bold font-jakarta text-gray-900 mb-4">User Not Found</h1>
        <p className="text-gray-600 font-geist text-center mb-8 max-w-md">
          The user profile you're looking for doesn't exist or may have been removed.
        </p>
        <Button asChild className="font-jakarta">
          <Link href="/dashboard" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
    </div>
  )
}
