import UserLayout from "@/components/layout/UserLayout"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <UserLayout>
      <div className="container p-8 bg-white rounded-lg h-screen overflow-y-auto">
        <div className="mb-6">
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Thread Header Skeleton */}
        <div className="px-5 py-7 bg-white rounded-lg border border-gray-200">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div>
                <Skeleton className="h-5 w-32 mb-1" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <Skeleton className="h-4 w-24" />
          </div>

          <div className="my-6">
            <Skeleton className="h-8 w-3/4 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-4">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-24" />
            </div>
            <Skeleton className="h-8 w-32" />
          </div>
        </div>

        {/* Comments Skeleton */}
        <div className="mt-8">
          <Skeleton className="h-8 w-32 mb-6" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="mt-6 px-5 py-5 bg-white rounded-lg border border-gray-200">
              <div className="flex items-start gap-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-3" />
                  <div className="flex gap-4">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Reply Form Skeleton */}
        <div className="mt-8 px-5 py-5 bg-white rounded-lg border border-gray-200">
          <Skeleton className="h-6 w-32 mb-4" />
          <Skeleton className="h-24 w-full mb-4" />
          <div className="flex justify-between">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-32" />
          </div>
        </div>
      </div>
    </UserLayout>
  )
}
