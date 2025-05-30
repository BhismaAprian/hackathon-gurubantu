import { z } from 'zod';
export const threadSchema = z.object({
  title: z.string().min(1, { message: 'Judul tidak boleh kosong' }),
  content: z.string().min(1, { message: 'Konten tidak boleh kosong' }),
  tags: z.array(z.string()).min(1, { message: 'Setidaknya satu tag diperlukan' }),
  slug: z.string(),
  authorId: z.string().min(1, { message: 'ID penulis tidak boleh kosong' }),
  categoryId: z.string().min(1, { message: 'Kategori tidak boleh kosong' }),
})

export type ThreadForm = z.infer<typeof threadSchema>;
