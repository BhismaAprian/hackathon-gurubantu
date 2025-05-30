"use client"

import { useState } from "react"
import { ArrowLeft, Mail, BookOpen, GraduationCap, Calendar, Clock } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

// Type definition for user
interface User {
  id: string
  name: string
  email: string
  role: "guru" | "relawan"
  avatar?: string
  subject: string
  experience: string
  level: string
  joinedAt: string
}

interface ProfileDetailProps {
  user: User
}

export default function ProfileDetail({ user }: ProfileDetailProps) {
  const [isFollowing, setIsFollowing] = useState(false)

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
  }

  // Get role badge color
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "guru":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case "relawan":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }
  
  const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return "Unknown";
  return new Date(dateString).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

  // Format role name for display
  const formatRoleName = (role: string) => {
    return role.charAt(0).toUpperCase() + role.slice(1)
  }

  return (
    <div className="bg-white rounded-lg p-8 min-h-full">
      {/* Back Button */}
      <div className="mb-6">
        <Button variant="ghost" asChild className="font-jakarta">
          <Link href="/dashboard" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <Card className="border border-gray-200">
            <CardHeader className="flex flex-col items-center text-center pb-4">
              <Avatar className="w-32 h-32 mb-4">
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback className="text-2xl font-semibold">{getInitials(user.name)}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-2xl font-bold font-jakarta">{user.name}</CardTitle>
              <CardDescription className="text-base font-geist">
                <Badge className={`${getRoleBadgeColor(user.role)} font-medium mt-2`}>
                  {formatRoleName(user.role)}
                </Badge>
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="flex justify-center items-center gap-2 text-gray-600 mb-6">
                <Mail className="w-4 h-4" />
                <span className="font-geist">{user.email}</span>
              </div>

              <div className="flex justify-center gap-3">
                <Button
                  className={`flex-1 ${
                    isFollowing
                      ? "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  } font-semibold font-jakarta`}
                  onClick={() => setIsFollowing(!isFollowing)}
                >
                  {isFollowing ? "Following" : "Follow"}
                </Button>
                <Button variant="outline" className="flex-1 font-semibold font-jakarta">
                  Message
                </Button>
              </div>

              <Separator className="my-6" />

              <div className="space-y-4 text-left">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 p-2 rounded-full">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-geist">Subject</p>
                    <p className="font-medium font-jakarta">{user.subject}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-green-50 p-2 rounded-full">
                    <Clock className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-geist">Experience</p>
                    <p className="font-medium font-jakarta">{user.experience}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-purple-50 p-2 rounded-full">
                    <GraduationCap className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-geist">Education Level</p>
                    <p className="font-medium font-jakarta">{user.level}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-amber-50 p-2 rounded-full">
                    <Calendar className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-geist">Joined</p>
                    <p className="font-medium font-jakarta">{formatDate(user.joinedAt)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* About Section */}
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl font-bold font-jakarta">About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 font-geist leading-relaxed">
                {user.role === "guru"
                  ? `${user.name} is an experienced educator specializing in ${user.subject} with ${user.experience} of teaching experience at the ${user.level} level. They are passionate about sharing knowledge and helping students achieve their academic goals.`
                  : `${user.name} is a dedicated volunteer with expertise in ${user.subject}. With ${user.experience} of experience at the ${user.level} level, they are committed to supporting educational initiatives and helping students succeed.`}
              </p>
            </CardContent>
          </Card>

          {/* Stats Section */}
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl font-bold font-jakarta">Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-3xl font-bold font-jakarta text-blue-600">24</p>
                  <p className="text-gray-600 font-geist">Materials Shared</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-3xl font-bold font-jakarta text-green-600">156</p>
                  <p className="text-gray-600 font-geist">Forum Posts</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-3xl font-bold font-jakarta text-purple-600">1.2k</p>
                  <p className="text-gray-600 font-geist">Contributions</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Contributions */}
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl font-bold font-jakarta">Recent Contributions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="bg-white p-2 rounded-md border border-gray-200">
                      <BookOpen className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold font-jakarta">
                        {user.subject} {item === 1 ? "Study Guide" : item === 2 ? "Lesson Plan" : "Practice Exercises"}
                      </h4>
                      <p className="text-sm text-gray-600 font-geist">
                        Shared {item === 1 ? "2 days" : item === 2 ? "1 week" : "2 weeks"} ago
                      </p>
                    </div>
                    <Badge variant="outline">{item === 1 ? "PDF" : item === 2 ? "DOCX" : "PPTX"}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Areas of Expertise */}
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl font-bold font-jakarta">Areas of Expertise</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {user.subject === "Mathematics" ? (
                  <>
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Calculus</Badge>
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Linear Algebra</Badge>
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Statistics</Badge>
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Geometry</Badge>
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Number Theory</Badge>
                  </>
                ) : user.subject === "Physics" ? (
                  <>
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Mechanics</Badge>
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Thermodynamics</Badge>
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Electromagnetism</Badge>
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Quantum Physics</Badge>
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Optics</Badge>
                  </>
                ) : (
                  <>
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Organic Chemistry</Badge>
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Inorganic Chemistry</Badge>
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Biochemistry</Badge>
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Analytical Chemistry</Badge>
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Physical Chemistry</Badge>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
