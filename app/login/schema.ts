import { z } from "zod";


export const loginSchema = z.object({
  email: z
    .string()
    .email({ message: "Email tidak valid" })
    .min(1, { message: "Email tidak boleh kosong" }),
  password: z
    .string()
    .min(6, { message: "Kata sandi harus memiliki setidaknya 6 karakter" })
    .max(12, { message: "Kata sandi tidak boleh lebih dari 50 karakter" }),
});

export type LoginForm = z.infer<typeof loginSchema>;

