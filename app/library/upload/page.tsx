"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Upload, X, Plus } from "lucide-react"
import Link from "next/link"
import type React from "react"
import { useState, useCallback, useRef, useEffect } from "react"
import { upload } from "@/app/library/upload/actions"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"

// Daftar mata pelajaran yang umum
const COMMON_SUBJECTS = [
  "Matematika",
  "Bahasa Indonesia",
  "Bahasa Inggris",
  "IPA",
  "Biologi",
  "Fisika",
  "Kimia",
  "IPS",
  "Sejarah",
  "Geografi",
  "Ekonomi",
  "PKN",
  "Agama",
  "Seni Budaya",
  "PJOK",
  "TIK",
  "Prakarya",
]

// Daftar jenjang pendidikan
const EDUCATION_LEVELS = [
  { value: "paud", label: "PAUD" },
  { value: "sd", label: "SD" },
  { value: "smp", label: "SMP" },
  { value: "sma", label: "SMA" },
  { value: "universitas", label: "Universitas" },
  { value: "non-formal", label: "Non-Formal" },
]

export default function UploadPageWrapper() {
  const [dragActive, setDragActive] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // State untuk mata pelajaran
  const [subjects, setSubjects] = useState<string[]>(COMMON_SUBJECTS)
  const [selectedSubject, setSelectedSubject] = useState<string>("")
  const [newSubject, setNewSubject] = useState<string>("")
  const [openSubjectDropdown, setOpenSubjectDropdown] = useState(false)

  // State untuk jenjang pendidikan
  const [selectedLevel, setSelectedLevel] = useState<string>("")

  // State untuk tags
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState<string>("")
  const tagInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile && fileInputRef.current) {
      // Buat FileList baru dan set ke input
      const dataTransfer = new DataTransfer()
      dataTransfer.items.add(droppedFile)
      fileInputRef.current.files = dataTransfer.files
      setFileName(droppedFile.name)
    }
  }, [])

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name)
    }
  }

  // Fungsi untuk menambahkan mata pelajaran baru
  const addNewSubject = () => {
    if (newSubject && !subjects.includes(newSubject)) {
      setSubjects([...subjects, newSubject])
      setSelectedSubject(newSubject)
      setNewSubject("")
      setOpenSubjectDropdown(false)
    }
  }

  // Fungsi untuk menambahkan tag
  const addTag = (tag: string) => {
    const trimmedTag = tag.trim()
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag])
      setTagInput("")
    }
  }

  // Fungsi untuk menghapus tag
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  // Handle tag input keydown
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addTag(tagInput)
    }
  }

  // Fokus ke input tag setelah menghapus tag
  useEffect(() => {
    if (tagInputRef.current) {
      tagInputRef.current.focus()
    }
  }, [tags.length])

  return (
    <div className="container max-w-3xl mx-auto py-10 space-y-8">
      <Link href="/library">
        <Button variant="outline">← Kembali ke Library</Button>
      </Link>

      <h1 className="text-3xl font-bold">Upload Materi Pembelajaran</h1>
      <p className="text-gray-600">Bagikan materi pembelajaran Anda dengan komunitas guru di seluruh Indonesia</p>

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
              <input type="hidden" name="mata_pelajaran" value={selectedSubject} />
              <Popover open={openSubjectDropdown} onOpenChange={setOpenSubjectDropdown}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openSubjectDropdown}
                    className="w-full justify-between"
                  >
                    {selectedSubject || "Pilih Mata Pelajaran"}
                    <span className="opacity-50 ml-2">▼</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput
                      placeholder="Cari mata pelajaran..."
                      value={newSubject}
                      onValueChange={setNewSubject}
                    />
                    <CommandList>
                      <CommandEmpty>
                        <div className="p-2">
                          <p className="text-sm text-gray-500">Mata pelajaran tidak ditemukan</p>
                          <Button variant="outline" size="sm" className="mt-2 w-full" onClick={addNewSubject}>
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah "{newSubject}"
                          </Button>
                        </div>
                      </CommandEmpty>
                      <CommandGroup>
                        {subjects.map((subject) => (
                          <CommandItem
                            key={subject}
                            onSelect={() => {
                              setSelectedSubject(subject)
                              setOpenSubjectDropdown(false)
                            }}
                            className="cursor-pointer"
                          >
                            {subject}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label htmlFor="education_level">Jenjang</Label>
              <input type="hidden" name="jenjang" value={selectedLevel} />
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih Jenjang" />
                </SelectTrigger>
                <SelectContent>
                  {EDUCATION_LEVELS.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="curriculum">Kurikulum</Label>
            <Input id="curriculum" name="kurikulum" placeholder="Contoh: Kurikulum Merdeka" required />
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
            <div className="flex flex-wrap gap-2 p-2 border rounded-md mb-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="px-2 py-1">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              <Input
                ref={tagInputRef}
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                onBlur={() => tagInput && addTag(tagInput)}
                className="flex-1 min-w-[120px] border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-7"
                placeholder={tags.length ? "" : "Ketik tag dan tekan Enter..."}
              />
            </div>
            <input type="hidden" name="tag" value={tags.join(",")} />
            <p className="text-xs text-gray-500 mt-1">Tekan Enter setelah mengetik setiap tag</p>
          </div>

          <div className="flex items-start gap-2">
            <Checkbox id="agree" name="agree" required />
            <label htmlFor="agree" className="text-sm leading-6">
              Saya setuju dengan{" "}
              <a href="#" className="underline">
                Syarat dan Ketentuan
              </a>{" "}
              serta{" "}
              <a href="#" className="underline">
                Kebijakan Privasi
              </a>{" "}
              GuruBantu.
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button variant="outline" type="reset">
            Batal
          </Button>
          <Button className="bg-blue-600 text-white" type="submit">
            Upload Materi
          </Button>
        </div>
      </form>
    </div>
  )
}
