import UserLayout from "@/components/layout/UserLayout"
import { createClient } from "@/utils/supabase/server"
import { notFound } from "next/navigation"
import ForumDetailClient from "./forum-detail-client"

// Function to fetch thread data with comments
async function getThreadData(id: string) {
  const supabase = await createClient()
  console.log("Fetching thread data for ID:", id)

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

    if (threadError) {
      console.error("Error fetching thread:", threadError)
      return null
    }

    if (!thread) {
      console.error("Thread not found for ID:", id)
      return null
    }

    console.log("Thread fetched successfully:", thread.id, thread.title)

    // Fetch comments using post_id (consistent with create-comment action)
    console.log("Fetching comments for thread ID:", id, "using post_id field")

    const { data: comments, error: commentsError } = await supabase
      .from("comment")
      .select(`
        id,
        content,
        post_id,
        author_id,
        parent_comment_id,
        is_solution,
        is_ai_generated,
        like_count,
        attachment_url,
        attachment_name,
        created_at,
        author:author_id (
          id,
          full_name,
          avatar_url
        )
      `)
      .eq("post_id", id) // Using post_id as confirmed by the action files
      .order("created_at", { ascending: true })

    
    if (commentsError) {
      console.error("Error fetching comments:", commentsError)
      return {
        thread,
        comments: [],
        error: `Failed to fetch comments: ${commentsError.message}`,
      }
    }

    console.log(`Successfully fetched ${comments?.length || 0} comments for thread ID:`, id)

    // Debug: Log first comment if available
    if (comments && comments.length > 0) {
      console.log("First comment:", {
        id: comments[0].id,
        content: comments[0].content?.substring(0, 50) + "...",
        post_id: comments[0].post_id,
        author: comments[0].author?.full_name,
      })
    } else {
      console.log("No comments found for this thread")

      // Additional debug: Check if there are any comments in the table at all
      const { data: allComments, error: allCommentsError } = await supabase
        .from("comment")
        .select("id, post_id, content")
        .limit(5)

      if (!allCommentsError && allComments) {
        console.log(`Total comments in database: ${allComments.length}`)
        if (allComments.length > 0) {
          console.log(
            "Sample comments:",
            allComments.map((c) => ({
              id: c.id,
              post_id: c.post_id,
              content: c.content?.substring(0, 30) + "...",
            })),
          )
        }
      }
    }

    // Increment view count (don't await to avoid blocking)
    supabase
      .from("threads")
      .update({ view_count: (thread.view_count || 0) + 1 })
      .eq("id", id)
      .then(({ error }) => {
        if (error) console.error("Error updating view count:", error)
      })

    return {
      thread,
      comments: comments || [],
    }
  } catch (error) {
    console.error("Unexpected error in getThreadData:", error)
    return null
  }
}

// Get user votes - updated to match the vote table structure
async function getUserVotes(userId: string, threadId: string) {
  const supabase = await createClient()

  try {
    // Get thread votes
    const { data: threadVotes, error: threadVoteError } = await supabase
      .from("vote")
      .select("*")
      .eq("user_id", userId)
      .eq("thread_id", threadId)

    if (threadVoteError) {
      console.error("Error fetching thread votes:", threadVoteError)
    }

    // Get comment IDs for this thread using post_id
    const { data: commentIds, error: commentIdError } = await supabase
      .from("comment")
      .select("id")
      .eq("post_id", threadId) // Using post_id consistently

    if (commentIdError) {
      console.error("Error fetching comment IDs:", commentIdError)
    }

    // Get comment votes if there are comments
    let commentVotes = []
    if (commentIds && commentIds.length > 0) {
      const ids = commentIds.map((c) => c.id)
      const { data: votes, error: voteError } = await supabase
        .from("vote")
        .select("*")
        .eq("user_id", userId)
        .in("comment_id", ids)

      if (voteError) {
        console.error("Error fetching comment votes:", voteError)
      } else if (votes) {
        commentVotes = votes
      }
    }

    // Combine both vote arrays
    return [...(threadVotes || []), ...commentVotes]
  } catch (error) {
    console.error("Error in getUserVotes:", error)
    return []
  }
}

export default async function ThreadDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  console.log("Rendering thread detail page for ID:", id)

  // Get thread data
  const threadData = await getThreadData(id)

  if (!threadData) {
    console.error("Thread data not found for ID:", id)
    notFound()
  }

  // Get current user
  const supabase = await createClient()
  const { data: userData } = await supabase.auth.getUser()
  const currentUser = userData?.user

  console.log("Current user:", currentUser?.id || "Not logged in")

  // Get user votes if logged in
  let userVotes = []
  if (currentUser) {
    try {
      userVotes = await getUserVotes(currentUser.id, id)
      console.log(`Fetched ${userVotes.length} votes for user:`, currentUser.id)
    } catch (error) {
      console.error("Error fetching user votes:", error)
    }
  }

  // Debug: Log the final data structure
 
  return (
    <UserLayout>
      <div className="container p-8 bg-white rounded-lg h-screen overflow-y-auto">
        <ForumDetailClient threadData={threadData} currentUser={currentUser} initialVotes={userVotes} />
      </div>
    </UserLayout>
  )
}
