export type UserRole = "guru" | "relawan"
export type PostStatus = "published" | "draft"
export type EducationLevel = "paud" | "sd" | "smp" | "sma" | "universitas"

export interface User {
  user_metadata: {
    id: string
    full_name: string
    email: string
    avatar_url?: string
    role: UserRole
    subject?: string
    education_level?: EducationLevel
    teaching_experience?: string
    location?: string
    school_name?: string
    bio?: string
    is_active: boolean
    created_at: string
    updated_at: string
  }
}