"use client"

import { useState, useEffect, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import type { LibraryMaterial, LibraryFilters } from "@/lib/types"

export function useLibraryMaterials(filters?: LibraryFilters) {
  const [materials, setMaterials] = useState<LibraryMaterial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMaterials = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      let query = supabase.from("library_materials").select(`
          *,
          uploader:users(*)
        `)

      // Apply filters
      if (filters?.is_approved !== undefined) {
        query = query.eq("is_approved", filters.is_approved)
      } else {
        query = query.eq("is_approved", true) // Default to approved only
      }

      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
      }

      if (filters?.subject) {
        query = query.eq("subject", filters.subject)
      }

      if (filters?.education_level) {
        query = query.eq("education_level", filters.education_level)
      }

      if (filters?.file_type) {
        query = query.eq("file_type", filters.file_type)
      }

      if (filters?.user_id) {
        query = query.eq("user_id", filters.user_id)
      }

      // Apply sorting
      const sortBy = filters?.sortBy || "created_at"
      const sortOrder = filters?.sortOrder || "desc"
      query = query.order(sortBy, { ascending: sortOrder === "asc" })

      const { data, error: fetchError } = await query

      if (fetchError) throw fetchError

      setMaterials(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchMaterials()
  }, [fetchMaterials])

  const createMaterial = async (materialData: Partial<LibraryMaterial>) => {
    try {
      const { data, error } = await supabase
        .from("library_materials")
        .insert([materialData])
        .select(`
          *,
          uploader:users(*)
        `)
        .single()

      if (error) throw error

      await fetchMaterials() // Refresh the list
      return data
    } catch (err) {
      throw err instanceof Error ? err : new Error("Failed to create material")
    }
  }

  const updateMaterial = async (id: string, updates: Partial<LibraryMaterial>) => {
    try {
      const { data, error } = await supabase
        .from("library_materials")
        .update(updates)
        .eq("id", id)
        .select(`
          *,
          uploader:users(*)
        `)
        .single()

      if (error) throw error

      await fetchMaterials() // Refresh the list
      return data
    } catch (err) {
      throw err instanceof Error ? err : new Error("Failed to update material")
    }
  }

  const deleteMaterial = async (id: string) => {
    try {
      const { error } = await supabase.from("library_materials").delete().eq("id", id)

      if (error) throw error

      await fetchMaterials() // Refresh the list
    } catch (err) {
      throw err instanceof Error ? err : new Error("Failed to delete material")
    }
  }

  const incrementDownloadCount = async (id: string) => {
    try {
      const { error } = await supabase
        .from("library_materials")
        .update({ download_count: supabase.sql`download_count + 1` })
        .eq("id", id)

      if (error) throw error
    } catch (err) {
      console.error("Failed to increment download count:", err)
    }
  }

  const incrementViewCount = async (id: string) => {
    try {
      const { error } = await supabase
        .from("library_materials")
        .update({ view_count: supabase.sql`view_count + 1` })
        .eq("id", id)

      if (error) throw error
    } catch (err) {
      console.error("Failed to increment view count:", err)
    }
  }

  return {
    materials,
    loading,
    error,
    fetchMaterials,
    createMaterial,
    updateMaterial,
    deleteMaterial,
    incrementDownloadCount,
    incrementViewCount,
  }
}

export function useLibraryMaterial(id: string) {
  const [material, setMaterial] = useState<LibraryMaterial | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMaterial = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from("library_materials")
        .select(`
          *,
          uploader:users(*)
        `)
        .eq("id", id)
        .single()

      if (fetchError) throw fetchError

      setMaterial(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Material not found")
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    if (id) {
      fetchMaterial()
    }
  }, [fetchMaterial, id])

  return {
    material,
    loading,
    error,
    refetch: fetchMaterial,
  }
}
