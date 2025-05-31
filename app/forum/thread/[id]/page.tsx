import UserLayout from "@/components/layout/UserLayout"
import { createClient } from "@/utils/supabase/server"
import { notFound } from "next/navigation"
import ForumDetailClient from "./forum-detail-client"

// Function to fetch thread data with comments
async function getThreadData(id: string) {
  const supabase = await createClient()

  try {
    // Fetch thread with author, category, and tags
    const { data: thread, error: threadError } = await supabase
      .from("threads")
      .select(`
        *,
        author:author_id (
          id,
          full_name,
          avatar_url
        ),
        category:category_id (
          id,
          name
        ),
        thread_tags (
          tag:tag_id (
            id,
            name
          )
        )
      `)
      .eq("id", id)
      .single()

    if (threadError || !thread) {
      console.error("Error fetching thread:", threadError)
      return null
    }

    // Fetch comments for this thread
    const { data: comments, error: commentsError } = await supabase
      .from("comment")
      .select(`
        *,
        author:author_id (
          id,
          full_name,
          avatar_url
        )
      `)
      .eq("post_id", id)
      .order("created_at", { ascending: true })

    
    if (commentsError) {
      console.error("Error fetching comments:", commentsError)
    }

    // Increment view count
    await supabase
      .from("threads")
      .update({ view_count: (thread.view_count || 0) + 1 })
      .eq("id", id)

    return {
      thread,
      comments: comments || [],
    }
  } catch (error) {
    console.error("Error fetching thread data:", error)
    return null
  }
}

// Get user votes
async function getUserVotes(userId: string, threadId: string) {
  const supabase = await createClient()

  // Step 1: Ambil semua comment id di thread ini
  const { data: commentIdsData, error: commentError } = await supabase
    .from("comment")
    .select("id")
    .eq("post_id", threadId)

  if (commentError) {
    console.error("Error fetching comment IDs:", commentError)
    return []
  }

  const commentIds = commentIdsData?.map((c) => c.id) || []

  // Step 2: Ambil semua vote user untuk thread dan comments tersebut
  let query = await supabase
    .from("votes")
    .select("*")
    .eq("user_id", userId)

  // Tambahkan kondisi OR: vote di thread ATAU comment dalam thread
  if (commentIds.length > 0) {
    query = query.or(`thread_id.eq.${threadId},comment_id.in.(${commentIds.join(",")})`)
  } else {
    // Jika tidak ada comment, hanya cari vote di thread
    query = query.eq("thread_id", threadId)
  }

  const { data: votes, error } = await query

  if (error) {
    console.error("Error fetching votes:", error)
    return []
  }

  return votes || []
}

export default async function ThreadDetailPage({ params }: { params: { id: string } }) {
  // Destructure params after awaiting
  const { id } = await params

  // Get thread data
  const threadData = await getThreadData(id)

  if (!threadData) {
    notFound()
  }

  // Get current user
  const supabase = await createClient()
  const { data: userData } = await supabase.auth.getUser()
  const currentUser = userData?.user

  // Get user votes if logged in
  const userVotes = currentUser ? await getUserVotes(currentUser.id, id) : []

  return (
    <UserLayout>
      <div className="container p-8 bg-white rounded-lg h-screen overflow-y-auto">
        <ForumDetailClient threadData={threadData} currentUser={currentUser} initialVotes={userVotes} />
      </div>
    </UserLayout>
  )
}