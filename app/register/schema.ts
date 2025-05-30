import { z } from "zod";
export const registerSchema = z.object({
  full_name: z.string().min(1, { message: "Nama lengkap tidak boleh kosong" }),
  email: z.string().email({ message: "Email tidak valid" }),
  avatar_url: z.string().url({ message: "URL avatar tidak valid" }).optional(),
  role: z.enum(["guru", "relawan"], { message: "Peran harus 'guru' atau 'relawan'" }),
  education_level: z.enum(["paud", "sd", "smp", "sma", "d1", "d2", "d3", "d4", "s1", "s2", "s3"]).optional(),
  location: z.string().optional(),
  school_name: z.string().optional(),
  bio: z.string().optional(),
  is_active: z.boolean().optional(),
  password: z.string().min(6, { message: "Password harus minimal 6 karakter" }),
  confirmPassword: z.string(),
  teaching_experience: z.string().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Konfirmasi password tidak cocok",
  path: ["confirmPassword"],
})
export type RegisterForm = z.infer<typeof registerSchema>;