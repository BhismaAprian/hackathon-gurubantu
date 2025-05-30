"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";

export default function ProfileDashboard() {
  const {session} = useAuth();


  return (
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
              <span className="truncate font-medium">{session?.user.user_metadata.full_name}</span>
              <span className="truncate text-xs">{session?.user.user_metadata.email}</span>
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
  )
}