import { createClient } from "@/utils/supabase/server"
import { redirect, notFound } from "next/navigation"
import ProfileDetail from "./profile-detail"

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

// Server function to fetch user by ID
async function getUserById(id: string): Promise<User | null> {
  const supabase = await createClient()

  const { data: user, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !user) {
    return null
  }

  return {
    id: user.id,
    name: user.full_name,
    email: user.email,
    role: user.role,
    avatar: user.avatar_url,
    subject: user.subject || '',
    experience: user.teaching_experience || '',
    level: user.education_level || '',
    joinedAt: user.created_at
  }
 
}


interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ProfilePage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect("/login")
  }

  const user = await getUserById(id)


  if (!user) {
    notFound()
  }

  return <ProfileDetail user={user} />
  
}

