'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { v4 as uuidv4 } from 'uuid'

export async function upload(formData: FormData) {
  const supabase = await createClient()
  const user = (await supabase.auth.getUser()).data.user


  if (!user) {
    redirect('/login')
  }

  const id = uuidv4()

  const title = formData.get('judul') as string
  const subject = formData.get('mata_pelajaran') as string
  const education_level = formData.get('jenjang') as string
  const curriculum = formData.get('kurikulum') as string
  const description = formData.get('deskripsi') as string
  const agree = formData.get('agree')
  const file = formData.get('file') as File  
  const tagsRaw = formData.get('tag') as string
  const learningObjectivesRaw = formData.get('tujuan') as string

// Ubah string tag "ipa, matematika, fisika" menjadi array ["ipa", "matematika", "fisika"]
const tags = tagsRaw ? tagsRaw.split(',').map(tag => tag.trim()) : []
const learning_objectives = learningObjectivesRaw ? learningObjectivesRaw.split(',').map(obj => obj.trim()) : []

  if (!file || !agree) {
    throw new Error('File dan persetujuan wajib diisi.')
  }

  // Upload ke Supabase Storage
  const fileExt = file.name.split('.').pop()
  const filePath = `materials/${id}.${fileExt}`

  const { data: storageData, error: storageError } = await supabase.storage
    .from('library-materials')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    })

  if (storageError) {
    throw new Error('Gagal mengunggah file: ' + storageError.message)
  }

  // Dapatkan URL publik
  const { data: publicUrlData } = supabase.storage
    .from('library-materials')
    .getPublicUrl(filePath)

  const file_url = publicUrlData.publicUrl

  const { error: insertError } = await supabase.from('library_materials').insert({
    id,
    user_id: user.id,
    title,
    subject,
    education_level,
    curriculum,
    description,
    learning_objectives,  // sudah array
    tags,                 // sudah array
    // region,
    file_name: file.name,
    file_type: file.type,
    file_size: file.size,
    file_url,
    is_approved: false,
    download_count: 0,
    view_count: 0,
    rating: 0,
    rating_count: 0,
  })


  if (insertError) {
    throw new Error('Gagal menyimpan metadata: ' + (insertError?.message ?? JSON.stringify(insertError)))
    // throw new Error('Gagal menyimpan metadata: ' + JSON.stringify(insertError))

    // throw new Error('Gagal menyimpan metadata: ' + insertError.message)
  }

  // Refresh halaman dan redirect
  revalidatePath('/library')
  redirect('/library')
}
