"use client";

import {
  ArchiveRestore,
  LayoutDashboard,
  Library,
  MessageSquareText,
  UserRoundPen,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth"; // or wherever your auth hook is

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <aside className="w-full hidden lg:block lg:max-w-[22rem] bg-white h-screen sticky top-0 z-50 border-r border-gray-200 font-jakarta">
      <div className="container px-4 py-10">
        <div className="logo flex items-center justify-center">
          <h1 className="text-heading font-extrabold text-[24px]">GuruBantu</h1>
        </div>

        {/* Main Menu */}
        <div className="flex flex-col mt-10">
          {/* Link */}

          <div className="flex flex-col gap-2">
            <Link
              href="/dashboard"
              className={`text-sm font-semibold flex items-center gap-4 px-4 py-3 rounded-md ${
                pathname.startsWith("/dashboard")
                  ? "bg-[#084734] text-[#CEF17B]"
                  : "text-[#084734]"
              }`}
            >
              <LayoutDashboard size={20} />
              Dashboard
            </Link>

            <Link
              href="/library"
              className={`text-sm font-semibold flex items-center gap-4 px-4 py-3 rounded-md ${
                pathname.startsWith("/library")
                  ? "bg-[#084734] text-[#CEF17B]"
                  : "text-[#084734]"
              }`}
            >
              <Library size={20} />
              Perpustakaan
            </Link>

            <Link
              href="/profile"
              className={`text-sm font-semibold flex items-center gap-4 px-4 py-3 rounded-md ${
                pathname.startsWith("/profile")
                  ? "bg-[#084734] text-[#CEF17B]"
                  : "text-[#084734]"
              }`}
            >
              <UserRoundPen size={20} />
              Profile
            </Link>
          </div>
        </div>

        <hr className="my-6 border-gray-200" />

        {/* Forum */}
        <div className="flex flex-col">
          <h2 className="text-sm font-semibold text-[#98A2B3] tracking-wide px-4">
            Forum
          </h2>

          {/* Link */}

          <div className="mt-5 flex flex-col gap-2">
            <Link
              href="/forum"
              className={`text-sm font-semibold flex items-center gap-4 px-4 py-3 rounded-md ${
                pathname.startsWith("/forum")
                  ? "bg-[#084734] text-[#CEF17B]"
                  : "text-[#084734]"
              }`}
            >
              <MessageSquareText size={20} />
              Forum Diskusi
            </Link>
            {/* <Link
              href="/"
              className="text-[#084734] text-sm font-semibold flex items-center gap-4 px-4 py-4 rounded-md"
            >
              <ArchiveRestore size={20} />
              Riwayat Diskusi
            </Link> */}
          </div>
        </div>
      </div>
    </aside>
  );
}
