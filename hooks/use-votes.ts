"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import type { Vote } from "@/lib/types"

export function useVotes() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const vote = async (userId: string, targetId: string, targetType: "post" | "comment", value: 1 | -1) => {
    try {
      setLoading(true)
      setError(null)

      const voteData = {
        user_id: userId,
        value,
        ...(targetType === "post" ? { post_id: targetId } : { comment_id: targetId }),
      }

      // Check if user already voted
      const { data: existingVote } = await supabase
        .from("votes")
        .select("*")
        .eq("user_id", userId)
        .eq(targetType === "post" ? "post_id" : "comment_id", targetId)
        .single()

      if (existingVote) {
        if (existingVote.value === value) {
          // Remove vote if clicking same button
          const { error: deleteError } = await supabase.from("votes").delete().eq("id", existingVote.id)

          if (deleteError) throw deleteError
          return null
        } else {
          // Update vote if clicking different button
          const { data, error: updateError } = await supabase
            .from("votes")
            .update({ value })
            .eq("id", existingVote.id)
            .select()
            .single()

          if (updateError) throw updateError
          return data
        }
      } else {
        // Create new vote
        const { data, error: createError } = await supabase.from("votes").insert([voteData]).select().single()

        if (createError) throw createError
        return data
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to vote"
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const getUserVote = async (
    userId: string,
    targetId: string,
    targetType: "post" | "comment",
  ): Promise<Vote | null> => {
    try {
      const { data, error } = await supabase
        .from("votes")
        .select("*")
        .eq("user_id", userId)
        .eq(targetType === "post" ? "post_id" : "comment_id", targetId)
        .single()

      if (error && error.code !== "PGRST116") throw error
      return data || null
    } catch (err) {
      console.error("Failed to get user vote:", err)
      return null
    }
  }

  const getVoteCounts = async (
    targetId: string,
    targetType: "post" | "comment",
  ): Promise<{ upvotes: number; downvotes: number; total: number }> => {
    try {
      const { data, error } = await supabase
        .from("votes")
        .select("value")
        .eq(targetType === "post" ? "post_id" : "comment_id", targetId)

      if (error) throw error

      const upvotes = data?.filter((v) => v.value === 1).length || 0
      const downvotes = data?.filter((v) => v.value === -1).length || 0
      const total = upvotes - downvotes

      return { upvotes, downvotes, total }
    } catch (err) {
      console.error("Failed to get vote counts:", err)
      return { upvotes: 0, downvotes: 0, total: 0 }
    }
  }

  return {
    loading,
    error,
    vote,
    getUserVote,
    getVoteCounts,
  }
}
