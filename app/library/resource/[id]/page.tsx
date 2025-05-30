import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Download, FileText, Video, ImageIcon, Share2, Heart, Eye } from "lucide-react"
import AuthenticatedLayout from "@/components/authenticated-layout"
import { mockResources } from "@/lib/mock-data"

interface ResourceDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function ResourceDetailPage({ params }: ResourceDetailPageProps) {
  const { id } = await params
  const resource = mockResources.find((r) => r.id === id)

  if (!resource) {
    notFound()
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case "video":
        return Video
      case "image":
        return ImageIcon
      default:
        return FileText
    }
  }

  const FileIcon = getFileIcon(resource.type)

  // Mock related resources
  const relatedResources = mockResources.filter((r) => r.id !== id && r.subject === resource.subject).slice(0, 3)

  return (
    <AuthenticatedLayout>
      <div className="p-8 max-w-4xl mx-auto">
        {/* Resource Header */}
        <Card className="border-0 shadow-lg bg-white mb-6">
          <CardHeader>
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                <FileIcon className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <Badge variant="outline">{resource.type.toUpperCase()}</Badge>
                  <Badge variant="secondary">{resource.level}</Badge>
                  <Badge variant="outline">{resource.subject}</Badge>
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">{resource.title}</h1>
                <p className="text-gray-600 mb-4">{resource.description}</p>
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <span className="flex items-center space-x-1">
                    <Download className="w-4 h-4" />
                    <span>{resource.downloadCount} downloads</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>245 views</span>
                  </span>
                  <span>{resource.fileSize}</span>
                  <span>{new Date(resource.createdAt).toLocaleDateString("id-ID")}</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={resource.author.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {resource.author.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-800">{resource.author.name}</p>
                  <p className="text-sm text-gray-500">
                    {resource.author.role === "guru" ? "Guru" : "Relawan"} {resource.author.subject}
                  </p>
                </div>
              </div>
              <div className="flex space-x-3">
                <Button variant="outline" size="sm">
                  <Heart className="w-4 h-4 mr-2" />
                  Suka
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Bagikan
                </Button>
                <Button className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* File Preview */}
        <Card className="border-0 shadow-lg bg-white mb-6">
          <CardHeader>
            <CardTitle className="text-lg text-gray-800">Preview File</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg p-12 text-center">
              <FileIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Preview tidak tersedia</p>
              <p className="text-sm text-gray-500">Download file untuk melihat konten lengkap</p>
            </div>
          </CardContent>
        </Card>

        {/* Related Resources */}
        {relatedResources.length > 0 && (
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader>
              <CardTitle className="text-lg text-gray-800">Materi Terkait</CardTitle>
              <CardDescription>Resource lain dengan topik serupa</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {relatedResources.map((relatedResource) => {
                  const RelatedFileIcon = getFileIcon(relatedResource.type)
                  return (
                    <Card key={relatedResource.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                            <RelatedFileIcon className="w-5 h-5 text-white" />
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {relatedResource.type.toUpperCase()}
                          </Badge>
                        </div>
                        <h4 className="font-medium text-gray-800 mb-2 line-clamp-2">{relatedResource.title}</h4>
                        <p className="text-xs text-gray-500 mb-3 line-clamp-2">{relatedResource.description}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{relatedResource.author.name}</span>
                          <span className="flex items-center space-x-1">
                            <Download className="w-3 h-3" />
                            <span>{relatedResource.downloadCount}</span>
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AuthenticatedLayout>
  )
}
