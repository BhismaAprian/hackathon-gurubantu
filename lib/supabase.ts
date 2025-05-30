import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Storage buckets
export const STORAGE_BUCKETS = {
  AVATARS: "avatars",
  FORUM_ATTACHMENTS: "forum-attachments",
  LIBRARY_MATERIALS: "library-materials",
} as const  

// Helper function to upload files
export async function uploadFile(bucket: string, path: string, file: File, options?: { upsert?: boolean }) {
  const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
    upsert: options?.upsert || false,
  })

  if (error) throw error
  return data
}

// Helper function to get public URL
export function getPublicUrl(bucket: string, path: string) {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

// Helper function to delete file
export async function deleteFile(bucket: string, path: string) {
  const { error } = await supabase.storage.from(bucket).remove([path])
  if (error) throw error
}
