"use client"

import { useState, useEffect, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import type { Post, PostFilters } from "@/lib/types"

export function usePosts(filters?: PostFilters) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      let query = supabase
        .from("posts")
        .select(`
          *,
          author:users(*),
          category:categories(*),
          tags:post_tags(tag:tags(*))
        `)
        .eq("status", "published")
        .order("is_pinned", { ascending: false })
        .order("created_at", { ascending: false })

      if (filters?.search) {
        query = query.textSearch("search_vector", filters.search)
      }

      if (filters?.category_id) {
        query = query.eq("category_id", filters.category_id)
      }

      if (filters?.author_id) {
        query = query.eq("author_id", filters.author_id)
      }

      if (filters?.is_pinned !== undefined) {
        query = query.eq("is_pinned", filters.is_pinned)
      }

      if (filters?.is_solved !== undefined) {
        query = query.eq("is_solved", filters.is_solved)
      }

      const { data, error: fetchError } = await query

      if (fetchError) throw fetchError

      // Transform the data to flatten tags
      const transformedPosts =
        data?.map((post) => ({
          ...post,
          tags: post.tags?.map((pt: any) => pt.tag) || [],
        })) || []

      setPosts(transformedPosts)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  const createPost = async (postData: Partial<Post>) => {
    try {
      const { data, error } = await supabase.from("posts").insert([postData]).select().single()

      if (error) throw error

      await fetchPosts() // Refresh the list
      return data
    } catch (err) {
      throw err instanceof Error ? err : new Error("Failed to create post")
    }
  }

  const updatePost = async (id: string, updates: Partial<Post>) => {
    try {
      const { data, error } = await supabase.from("posts").update(updates).eq("id", id).select().single()

      if (error) throw error

      await fetchPosts() // Refresh the list
      return data
    } catch (err) {
      throw err instanceof Error ? err : new Error("Failed to update post")
    }
  }

  const deletePost = async (id: string) => {
    try {
      const { error } = await supabase.from("posts").delete().eq("id", id)

      if (error) throw error

      await fetchPosts() // Refresh the list
    } catch (err) {
      throw err instanceof Error ? err : new Error("Failed to delete post")
    }
  }

  const incrementViewCount = async (id: string) => {
    try {
      const { error } = await supabase.from("posts").update({ view_count: supabase.sql`view_count + 1` }).eq("id", id)

      if (error) throw error
    } catch (err) {
      console.error("Failed to increment view count:", err)
    }
  }

  return {
    posts,
    loading,
    error,
    fetchPosts,
    createPost,
    updatePost,
    deletePost,
    incrementViewCount,
  }
}

export function usePost(id: string) {
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPost = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from("posts")
        .select(`
          *,
          author:users(*),
          category:categories(*),
          tags:post_tags(tag:tags(*)),
          comments:comments(
            *,
            author:users(*),
            replies:comments(
              *,
              author:users(*)
            )
          )
        `)
        .eq("id", id)
        .single()

      if (fetchError) throw fetchError

      // Transform the data
      const transformedPost = {
        ...data,
        tags: data.tags?.map((pt: any) => pt.tag) || [],
        comments: data.comments?.filter((c: any) => !c.parent_comment_id) || [],
      }

      setPost(transformedPost)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Post not found")
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    if (id) {
      fetchPost()
    }
  }, [fetchPost, id])

  return {
    post,
    loading,
    error,
    refetch: fetchPost,
  }
}
