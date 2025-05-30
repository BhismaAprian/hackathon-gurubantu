import Sidebar from "../sidebar"
import { Inbox } from "lucide-react"
import { Avatar, AvatarImage } from "../ui/avatar"


export default function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <div className="min-h-screen flex bg-[#F0F0F0]">
        <div className="flex flex-1">
          <Sidebar />
          <div className="w-full">
            <nav className="bg-white/50 sticky top-0 z-50 h-20 w-full flex items-center border-b border-gray-200 backdrop-blur-lg font-jakarta">
              <div className="container">
                 <div className="flex items-center justify-end gap-6">
                  <Inbox color="#084734" />
                  <Avatar className="w-10 h-10">
                    <AvatarImage src="/image.png"/>
                  </Avatar>
                  </div>
              </div>
            </nav>
            <main className="py-10 px-20 overflow-y-auto h-screen">
              {children}
            </main>
          </div>
        </div>
      </div>
  )
}