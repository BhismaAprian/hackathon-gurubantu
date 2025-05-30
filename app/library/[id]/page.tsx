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

  // For now, return mock data. Replace with actual Supabase query:
  /*
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

  if (error || !material) {
    return null
  }

  return material
  */

  // Mock data for demonstration
  const mockMaterials: LibraryMaterialWithUser[] = [
    {
      id: "1",
      user_id: "user1",
      title: "Advanced Calculus Notes",
      description:
        "Comprehensive notes covering differential and integral calculus with practical examples and problem-solving techniques. This material includes step-by-step solutions to complex problems, visual representations of mathematical concepts, and real-world applications of calculus in engineering and physics. Perfect for university-level students preparing for exams or professionals looking to refresh their mathematical knowledge.",
      file_url: "/files/calculus-notes.pdf",
      file_name: "calculus-notes.pdf",
      file_size: 2048576,
      file_type: "pdf",
      subject: "Mathematics",
      education_level: "University",
      curriculum: "Engineering",
      tags: ["calculus", "mathematics", "derivatives", "integrals", "engineering"],
      learning_objectives:
        "Master advanced calculus concepts including limits, derivatives, integrals, and their applications in real-world scenarios",
      download_count: 245,
      view_count: 1203,
      created_at: "2024-01-15T10:30:00Z",
      updated_at: "2024-01-20T14:15:00Z",
      uploader: {
        id: "user1",
        full_name: "Dr. Sarah Johnson",
        email: "sarah.johnson@university.edu",
        avatar_url: "/avatars/sarah.jpg",
      },
    },
    {
      id: "2",
      user_id: "user2",
      title: "Physics Lab Manual",
      description:
        "Complete laboratory manual for introductory physics experiments including mechanics, thermodynamics, and electromagnetism. Contains detailed procedures, safety guidelines, data collection sheets, and analysis methods for over 20 different experiments.",
      file_url: "/files/physics-lab.pdf",
      file_name: "physics-lab-manual.pdf",
      file_size: 5242880,
      file_type: "pdf",
      subject: "Physics",
      education_level: "High School",
      curriculum: "Science",
      tags: ["physics", "laboratory", "experiments", "mechanics", "thermodynamics"],
      learning_objectives:
        "Understand fundamental physics principles through hands-on experiments and develop laboratory skills",
      download_count: 189,
      view_count: 892,
      created_at: "2024-01-10T14:20:00Z",
      updated_at: "2024-01-18T09:30:00Z",
      uploader: {
        id: "user2",
        full_name: "Prof. Michael Chen",
        email: "m.chen@highschool.edu",
        avatar_url: "/avatars/michael.jpg",
      },
    },
    {
      id: "3",
      user_id: "user3",
      title: "Chemistry Reaction Mechanisms",
      description:
        "Visual guide to organic chemistry reaction mechanisms with step-by-step explanations and molecular diagrams. Covers nucleophilic substitution, elimination reactions, addition reactions, and more advanced topics in organic synthesis.",
      file_url: "/files/chemistry-mechanisms.pptx",
      file_name: "reaction-mechanisms.pptx",
      file_size: 15728640,
      file_type: "pptx",
      subject: "Chemistry",
      education_level: "University",
      curriculum: "Science",
      tags: ["chemistry", "organic", "reactions", "mechanisms", "synthesis"],
      learning_objectives:
        "Master organic reaction mechanisms and understand the principles governing chemical transformations",
      download_count: 156,
      view_count: 734,
      created_at: "2024-01-08T09:15:00Z",
      updated_at: "2024-01-12T16:45:00Z",
      uploader: {
        id: "user3",
        full_name: "Dr. Emily Rodriguez",
        email: "e.rodriguez@university.edu",
        avatar_url: "/avatars/emily.jpg",
      },
    },
  ]

  return mockMaterials.find((material) => material.id === id) || null
}

// Server function to increment view count
async function incrementViewCount(id: string) {
  const supabase = await createClient()

  // Uncomment when using real Supabase:
  /*
  await supabase
    .from('library_materials')
    .update({ view_count: supabase.raw('view_count + 1') })
    .eq('id', id)
  */
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
