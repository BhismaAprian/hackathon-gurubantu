'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { v4 as uuidv4 } from 'uuid'

export async function upload(formData: FormData) {
  const supabase = createClient()
  
  // 1. Verifikasi User
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    redirect('/login?error=not_authenticated')
  }

  // 2. Verifikasi Profile Ada
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    throw new Error('Profile pengguna tidak ditemukan di database')
  }

  // 3. Validasi Form Data
  const id = uuidv4()
  const title = formData.get('judul')?.toString()?.trim()
  const subject = formData.get('mata_pelajaran')?.toString()?.trim()
  const education_level = formData.get('jenjang')?.toString()?.trim()
  const curriculum = formData.get('kurikulum')?.toString()?.trim()
  const description = formData.get('deskripsi')?.toString()?.trim()
  const agree = formData.get('agree')
  const file = formData.get('file') as File | null
  const tagsRaw = formData.get('tag')?.toString()?.trim()
  const learningObjectivesRaw = formData.get('tujuan')?.toString()?.trim()

  // Validasi wajib
  if (!file || !agree || !title || !subject || !education_level || !description) {
    throw new Error('Semua field wajib diisi kecuali tag dan kurikulum')
  }

  // 4. Proses Data Array
  const tags = tagsRaw ? tagsRaw.split(',').map(tag => tag.trim()).filter(tag => tag) : []
  const learning_objectives = learningObjectivesRaw ? 
    learningObjectivesRaw.split(',').map(obj => obj.trim()).filter(obj => obj) : []

  // 5. Upload File
  const fileExt = file.name.split('.').pop()
  const filePath = `materials/${user.id}/${id}.${fileExt}`

  const { error: storageError } = await supabase.storage
    .from('library-materials')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false // Tidak overwrite file yang ada
    })

  if (storageError) {
    throw new Error(`Gagal mengunggah file: ${storageError.message}`)
  }

  // 6. Dapatkan URL File
  const { data: urlData } = supabase.storage
    .from('library-materials')
    .getPublicUrl(filePath)

  // 7. Simpan Metadata
  const { error: insertError } = await supabase.from('library_materials').insert({
    id,
    user_id: user.id,
    title,
    subject,
    education_level,
    curriculum: curriculum || null,
    description,
    learning_objectives,
    tags,
    file_name: file.name,
    file_type: file.type,
    file_size: file.size,
    file_url: urlData.publicUrl,
    is_approved: false,
    download_count: 0,
    view_count: 0,
    rating: 0,
    rating_count: 0,
  })

  if (insertError) {
    // Hapus file yang sudah diupload jika gagal simpan metadata
    await supabase.storage
      .from('library-materials')
      .remove([filePath])
    
    console.error('Detail error:', {
      message: insertError.message,
      details: insertError.details,
      hint: insertError.hint,
      code: insertError.code
    })

    throw new Error(`Gagal menyimpan metadata: ${insertError.message}`)
  }

  // 8. Update Cache dan Redirect
  revalidatePath('/library')
  redirect('/library?upload=success')
}