import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import LibraryClient from "./library-client"

// Type definition for library material
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
}

// Server function to fetch library materials
async function getLibraryMaterials(): Promise<LibraryMaterial[]> {
  const supabase = await createClient()

  // For now, return mock data. Replace this with actual Supabase query:
  const { data, error } = await supabase
    .from('library_materials')
    .select('*')
    .order('created_at', { ascending: false })

  console.log('Fetched library materials:', data)
  
  if (error) {
    console.error('Error fetching library materials:', error)
    return []
  }

  return data || []
}

// Server Component - handles authentication and data fetching
export default async function LibraryPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  
  if (error || !data?.user) {
    redirect("/login")
  }

  // Fetch library materials on the server
  const materials = await getLibraryMaterials()

  // Pass serializable data to client component
  return <LibraryClient initialMaterials={materials} />
}
