"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Upload, 
  X, 
  FileText, 
  ImageIcon, 
  FileIcon, 
  CheckCircle, 
  AlertCircle, 
  Loader2 
} from "lucide-react"
import { cn } from "@/lib/utils"

interface FileWithPreview extends File {
  preview?: string
  id: string
  uploadProgress: number
  status: "uploading" | "success" | "error" | "processing"
  processedUrl?: string
  error?: string
}

interface FileUploadDropzoneProps {
  onFilesChange: (files: FileWithPreview[]) => void
  maxFiles?: number
  maxSize?: number // in bytes
  acceptedFileTypes?: Record<string, string[]>
  enableImageProcessing?: boolean
  imageMaxWidth?: number
  imageMaxHeight?: number
  imageQuality?: number
}

const defaultAcceptedTypes = {
  "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
  "application/pdf": [".pdf"],
  "application/msword": [".doc"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  "application/vnd.ms-powerpoint": [".ppt"],
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx"],
}

export default function FileUploadDropzone({
  onFilesChange,
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024, // 10MB
  acceptedFileTypes = defaultAcceptedTypes,
  enableImageProcessing = true,
  imageMaxWidth = 1920,
  imageMaxHeight = 1080,
  imageQuality = 0.8,
}: FileUploadDropzoneProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [isDragActive, setIsDragActive] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader() 
      
      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = () => {
      // Do whatever you want with the file contents
        const binaryStr = reader.result
        console.log(binaryStr)
      }
      reader.readAsArrayBuffer(file)
    })
    
  }, [])

  const removeFile = useCallback(
    (fileId: string) => {
      setFiles((prev) => {
        // Clean up preview URL to prevent memory leaks
        const fileToRemove = prev.find(f => f.id === fileId)
        if (fileToRemove?.preview) {
          URL.revokeObjectURL(fileToRemove.preview)
        }
        
        const updated = prev.filter((f) => f.id !== fileId)
        onFilesChange(updated)
        return updated
      })
    },
    [onFilesChange],
  )

  const { getRootProps, getInputProps, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    accept: acceptedFileTypes,
    maxSize,
    maxFiles: maxFiles - files.length,
    disabled: files.length >= maxFiles,
  })

  const getFileIcon = (file: FileWithPreview) => {
    const fileType = file.type || ""
    if (fileType.startsWith("image/")) return ImageIcon
    if (fileType.includes("pdf")) return FileText
    return FileIcon
  }

  const getStatusIcon = (status: FileWithPreview["status"]) => {
    switch (status) {
      case "uploading":
      case "processing":
        return Loader2
      case "success":
        return CheckCircle
      case "error":
        return AlertCircle
      default:
        return FileIcon
    }
  }

  const getStatusColor = (status: FileWithPreview["status"]) => {
    switch (status) {
      case "success":
        return "text-green-500"
      case "error":
        return "text-red-500"
      case "uploading":
      case "processing":
        return "text-blue-500"
      default:
        return "text-gray-500"
    }
  }

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
          isDragAccept && "border-green-400 bg-green-50",
          isDragReject && "border-red-400 bg-red-50",
          isDragActive && !isDragAccept && !isDragReject && "border-blue-400 bg-blue-50",
          !isDragActive && "border-gray-300 hover:border-gray-400",
          files.length >= maxFiles && "opacity-50 cursor-not-allowed",
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
            {isDragAccept && (
              <p className="text-green-600 font-medium">Drop files here to upload</p>
            )}
            {isDragReject && (
              <p className="text-red-600 font-medium">Some files are not supported</p>
            )}
            {!isDragAccept && !isDragReject && (
              <p className="text-blue-600 font-medium">Drop files here</p>
            )}
          </div>
        ) : (
          <div>
            <p className="text-gray-600 mb-2">
              {files.length >= maxFiles
                ? `Maximum ${maxFiles} files reached`
                : "Drag & drop files here, or click to select"}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Supports: Images, PDF, Word, PowerPoint (Max {(maxSize / 1024 / 1024).toFixed(0)}MB each)
            </p>
            {files.length < maxFiles && (
              <Button type="button" variant="outline">
                Choose Files
              </Button>
            )}
          </div>
        )}
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-700">
            Uploaded Files ({files.length}/{maxFiles})
          </h4>
          {files.map((file) => {
            const FileIconComponent = getFileIcon(file)
            const StatusIconComponent = getStatusIcon(file.status)

            return (
              <Card key={file.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    {/* File Preview/Icon */}
                    <div className="flex-shrink-0">
                      {file.preview ? (
                        <img
                          src={file.preview}
                          alt={file.name}
                          className="w-12 h-12 object-cover rounded-lg"
                          onError={(e) => {
                            // Fallback if preview fails to load
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                          }}
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <FileIconComponent className="w-6 h-6 text-gray-500" />
                        </div>
                      )}
                    </div>

                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-800 truncate" title={file.name}>
                          {file.name}
                        </p>
                        <div className="flex items-center space-x-2">
                          <StatusIconComponent
                            className={cn(
                              "w-4 h-4",
                              getStatusColor(file.status),
                              (file.status === "uploading" || file.status === "processing") && "animate-spin",
                            )}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(file.id)}
                            className="h-8 w-8 p-0"
                            aria-label={`Remove ${file.name}`}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-1">
                        <p className="text-sm text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <span className="text-xs text-gray-500 capitalize">
                          {file.status === "processing" ? "Processing..." : file.status}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      {(file.status === "uploading" || file.status === "processing") && (
                        <Progress value={file.uploadProgress} className="mt-2 h-2" />
                      )}

                      {/* Error Message */}
                      {file.status === "error" && file.error && (
                        <Alert className="mt-2">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription className="text-sm">{file.error}</AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Upload Summary */}
      {files.length > 0 && (
        <div className="text-sm text-gray-600">
          <p>
            {files.filter((f) => f.status === "success").length} of {files.length} files uploaded successfully
          </p>
        </div>
      )}
    </div>
  )
}