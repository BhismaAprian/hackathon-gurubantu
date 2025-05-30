"use client";

import UserLayout from "@/components/layout/UserLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import Link from "next/link";
import React, { useState, useCallback, useRef } from "react";
import { upload } from "@/app/library/upload/actions";

export default function UploadPageWrapper() {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && fileInputRef.current) {
      // Buat FileList baru dan set ke input
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(droppedFile);
      fileInputRef.current.files = dataTransfer.files;
      setFileName(droppedFile.name);
    }
  }, []);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  return (
      <div className="container max-w-3xl mx-auto py-10 space-y-8">
        <Link href="/library">
          <Button variant="outline">← Kembali ke Library</Button>
        </Link>

        <h1 className="text-3xl font-bold">Upload Materi Pembelajaran</h1>
        <p className="text-gray-600">
          Bagikan materi pembelajaran Anda dengan komunitas guru di seluruh Indonesia
        </p>

          <form action={upload} className="space-y-8">
          {/* AREA UPLOAD */}
          <div
            className={`border border-dashed p-6 rounded-lg text-center cursor-pointer ${
              dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={handleClick}
          >
            <Upload className="mx-auto mb-2" size={40} />
            <p className="mb-2 font-medium">Upload File Materi</p>
            <p className="text-sm text-gray-500">Drag & drop file atau klik untuk upload</p>
            <p className="text-sm text-gray-400 mt-2">
              Mendukung PDF, DOC, DOCX, PPT, PPTX, MP4, MP3, JPG, PNG (Maksimal 50MB)
            </p>

            {/* INPUT HIDDEN FILE */}
            <Input
              ref={fileInputRef}
              type="file"
              name="file"
              accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4,.mp3,.jpg,.png"
              className="hidden"
              onChange={handleFileChange}
              required
            />

            {fileName && <p className="text-sm mt-2 text-green-600">File dipilih: {fileName}</p>}
          </div>

          {/* FORM FIELDS LAINNYA */}
          <div className="grid gap-4">
            <div>
              <Label htmlFor="title">Judul Materi</Label>
              <Input id="title" name="judul" placeholder="Contoh: RPP Matematika..." required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="subject">Mata Pelajaran</Label>
                <Input id="subject" name="mata_pelajaran" placeholder="Contoh: Matematika" required />
              </div>
              <div>
                <Label htmlFor="education_level">Jenjang</Label>
                <Input id="education_level" name="jenjang" placeholder="Contoh: SMP" required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="curriculum">Kurikulum</Label>
                <Input id="curriculum" name="kurikulum" placeholder="Contoh: Kurikulum Merdeka" required />
              </div>
              {/* <div>
                <Label htmlFor="region">Wilayah</Label>
                <Input id="region" name="wilayah" placeholder="Contoh: Kalimantan Timur" required />
              </div> */}
            </div>

            <div>
              <Label htmlFor="description">Deskripsi Materi</Label>
              <Textarea id="description" name="deskripsi" rows={4} required />
            </div>

            <div>
              <Label htmlFor="learning_objectives">Tujuan Pembelajaran</Label>
              <Textarea id="learning_objectives" name="tujuan" rows={3} required />
            </div>

            <div>
              <Label htmlFor="tags">Tag</Label>
              <Input id="tags" name="tag" placeholder="Contoh: RPP, Kurikulum Merdeka, Kelas 7" />
              <p className="text-xs text-gray-500 mt-1">Pisahkan dengan koma</p>
            </div>

            <div className="flex items-start gap-2">
              <Checkbox id="agree" name="agree" required />
              <label htmlFor="agree" className="text-sm leading-6">
                Saya setuju dengan <a href="#" className="underline">Syarat dan Ketentuan</a> serta <a href="#" className="underline">Kebijakan Privasi</a> GuruBantu.
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button variant="outline" type="reset">Batal</Button>
            <Button className="bg-blue-600 text-white" type="submit">Upload Materi</Button>
          </div>
        </form>
      </div>
  );
}
