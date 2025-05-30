"use client"

import type React from "react"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// import Navbar from "@/components/navbar"

import { useForm } from "react-hook-form"
import { RegisterForm, registerSchema } from "./schema"
import { zodResolver } from "@hookform/resolvers/zod"

import { useState } from "react"
import { createClient } from "@/utils/supabase/client"

export default function RegisterPage() {
  const supabase = createClient()
  const [error, setError] = useState<string>();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "relawan",
      teaching_experience: "",
    },
  })

  async function onSubmit(v: RegisterForm) {
    const { error: signUpError, } = await supabase.auth.signUp({
      email: v.email,
      password: v.password,
      options: {
        data: {
          full_name: v.full_name,
          email: v.email,
          role: v.role,
          teaching_experience: v.teaching_experience,
        }
      }
    })

    if (signUpError) {
      setError(signUpError.message)
      return;
    }

    toast.success("Akun Anda telah berhasil dibuat.")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      
      {/* <Navbar /> */}

      <div className="flex items-center justify-center py-12 px-4 font-jakarta">
        <Card className="w-full max-w-2xl border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-800">
              Bergabung dengan <span className="text-[#084734]">GuruBantu</span>
            </CardTitle>
            <CardDescription>Daftar untuk mengakses forum dan perpustakaan digital</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              {error && <p className="text-red-600 text-sm">{error}</p>}

              <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="full_name">Nama Lengkap *</Label>
                  <Input
                    id="full_name"
                    type="text"
                    {...register("full_name")}
                    placeholder="Nama lengkap Anda"
                  />
                  {errors.full_name?.message && <p className="text-red-600 text-sm">{errors.full_name.message}</p>}
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="nama@email.com"
                  />
                  {errors.email?.message && <p className="text-red-600 text-sm">{errors.email.message}</p>}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    {...register("password")}
                    placeholder="Minimal 8 karakter"
                  />
                  {errors.password?.message && <p className="text-red-600 text-sm">{errors.password.message}</p>}
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="confirmPassword">Konfirmasi Password *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...register("confirmPassword")}
                    placeholder="Ulangi password"
                  />
                  {errors.confirmPassword?.message && <p className="text-red-600 text-sm">{errors.confirmPassword.message}</p>}
                </div>
              </div>

              <div className="grid gap-3">
                <Label>Peran *</Label>
                <Select onValueChange={(value) => setValue("role", value as "guru" | "relawan")} defaultValue="relawan">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih peran" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relawan">Relawan</SelectItem>
                    <SelectItem value="guru">Guru</SelectItem>
                    {/* <SelectItem value="admin">Admin</SelectItem> */}
                  </SelectContent>
                </Select>
                {errors.role?.message && <p className="text-red-600 text-sm">{errors.role.message}</p>}
              </div>

              <div className="grid gap-3">
                <Label>Pengalaman Mengajar *</Label>
                <Select onValueChange={(value) => setValue("teaching_experience", value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih pengalaman" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Kurang dari 1 tahun">Kurang dari 1 tahun</SelectItem>
                    <SelectItem value="1-3 tahun">1-3 tahun</SelectItem>
                    <SelectItem value="4-7 tahun">4-7 tahun</SelectItem>
                    <SelectItem value="Lebih dari 7 tahun">Lebih dari 7 tahun</SelectItem>
                  </SelectContent>
                </Select>
                {errors.teaching_experience?.message && <p className="text-red-600 text-sm">{errors.teaching_experience.message}</p>}
              </div>

              <Button type="submit" className="w-full">
                Daftar Sekarang
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
