"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FileIcon, ImageIcon, FileText, X, Upload, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileWithPreview extends File {
  preview?: string
  id: string
  uploadProgress?: number
  status?: "idle" | "uploading" | "success" | "error"
  error?: string
}

interface FileAttachmentDropzoneProps {
  value?: File | string | null
  onChange: (file: File | null) => void
  onNameChange?: (name: string | null) => void
  maxSize?: number // in bytes
  acceptedFileTypes?: Record<string, string[]>
}

const defaultAcceptedTypes = {
  "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
  "application/pdf": [".pdf"],
  "application/msword": [".doc"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  "application/vnd.ms-powerpoint": [".ppt"],
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx"],
}

export default function FileAttachmentDropzone({
  value,
  onChange,
  onNameChange,
  maxSize = 10 * 1024 * 1024, // 10MB
  acceptedFileTypes = defaultAcceptedTypes,
}: FileAttachmentDropzoneProps) {
  const [file, setFile] = useState<FileWithPreview | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(typeof value === "string" ? value : null)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return

      // Clean up previous preview
      if (file?.preview) {
        URL.revokeObjectURL(file.preview)
      }

      const selectedFile = acceptedFiles[0]
      const fileWithPreview = Object.assign(selectedFile, {
        preview: URL.createObjectURL(selectedFile),
        id: Math.random().toString(36).substring(2),
        status: "idle",
      }) as FileWithPreview

      setFile(fileWithPreview)
      setPreviewUrl(fileWithPreview.preview || '')
      onChange(fileWithPreview)
      if (onNameChange) {
        onNameChange(fileWithPreview.name)
      }
    },
    [file, onChange, onNameChange],
  )

  const removeFile = useCallback(() => {
    if (file?.preview) {
      URL.revokeObjectURL(file.preview)
    }
    setFile(null)
    setPreviewUrl(null)
    onChange(null)
    if (onNameChange) {
      onNameChange(null)
    }
  }, [file, onChange, onNameChange])

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    maxSize,
    accept: acceptedFileTypes,
    maxFiles: 1,
    multiple: false,
  })

  const getFileIcon = () => {
    if (!file && !previewUrl) return Upload

    if (file) {
      if (file.type.startsWith("image/")) return ImageIcon
      if (file.type.includes("pdf")) return FileText
      return FileIcon
    }

    // For string URLs, try to guess from extension
    if (typeof previewUrl === "string") {
      if (/\.(jpg|jpeg|png|gif|webp)$/i.test(previewUrl)) return ImageIcon
      if (/\.pdf$/i.test(previewUrl)) return FileText
      return FileIcon
    }

    return FileIcon
  }

  const isImage =
    file?.type?.startsWith("image/") ||
    (typeof previewUrl === "string" && /\.(jpg|jpeg|png|gif|webp)$/i.test(previewUrl))

  const getFileName = () => {
    if (file) return file.name
    if (typeof previewUrl === "string") {
      // Extract filename from URL
      const parts = previewUrl.split("/")
      return parts[parts.length - 1]
    }
    return ""
  }

  const getFileSize = () => {
    if (!file) return ""
    const sizeInMB = file.size / (1024 * 1024)
    return `${sizeInMB.toFixed(2)} MB`
  }

  const FilePreview = () => {
    const Icon = getFileIcon()

    if (!file && !previewUrl) return null

    return (
      <Card className="p-4 mt-4">
        <div className="flex items-center space-x-4">
          {isImage && previewUrl ? (
            <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
              <img
                src={previewUrl || "/placeholder.svg"}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback if image fails to load
                  e.currentTarget.style.display = "none"
                }}
              />
            </div>
          ) : (
            <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center flex-shrink-0">
              <Icon className="w-8 h-8 text-gray-500" />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="font-medium text-gray-800 truncate">{getFileName()}</p>
              <Button type="button" variant="ghost" size="sm" onClick={removeFile} className="h-8 w-8 p-0">
                <X className="w-4 h-4" />
              </Button>
            </div>

            {file && <p className="text-sm text-gray-500 mt-1">{getFileSize()}</p>}

            {file?.status === "uploading" && <Progress value={file.uploadProgress || 0} className="mt-2 h-2" />}

            {file?.status === "error" && file.error && (
              <Alert className="mt-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">{file.error}</AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-2">
      {!file && !previewUrl ? (
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
            isDragAccept && "border-green-400 bg-green-50",
            isDragReject && "border-red-400 bg-red-50",
            isDragActive && !isDragAccept && !isDragReject && "border-blue-400 bg-blue-50",
            !isDragActive && "border-gray-300 hover:border-gray-400",
          )}
        >
          <input {...getInputProps()} />
          <Upload
            className={cn(
              "w-12 h-12 mx-auto mb-4",
              isDragAccept && "text-green-500",
              isDragReject && "text-red-500",
              isDragActive && !isDragAccept && !isDragReject && "text-blue-500",
              !isDragActive && "text-gray-400",
            )}
          />

          {isDragActive ? (
            <div>
              {isDragAccept && <p className="text-green-600 font-medium">Drop file here to upload</p>}
              {isDragReject && <p className="text-red-600 font-medium">File type not supported</p>}
              {!isDragAccept && !isDragReject && <p className="text-blue-600 font-medium">Drop file here</p>}
            </div>
          ) : (
            <div>
              <p className="text-gray-600 mb-2">Drag & drop file here, or click to select</p>
              <p className="text-sm text-gray-500 mb-4">
                Supports: Images, PDF, Word, PowerPoint (Max {(maxSize / 1024 / 1024).toFixed(0)}MB)
              </p>
              <Button type="button" variant="outline">
                Pilih File
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div>
          <FilePreview />
          <div className="mt-2 text-center">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const inputElement = document.createElement("input")
                inputElement.type = "file"
                inputElement.accept = Object.entries(acceptedFileTypes)
                  .flatMap(([type, exts]) => [...exts, type])
                  .join(",")
                inputElement.onchange = (e) => {
                  const files = (e.target as HTMLInputElement).files
                  if (files?.length) {
                    onDrop([files[0]])
                  }
                }
                inputElement.click()
              }}
            >
              Ganti File
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
