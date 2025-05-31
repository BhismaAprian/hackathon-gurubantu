import { z } from 'zod';
export const userSchema = z.object({
  id: z.string(),
  full_name: z.string().min(1, { message: 'Nama lengkap tidak boleh kosong' }),
  email: z.string().email({ message: 'Email tidak valid' }),
  role: z.enum(['relawan', 'admin']).default('relawan'),
  avatar_url: z.string().optional(),
  teachig_experience: z.string().optional(),
});

export type User = z.infer<typeof userSchema>;

export const threadSchema = z.object({
  id: z.string(),
  title: z.string().min(1, { message: 'Judul tidak boleh kosong' }),
  content: z.string().min(1, { message: 'Konten tidak boleh kosong' }),
  tags: z.array(z.string()).min(1, { message: 'Setidaknya satu tag diperlukan' }),
  slug: z.string(),
  author_id: z.string().min(1, { message: 'ID penulis tidak boleh kosong' }),
  category_id: z.string().min(1, { message: 'Kategori tidak boleh kosong' }),
  like_count: z.number().default(0),
  view_count: z.number().default(0),
  reply_count: z.number().default(0),
  attachment_url: z.union([z.string(), z.instanceof(File)]).optional(),
  attachment_name: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  author: z.object({
    full_name: z.string(),
    avatar_url: z.string(),
    role: z.enum(['relawan', 'guru']).default('relawan'),
    teaching_experience: z.string().optional(),
  })
})

export const threadFormSchema = threadSchema.pick({
  title: true,
  content: true,
  tags: true,
  slug: true,
  author_id: true,
  category_id: true,
  attachment_url: true,
  attachment_name: true,
});

export type ThreadForm = z.infer<typeof threadFormSchema>;
export type Thread = z.infer<typeof threadSchema>;

