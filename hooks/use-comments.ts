"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import type { Comment } from "@/lib/types"

export function useComments(postId: string) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createComment = async (commentData: Partial<Comment>) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: createError } = await supabase
        .from("comments")
        .insert([{ ...commentData, post_id: postId }])
        .select(`
          *,
          author:users(*)
        `)
        .single()

      if (createError) throw createError

      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create comment"
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const updateComment = async (id: string, updates: Partial<Comment>) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: updateError } = await supabase
        .from("comments")
        .update(updates)
        .eq("id", id)
        .select(`
          *,
          author:users(*)
        `)
        .single()

      if (updateError) throw updateError

      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update comment"
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const deleteComment = async (id: string) => {
    try {
      setLoading(true)
      setError(null)

      const { error: deleteError } = await supabase.from("comments").delete().eq("id", id)

      if (deleteError) throw deleteError
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete comment"
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const markAsSolution = async (id: string) => {
    try {
      setLoading(true)
      setError(null)

      // First, unmark all other comments as solution
      await supabase.from("comments").update({ is_solution: false }).eq("post_id", postId)

      // Then mark this comment as solution
      const { data, error: updateError } = await supabase
        .from("comments")
        .update({ is_solution: true })
        .eq("id", id)
        .select()
        .single()

      if (updateError) throw updateError

      // Update the post as solved
      await supabase.from("posts").update({ is_solved: true }).eq("id", postId)

      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to mark as solution"
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    createComment,
    updateComment,
    deleteComment,
    markAsSolution,
  }
}
