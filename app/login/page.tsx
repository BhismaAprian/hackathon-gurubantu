"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import Navbar from "@/components/navbar"

export default function LoginPage() {
  const router = useRouter()
  const { signIn, loading } = useAuth()
  const { toast } = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      console.log("Attempting to sign in with:", formData.email)

      // Validate form data
      if (!formData.email || !formData.password) {
        setError("Email dan password harus diisi")
        setIsLoading(false)
        return
      }

      // Use the signIn function from useAuth hook
      await signIn(formData.email, formData.password)

      console.log("Sign in successful")

      // Show success message
      toast({
        title: "Login Berhasil",
        description: "Selamat datang di GuruBantu!",
      })

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Login error:", error)

      let errorMessage = "Terjadi kesalahan saat login"

      // Handle specific Supabase auth errors
      if (error.message?.includes("Invalid login credentials")) {
        errorMessage = "Email atau password salah"
      } else if (error.message?.includes("Email not confirmed")) {
        errorMessage = "Silakan konfirmasi email Anda terlebih dahulu"
      } else if (error.message?.includes("Too many requests")) {
        errorMessage = "Terlalu banyak percobaan login. Coba lagi nanti"
      } else if (error.message) {
        errorMessage = error.message
      }

      setError(errorMessage)

      toast({
        title: "Login Gagal",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <Navbar />

      <div className="flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-800">Masuk ke GuruBantu</CardTitle>
            <CardDescription>Masuk untuk mengakses forum dan perpustakaan digital</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="border-gray-200 focus:border-blue-500"
                  disabled={isLoading || loading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="border-gray-200 focus:border-blue-500 pr-10"
                    disabled={isLoading || loading}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading || loading}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700">
                  Lupa password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800"
                disabled={isLoading || loading}
              >
                {isLoading || loading ? "Memproses..." : "Masuk"}
              </Button>

              <div className="text-center text-sm text-gray-600">
                Belum punya akun?{" "}
                <Link href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                  Daftar sekarang
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
