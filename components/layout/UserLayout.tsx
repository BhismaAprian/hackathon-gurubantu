import Sidebar from "../sidebar"
import { Inbox } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

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
                     <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Avatar className="w-10 h-10">
                            <AvatarImage src="/image.png" />
                          </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className=" min-w-56 rounded-lg" align="end">
                          <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                              <Avatar className="h-8 w-8 rounded-lg">
                                {/* <AvatarImage src={data.user.} alt={user.name} /> */}
                                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                              </Avatar>
                              <div className="grid flex-1 text-left text-sm leading-tight">
                                {/* <span className="truncate font-medium">{data.user.user_metadata.full_name}</span>
                                <span className="truncate text-xs">{data.user.user_metadata.email}</span> */}
                              </div>
                            </div>
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link href="/dashboard" className="flex items-center gap-2">
                              Dashboard
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>Profil</DropdownMenuItem>
                          <DropdownMenuItem>Keluar</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu> 
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