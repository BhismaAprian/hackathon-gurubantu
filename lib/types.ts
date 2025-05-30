export type UserRole = "guru" | "relawan"
export type PostStatus = "published" | "draft"
export type EducationLevel = "paud" | "sd" | "smp" | "sma" | "universitas"

export interface User {
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

export interface Category {
  id: number
  name: string
  slug: string
  description?: string
  color: string
  icon: string
  sort_order: number
  is_active: boolean
  created_at: string
}

export interface Tag {
  id: number
  name: string
  slug: string
  description?: string
  usage_count: number
  created_at: string
}

export interface Post {
  id: string
  title: string
  content: string
  category_id?: number
  summary?: string
  slug: string
  author_id: string
  status: PostStatus
  is_pinned: boolean
  is_solved: boolean
  has_ai_responded: boolean
  view_count: number
  like_count: number
  reply_count: number
  attachment_url?: string
  attachment_name?: string
  created_at: string
  updated_at: string

  // Relations
  author?: User
  category?: Category
  tags?: Tag[]
  comments?: Comment[]
  user_vote?: Vote
}

export interface Comment {
  id: string
  content: string
  post_id: string
  author_id: string
  parent_comment_id?: string
  is_solution: boolean
  is_ai_generated: boolean
  like_count: number
  attachment_url?: string
  attachment_name?: string
  created_at: string
  updated_at: string

  // Relations
  author?: User
  replies?: Comment[]
  user_vote?: Vote
}

export interface Vote {
  id: string
  user_id: string
  post_id?: string
  comment_id?: string
  value: number // -1 or 1
  created_at: string
}

export interface LibraryMaterial {
  id: string
  user_id: string
  title: string
  description?: string
  file_url: string
  file_name: string
  file_size?: number
  file_type?: string
  subject?: string
  education_level?: EducationLevel
  curriculum?: string
  tags: string[]
  learning_objectives: string[]
  is_approved: boolean
  download_count: number
  view_count: number
  rating: number
  rating_count: number
  created_at: string
  updated_at: string

  // Relations
  uploader?: User
}

export interface PostFilters {
  search?: string
  category_id?: number
  tag_ids?: number[]
  author_id?: string
  status?: PostStatus
  is_pinned?: boolean
  is_solved?: boolean
}

export interface LibraryFilters {
  search?: string
  subject?: string
  education_level?: EducationLevel
  file_type?: string
  is_approved?: boolean
  user_id?: string
  sortBy?: "created_at" | "download_count" | "rating" | "title"
  sortOrder?: "asc" | "desc"
}
