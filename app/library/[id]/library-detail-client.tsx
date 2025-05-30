"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Download,
  Eye,
  FileText,
  ImageIcon,
  Video,
  Music,
  Archive,
  ArrowLeft,
  Calendar,
  User,
  BookOpen,
  Target,
  Hash,
  FileType,
  HardDrive,
} from "lucide-react";
import Link from "next/link";

// Type definitions
interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
}

interface LibraryMaterial {
  id: string;
  user_id: string;
  title: string;
  description: string;
  file_url: string;
  file_name: string;
  file_size: number;
  file_type: string;
  subject: string;
  education_level: string;
  curriculum: string;
  tags: string[];
  learning_objectives: string;
  download_count: number;
  view_count: number;
  created_at: string;
  updated_at?: string;
  uploader: UserProfile;
}

interface LibraryDetailClientProps {
  material: LibraryMaterial;
}

// Helper functions
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (
    Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  );
};

const getFileTypeIcon = (fileType: string) => {
  switch (fileType.toLowerCase()) {
    case "pdf":
      return <FileText className="w-6 h-6 text-red-500" />;
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
      return <ImageIcon className="w-6 h-6 text-green-500" />;
    case "mp4":
    case "avi":
    case "mov":
      return <Video className="w-6 h-6 text-blue-500" />;
    case "mp3":
    case "wav":
      return <Music className="w-6 h-6 text-purple-500" />;
    case "zip":
    case "rar":
      return <Archive className="w-6 h-6 text-orange-500" />;
    default:
      return <FileText className="w-6 h-6 text-gray-500" />;
  }
};

const getFileTypeColor = (fileType: string): string => {
  switch (fileType.toLowerCase()) {
    case "pdf":
      return "bg-red-100 text-red-800";
    case "pptx":
    case "ppt":
      return "bg-orange-100 text-orange-800";
    case "docx":
    case "doc":
      return "bg-blue-100 text-blue-800";
    case "xlsx":
    case "xls":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return "Unknown";
  return new Date(dateString).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const handleDownload = async (fileUrl: string, fileName: string) => {
  try {
    const response = await fetch(fileUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error("Download failed:", error);
    // Fallback to opening in new tab
    window.open(fileUrl, "_blank");
  }
};

// Client Component - handles all interactive UI
export default function LibraryDetailClient({
  material,
}: LibraryDetailClientProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadClick = async () => {
    setIsDownloading(true);
    await handleDownload(material.file_url, material.file_name);
    setIsDownloading(false);
  };

  return (
    <div className="bg-white rounded-lg p-8 min-h-full">
      {/* Back Button */}
      <div className="mb-6">
        <Button variant="ghost" asChild className="font-jakarta">
          <Link href="/library" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Library
          </Link>
        </Button>
      </div>

      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-6 mb-6">
          <div className="flex-1">
            <h1 className="text-4xl font-bold font-jakarta text-gray-900 mb-4">
              {material.title}
            </h1>
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="secondary" className="text-sm font-semibold">
                {material.subject}
              </Badge>
              <Badge variant="outline" className="text-sm">
                {material.education_level}
              </Badge>
              <Badge variant="outline" className="text-sm">
                {material.curriculum}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getFileTypeIcon(material.file_type)}
            <Badge
              className={`text-sm ${getFileTypeColor(material.file_type)}`}
            >
              {material.file_type.toUpperCase()}
            </Badge>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6 text-sm text-gray-500 font-geist">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            <span>{material.view_count.toLocaleString()} views</span>
          </div>
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4" />
            <span>{formatFileSize(material.file_size)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-jakarta">
                <BookOpen className="w-5 h-5" />
                Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 font-geist leading-relaxed">
                {material.description}
              </p>
            </CardContent>
          </Card>

          {/* Learning Objectives */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-jakarta">
                <Target className="w-5 h-5" />
                Learning Objectives
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 font-geist leading-relaxed">
                {material.learning_objectives}
              </p>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-jakarta">
                <Hash className="w-5 h-5" />
                Tags
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {material.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-sm px-3 py-1"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Download Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-jakarta">
                <Download className="w-5 h-5" />
                Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={handleDownloadClick}
                disabled={isDownloading}
                className="w-full bg-blue-600 hover:bg-blue-700 font-semibold font-jakarta"
              >
                <Download className="w-4 h-4 mr-2" />
                {isDownloading ? "Downloading..." : "Download File"}
              </Button>
              <Button
                variant="outline"
                onClick={() => window.open(material.file_url, "_blank")}
                className="w-full font-semibold font-jakarta"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview File
              </Button>
            </CardContent>
          </Card>

          {/* File Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-jakarta">
                <FileType className="w-5 h-5" />
                File Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 font-geist">
                  File Name:
                </span>
                <span className="text-sm font-semibold font-geist">
                  {material.file_name}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 font-geist">
                  File Type:
                </span>
                <span className="text-sm font-semibold font-geist">
                  {material.file_type.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 font-geist">
                  File Size:
                </span>
                <span className="text-sm font-semibold font-geist">
                  {formatFileSize(material.file_size)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Uploader Information */}
       /* The above code is a TypeScript React component that displays information about the uploader
       of a material. It includes a Card component with a CardHeader and CardContent. Inside the
       CardContent, it shows the uploader's avatar, full name, and email. If the uploader's avatar
       URL is not available, it falls back to a placeholder image. The uploader's full name is
       displayed in a bold font, and their email is displayed in a smaller, lighter font. */
          {/* <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-jakarta">
                <User className="w-5 h-5" />
                Uploaded By
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage
                    src={material.uploader?.avatar_url || "/placeholder.svg"}
                  />
                  <AvatarFallback className="font-semibold">
                    {material.uploader?.full_name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("") || "?"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold font-jakarta text-gray-900">
                    {material.uploader.full_name}
                  </p>
                  <p className="text-sm text-gray-600 font-geist">
                    {material.uploader.email}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card> */}

          {/* Date Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-jakarta">
                <Calendar className="w-5 h-5" />
                Date Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 font-geist">
                  Uploaded:
                </span>
                <span className="text-sm font-semibold font-geist">
                  {formatDate(material.created_at)}
                </span>
              </div>
              {material.updated_at && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 font-geist">
                    Updated:
                  </span>
                  <span className="text-sm font-semibold font-geist">
                    {formatDate(material.updated_at)}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
