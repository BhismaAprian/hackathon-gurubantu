import UserLayout from "@/components/layout/UserLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import Link from "next/link";

export default function LibraryPage() {
  return (
    <UserLayout>
      <div className="container p-8 bg-white rounded-lg h-screen overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold font-jakarta">📚 Perpustakaan Materi</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-gray-500" size={20} />
              <Input
                placeholder="Cari materi..."
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 w-64"
              />
            </div>
            <Button asChild className="bg-gray-900 text-white font-semibold font-jakarta">
              <Link href="/library/upload">
                <Plus className="mr-2" size={20} />
                Upload Materi
              </Link>
            </Button>
          </div>
        </div>

        {/* List Materi */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card Materi - statis */}
          <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
            <h3 className="text-xl font-semibold mb-2 font-jakarta">RPP Matematika Kelas 7</h3>
            <p className="text-sm text-gray-600 mb-2 font-geist">PDF · 2.3 MB</p>
            <p className="text-sm text-gray-500 font-geist mb-4">
              Materi bilangan bulat untuk jenjang SMP, lengkap dengan latihan soal.
            </p>
            <div className="flex justify-between items-center text-sm text-gray-500 font-geist">
              <span>📘 Matematika</span>
              <span>👤 Terrano</span>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
            <h3 className="text-xl font-semibold mb-2 font-jakarta">Presentasi IPA Kelas 8</h3>
            <p className="text-sm text-gray-600 mb-2 font-geist">PPTX · 4.8 MB</p>
            <p className="text-sm text-gray-500 font-geist mb-4">
              Penjelasan sistem pernapasan manusia dengan ilustrasi menarik.
            </p>
            <div className="flex justify-between items-center text-sm text-gray-500 font-geist">
              <span>🧪 IPA</span>
              <span>👤 Rahmawati</span>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
            <h3 className="text-xl font-semibold mb-2 font-jakarta">Video Sejarah Indonesia</h3>
            <p className="text-sm text-gray-600 mb-2 font-geist">MP4 · 45 MB</p>
            <p className="text-sm text-gray-500 font-geist mb-4">
              Penjelasan interaktif tentang peristiwa Proklamasi Kemerdekaan.
            </p>
            <div className="flex justify-between items-center text-sm text-gray-500 font-geist">
              <span>🏛️ Sejarah</span>
              <span>👤 Andi</span>
            </div>
          </div>
        </div>
        
      </div>
    </UserLayout>
  );
}
