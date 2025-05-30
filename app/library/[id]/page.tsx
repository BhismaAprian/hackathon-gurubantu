import { createClient } from "@/utils/supabase/server"
import { redirect, notFound } from "next/navigation"
import LibraryDetailClient from "./library-detail-client"

// Type definitions
interface LibraryMaterial {
  id: string
  user_id: string
  title: string
  description: string
  file_url: string
  file_name: string
  file_size: number
  file_type: string
  subject: string
  education_level: string
  curriculum: string
  tags: string[]
  learning_objectives: string
  download_count: number
  view_count: number
  created_at: string
  updated_at?: string
}

interface UserProfile {
  id: string
  full_name: string
  email: string
  avatar_url?: string
}

interface LibraryMaterialWithUser extends LibraryMaterial {
  uploader: UserProfile
}

// Server function to fetch material by ID
async function getLibraryMaterialById(id: string): Promise<LibraryMaterialWithUser | null> {
  const supabase = await createClient()

  console.log("🔍 Fetching library_materials by ID:", id)

  const { data: material, error } = await supabase
   .from('library_materials')
  .select(`
    *,
    uploader:profiles!user_id (
      id,
      full_name,
      email,
      avatar_url
    )
  `)
  .eq('id', id)
  .single()

  console.log("📦 Supabase response:", { material, error })

  if (error || !material) {
    return null
  }

  return material
}

// Server function to increment view count
async function incrementViewCount(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('library_materials')
    .select('view_count')
    .eq('id', id)
    .single()

  if (error || !data) {
    console.error("Error fetching view count:", error)
    return
  }

  await supabase
    .from('library_materials')
    .update({ view_count: (data.view_count ?? 0) + 1 })
    .eq('id', id)
}
interface PageProps {
  params: Promise<{ id: string }>
}

// Server Component - handles authentication and data fetching
export default async function LibraryDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect("/login")
  }

  // Fetch material data
  const material = await getLibraryMaterialById(id)

  if (!material) {
    notFound()
  }

  // Increment view count
  await incrementViewCount(id)

  // Pass serializable data to client component
  return <LibraryDetailClient material={material} />
}
