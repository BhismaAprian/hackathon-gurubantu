"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";

export async function createComment(formData: FormData) {
  const supabase = await createClient();
  const user = (await supabase.auth.getUser()).data.user;

  if (!user) {
    throw new Error("User not authenticated");
  }

  const content = formData.get("content") as string;
  const postId = formData.get("post_id") as string;
  const parentId = formData.get("parent_id") as string | null;
  const isAiGenerated = formData.get("is_ai_generated") === "true";
  const attachment = formData.get("attachment") as File | null;

  let attachmentUrl = null;
  let attachmentName = null;

  // Handle file upload if attachment exists
  if (attachment && attachment.size > 0) {
    const fileExt = attachment.name.split(".").pop();
    const filePath = `forum-attachments/${uuidv4()}.${fileExt}`;

    const { data: storageData, error: storageError } = await supabase.storage
      .from("forum-attachments")
      .upload(filePath, attachment);

    if (storageError) {
      throw new Error("Failed to upload attachment: " + storageError.message);
    }

    const { data: publicUrlData } = await supabase.storage
      .from("forum-attachments")
      .getPublicUrl(filePath);

    attachmentUrl = publicUrlData.publicUrl;
    attachmentName = attachment.name;
  }

  // Insert comment
  const commentId = uuidv4();
  const { error: insertError } = await supabase.from("comment").insert({
    id: commentId,
    content,
    post_id: postId,
    author_id: user.id,
    parent_comment_id: parentId,
    is_solution: false,
    is_ai_generated: isAiGenerated,
    like_count: 0,
    attachment_url: attachmentUrl,
    attachment_name: attachmentName,
    created_at: new Date().toISOString(),
  });

  if (insertError) {
    throw new Error("Failed to create comment: " + insertError.message);
  }

  // Update reply count
  const { data: thread, error: threadError } = await supabase
    .from("threads")
    .select("reply_count, has_ai_responded")
    .eq("id", postId)
    .single();

  if (threadError || !thread) {
    throw new Error("Gagal mengambil data thread: " + threadError?.message);
  }

  // Hitung nilai baru
  const newReplyCount = (thread.reply_count ?? 0) + 1;
  const updatedHasAiResponded = isAiGenerated ? true : thread.has_ai_responded;

  // Update
  await supabase
    .from("threads")
    .update({
      reply_count: newReplyCount,
      has_ai_responded: updatedHasAiResponded,
    })
    .eq("id", postId);

  revalidatePath(`/forum/thread/${postId}`);
}

export async function toggleVote(
  targetId: string,
  targetType: "thread" | "comment",
  voteValue: number
) {
  const supabase = await createClient();
  const user = (await supabase.auth.getUser()).data.user;

  if (!user) {
    throw new Error("User not authenticated");
  }

  const tableName = targetType === "thread" ? "threads" : "comment";
  const voteTableName = "vote";

  const { data: existingVote } = await supabase
    .from(voteTableName)
    .select("*")
    .eq("user_id", user.id)
    .eq(targetType === "thread" ? "thread_id" : "comment_id", targetId)
    .single();

  if (existingVote) {
    // Update existing vote
    const { error: updateError } = await supabase
      .from(voteTableName)
      .update({ value: voteValue })
      .eq("id", existingVote.id);

    if (updateError) {
      throw new Error("Failed to update vote: " + updateError.message);
    }

    // Update like count (difference between new and old vote)
    const { data: targetData, error: likeFetchError } = await supabase
      .from(tableName)
      .select("like_count")
      .eq("id", targetId)
      .single();

    if (likeFetchError || !targetData) {
      throw new Error(
        "Gagal mengambil like_count saat insert: " + likeFetchError?.message
      );
    }

    const updatedLikeCount = (targetData.like_count ?? 0) + voteValue;

    const { error: likeUpdateError } = await supabase
      .from(tableName)
      .update({ like_count: updatedLikeCount })
      .eq("id", targetId);

    if (likeUpdateError) {
      throw new Error(
        "Gagal mengupdate like_count setelah insert: " + likeUpdateError.message
      );
    }

    // Update like count
    const { data } = await supabase
      .from(tableName)
      .select("like_count")
      .eq("id", targetId)
      .single();

    const newLikeCount = (data?.like_count ?? 0) + voteValue;

    await supabase
      .from(tableName)
      .update({ like_count: newLikeCount })
      .eq("id", targetId);
  }

  // Get thread ID for revalidation
  let threadId = targetId;
  if (targetType === "comment") {
    const { data: comment } = await supabase
      .from("comment")
      .select("post_id")
      .eq("id", targetId)
      .single();
    if (comment) {
      threadId = comment.post_id;
    }
  }

  revalidatePath(`/forum/thread/${threadId}`);
}

export async function generateAIReply(
  threadId: string,
  threadContent: string
): Promise<string> {
  const apiKey = '2c7315b858eef48bf960adc241681c6e2bacbadf10ea29bd0a4c5fb788ae158e'

  try {
    const res = await fetch('https://api.together.xyz/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-ai/DeepSeek-V3',
        messages: [
          {
            role: 'user',
            content: `Ini isi thread "${threadId}": ${threadContent}\n\nBerikan balasan yang membantu dan edukatif berdasarkan konten di atas.`,
          },
        ],
      }),
    })

    const data = await res.json()

    const reply = data.choices?.[0]?.message?.content?.trim()

    if (!reply) throw new Error('Balasan kosong dari Together AI.')

    return reply
  } catch (error) {
    console.error('Gagal generate AI reply:', error)
    return 'Maaf, terjadi kesalahan saat menghasilkan balasan AI.'
  }
}


export async function markAsSolution(commentId: string) {
  const supabase = await createClient();
  const user = (await supabase.auth.getUser()).data.user;

  if (!user) {
    throw new Error("User not authenticated");
  }

  // Mark comment as solution
  const { error } = await supabase
    .from("comment")
    .update({ is_solution: false })
    .eq("id", commentId);

  if (error) {
    throw new Error("Failed to mark as solution: " + error.message);
  }

  // Get thread ID
  const { data: comment } = await supabase
    .from("comment")
    .select("post_id")
    .eq("id", commentId)
    .single();

  if (comment) {
    // Mark thread as solved
    await supabase
      .from("threads")
      .update({ is_solved: true })
      .eq("id", comment.post_id);
    revalidatePath(`/forum/thread/${comment.post_id}`);
  }
}
