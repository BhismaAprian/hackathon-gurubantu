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

  if (error) {
    console.error('Error fetching library materials:', error)
    return []
  }

  return data || []

  // Mock data for now
  // return [
  //   {
  //     id: "1",
  //     user_id: "user1",
  //     title: "Advanced Calculus Notes",
  //     description:
  //       "Comprehensive notes covering differential and integral calculus with practical examples and problem-solving techniques.",
  //     file_url: "/files/calculus-notes.pdf",
  //     file_name: "calculus-notes.pdf",
  //     file_size: 2048576,
  //     file_type: "pdf",
  //     subject: "Mathematics",
  //     education_level: "University",
  //     curriculum: "Engineering",
  //     tags: ["calculus", "mathematics", "derivatives", "integrals"],
  //     learning_objectives: "Master advanced calculus concepts",
  //     download_count: 245,
  //     view_count: 1203,
  //     created_at: "2024-01-15T10:30:00Z",
  //   },
  //   {
  //     id: "2",
  //     user_id: "user2",
  //     title: "Physics Lab Manual",
  //     description:
  //       "Complete laboratory manual for introductory physics experiments including mechanics, thermodynamics, and electromagnetism.",
  //     file_url: "/files/physics-lab.pdf",
  //     file_name: "physics-lab-manual.pdf",
  //     file_size: 5242880,
  //     file_type: "pdf",
  //     subject: "Physics",
  //     education_level: "High School",
  //     curriculum: "Science",
  //     tags: ["physics", "laboratory", "experiments", "mechanics"],
  //     learning_objectives: "Understand fundamental physics principles through hands-on experiments",
  //     download_count: 189,
  //     view_count: 892,
  //     created_at: "2024-01-10T14:20:00Z",
  //   },
  //   {
  //     id: "3",
  //     user_id: "user3",
  //     title: "Chemistry Reaction Mechanisms",
  //     description:
  //       "Visual guide to organic chemistry reaction mechanisms with step-by-step explanations and molecular diagrams.",
  //     file_url: "/files/chemistry-mechanisms.pptx",
  //     file_name: "reaction-mechanisms.pptx",
  //     file_size: 15728640,
  //     file_type: "pptx",
  //     subject: "Chemistry",
  //     education_level: "University",
  //     curriculum: "Science",
  //     tags: ["chemistry", "organic", "reactions", "mechanisms"],
  //     learning_objectives: "Master organic reaction mechanisms",
  //     download_count: 156,
  //     view_count: 734,
  //     created_at: "2024-01-08T09:15:00Z",
  //   },
  //   {
  //     id: "4",
  //     user_id: "user4",
  //     title: "Programming Fundamentals",
  //     description:
  //       "Introduction to programming concepts using Python. Covers variables, loops, functions, and basic data structures.",
  //     file_url: "/files/programming-basics.pdf",
  //     file_name: "programming-fundamentals.pdf",
  //     file_size: 3145728,
  //     file_type: "pdf",
  //     subject: "Computer Science",
  //     education_level: "High School",
  //     curriculum: "Technology",
  //     tags: ["programming", "python", "basics", "coding"],
  //     learning_objectives: "Learn fundamental programming concepts",
  //     download_count: 312,
  //     view_count: 1456,
  //     created_at: "2024-01-12T16:45:00Z",
  //   },
  //   {
  //     id: "5",
  //     user_id: "user5",
  //     title: "World History Timeline",
  //     description:
  //       "Interactive timeline covering major world events from ancient civilizations to modern times with detailed explanations.",
  //     file_url: "/files/history-timeline.pdf",
  //     file_name: "world-history-timeline.pdf",
  //     file_size: 8388608,
  //     file_type: "pdf",
  //     subject: "History",
  //     education_level: "High School",
  //     curriculum: "Social Studies",
  //     tags: ["history", "timeline", "world events", "civilizations"],
  //     learning_objectives: "Understand chronological development of world history",
  //     download_count: 98,
  //     view_count: 567,
  //     created_at: "2024-01-05T11:30:00Z",
  //   },
  //   {
  //     id: "6",
  //     user_id: "user6",
  //     title: "Biology Cell Structure",
  //     description:
  //       "Detailed study of cell structure and function with high-resolution diagrams and comparative analysis.",
  //     file_url: "/files/cell-structure.pdf",
  //     file_name: "biology-cell-structure.pdf",
  //     file_size: 4194304,
  //     file_type: "pdf",
  //     subject: "Biology",
  //     education_level: "University",
  //     curriculum: "Science",
  //     tags: ["biology", "cells", "structure", "function"],
  //     learning_objectives: "Understand cellular biology fundamentals",
  //     download_count: 203,
  //     view_count: 945,
  //     created_at: "2024-01-18T13:20:00Z",
  //   },
  // ]
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
